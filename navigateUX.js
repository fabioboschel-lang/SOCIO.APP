import { NavigateHome } from "./navigateHome.js";
import { NavigateCreate } from "./navigateCreate.js";
import { NavigateMercadoPago } from "./navigateMercadoPago.js";


export function NavigateUX(app) {


  /* =========================
     CONTENEDOR GLOBAL
     ========================= */

  const navigation =
    document.createElement("nav");


  navigation.className =
    "navigate-ux";


  /* =========================
     CONTENEDORES
     ========================= */

  const home =
    NavigateHome();


  const create =
    NavigateCreate();


  const mercadopago =
    NavigateMercadoPago();


  /* =========================
     AGREGAR CONTENEDORES
     ========================= */

  navigation.appendChild(
    home
  );


  navigation.appendChild(
    create
  );


  navigation.appendChild(
    mercadopago
  );


  /* =========================
     AGREGAR NAVEGACIÓN
     ========================= */

  app.appendChild(
    navigation
  );


  return navigation;

}