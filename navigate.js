import { Sesion } from "./AUTENTICACION/sesion.js";
import { Home } from "./home.js";
import { Create } from "./create.js";
import { MercadoPago } from "./mercadopago.js";


const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  create: Create,

  mercadopago: MercadoPago

};


export function navigate(route) {

  const screen =
    routes[route];


  if (!screen) {

    console.error(
      "Ruta inexistente:",
      route
    );

    return;

  }


  screen(app);

}