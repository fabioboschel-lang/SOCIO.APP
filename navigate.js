import { Sesion } from "./AUTENTICACION/sesion.js";
import { Home } from "./home.js";
import { m2m } from "./M2M/m2m.js";
import { MercadoPago } from "./mercadopago.js";


const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  m2m: m2m,

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
