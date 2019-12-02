import { Component, OnInit } from "@angular/core";
import { Produto } from "src/app/interfaces/produto";
import { Subscription } from "rxjs";
import { ProdutoService } from "src/app/services/produto.service";
import { AuthService } from "src/app/services/auth.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  private products = new Array<Produto>();
  private productsSubscription: Subscription;

  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.productsSubscription = this.produtoService
      .getProducts()
      .subscribe(data => {
        this.products = data;
      });
  }

  ngOnDestroy() {
    // destroi o ouvinte quando muda a pagina
    this.productsSubscription.unsubscribe();
  }

  ngOnInit() {}

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.produtoService.deleteProduct(id);
    } catch (error) {
      this.presentToast("Erro ao tentar deletar");
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
