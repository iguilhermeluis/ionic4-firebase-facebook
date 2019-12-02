import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private afa: AngularFireAuth) {}

  login(user: User) {
    //metodo para fazer login
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
  }
  register(user: User) {
    // metodo para cadastrar usuario
    return this.afa.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
  }
  logout() {
    // metodo para deslogar do app
    return this.afa.auth.signOut();
  }
  getAuth() {
    // metodo para retorna a autenticação
    return this.afa.auth;
  }
}
