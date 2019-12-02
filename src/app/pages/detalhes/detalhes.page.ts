import { Component, OnInit } from "@angular/core";
import { Produto } from "src/app/interfaces/produto";
import { Subscription } from "rxjs";
import { ProdutoService } from "src/app/services/produto.service";
import { ActivatedRoute } from "@angular/router";
import {
  NavController,
  LoadingController,
  ToastController
} from "@ionic/angular";
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

  constructor(
    private productService: ProdutoService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.productId = this.activatedRoute.snapshot.params["id"];
    if (this.productId) this.loadProduct();
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
