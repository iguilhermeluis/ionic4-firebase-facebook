import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { LoginGuard } from "./guards/login.guard";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then(m => m.HomePageModule),
    canActivate: [AuthGuard] // só vai poder acessar se tiver logado
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginPageModule),
    canActivate: [LoginGuard] // só vai poder acessar se tiver DESLOGADO!
  },
  {
    path: "detalhes",
    loadChildren: () =>
      import("./pages/detalhes/detalhes.module").then(
        m => m.DetalhesPageModule
      ),
    canActivate: [AuthGuard] // só vai poder acessar se tiver logado
  },
  {
    path: "detalhes/:id",
    loadChildren: () =>
      import("./pages/detalhes/detalhes.module").then(
        m => m.DetalhesPageModule
      ),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
