import { Observable } from "rxjs";

export interface Produto {
  id?: string;
  name?: string;
  description?: string;
  picture?: string;
  price?: string;
  createdAt?: number;
  userId?: string;
}
