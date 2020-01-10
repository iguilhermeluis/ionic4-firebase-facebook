import { Component, OnInit } from "@angular/core";
import {
  NavController,
  LoadingController,
  ToastController,
  Platform
} from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";

import { Produto } from "src/app/interfaces/produto";
import { ProdutoService } from "src/app/services/produto.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-detalhes",
  templateUrl: "./detalhes.page.html",
  styleUrls: ["./detalhes.page.scss"]
})
export class DetalhesPage implements OnInit {
  private productId: string = null;
  public product: Produto = {};
  private loading: any;
  private productSubscription: Subscription;
  public uploudPercent: Observable<number>;
  public downloadUrl: Observable<string>;

  constructor(
    private productService: ProdutoService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) {
    this.productId = this.activatedRoute.snapshot.params["id"];
    if (this.productId) this.loadProduct();
  }

  async openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    try {
      const fileUri: string = await this.camera.getPicture(options);

      let file: string; // armazena o nome do arquivo

      if (this.platform.is("ios")) {
        file = fileUri.split("/").pop();
      } else {
        file = fileUri.substring(
          fileUri.lastIndexOf("/") + 1,
          fileUri.indexOf("?")
        );
      }

      //armazena o caminho  do arquivo
      const path: string = fileUri.substring(0, fileUri.lastIndexOf("/"));

      const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      const blob: Blob = new Blob([buffer], { type: "image/jpeg" });
      this.uploudPicture(blob, file);
    } catch (error) {
      console.error(error);
    }
  }

  uploudPicture(blob: Blob, imageName) {
    const uploud = this.productService.uploudImage(blob, imageName);
    const task = uploud.task;
    const ref = uploud.ref;
    //dando feedback para o usuario

    this.uploudPercent = task.percentageChanges(); // ouvindo a % uplod
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          console.log("finish uploud");
          this.downloadUrl = ref.getDownloadURL();
          console.log(this.downloadUrl);
        })
      )
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }

  loadProduct() {
    this.productSubscription = this.productService
      .getProduct(this.productId)
      .subscribe(data => {
        this.product = data;
      });
  }

  ngOnInit() {}

  async saveProduct() {
    await this.presentLoading();
    this.product.userId = this.authService.getAuth().currentUser.uid;

    if (this.productId) {
      try {
        await this.productService.updateProduct(this.productId, this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack("/home");
      } catch (error) {
        this.presentToast("Erro ao tentar salvar");
        this.loading.dismiss();
      }
    } else {
      //this.product.createdAt = new Date().getTime();
      this.product.createdAt = new Date().getTime();

      console.log(this.product);
      try {
        await this.productService.addProduct(this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack("/home");
      } catch (error) {
        this.presentToast("Erro ao tentar salvar");
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: "Aguarde..." });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
