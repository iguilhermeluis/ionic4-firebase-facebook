import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingController, ToastController, IonSlides } from "@ionic/angular";

import { Keyboard } from "@ionic-native/keyboard/ngx";

import { User } from "src/app/interfaces/user";
import { AuthService } from "src/app/services/auth.service";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import * as firebase from "firebase";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, null) slides: IonSlides;

  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    public keyboard: Keyboard,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthService,
    private fb: Facebook
  ) {}

  ngOnInit() {}

  async login() {
    await this.presentLoading();
    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async loginFB() {
    this.fb
      .login(["email"])
      .then((response: FacebookLoginResponse) => {
        this.onLoginSuccess(response);
        console.log(response.authResponse.accessToken);
      })
      .catch(error => {
        console.log(error);
        alert("error:" + error);
      });
  }

  onLoginSuccess(res: FacebookLoginResponse) {
    // const { token, secret } = res;
    const credential = firebase.auth.FacebookAuthProvider.credential(
      res.authResponse.accessToken
    );
    this.authService
      .getAuth()
      .signInWithCredential(credential)
      .then(response => {
        console.log(response);
        this.loading.dismiss();
      });
  }
  onLoginError(err) {
    console.log(err);
  }

  mudarPagina(page) {
    if (page === "cadastro") {
      this.slides.slideNext();
    } else {
      this.slides.slidePrev();
    }
  }

  async register() {
    await this.presentLoading();
    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      console.error(error);
      this.presentToast(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Por favor, aguarde..."
    });
    return this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message, // message: message, quando tem o msm nome pode abreviar
      duration: 2000
    });
    toast.present();
  }
}
