import { Route } from "@angular/router";
import { LoginComponent } from "@modules/Auth/login/login.component";

export default [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent,
        title: "Login",
      },
    ],
  },
] as Route[];
