import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Produto } from "../interfaces/produto";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root"
})
export class ProdutoService {
  //armazena a referencia da colleção que está lá no Firestore
  private productsCollection: AngularFirestoreCollection<Produto>;
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    this.productsCollection = this.afs.collection<Produto>("Produtos");
  }

  uploudImage(blob: Blob, imageName) {
    const ref = this.afStorage.ref(`images/${imageName}`);
    const task = ref.put(blob);
    return { task, ref };
  }

  getProducts() {
    // lista os produtos da coleção
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addProduct(produto: Produto) {
    return this.productsCollection.add(produto);
  }

  getProduct(id: string) {
    return this.productsCollection.doc<Produto>(id).valueChanges();
  }

  updateProduct(id: string, produto: Produto) {
    return this.productsCollection.doc<Produto>(id).update(produto);
  }

  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }
}
