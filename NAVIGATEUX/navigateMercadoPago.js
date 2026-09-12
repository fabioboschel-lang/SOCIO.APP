


export function NavigateMercadoPago(navigate) {

  const mercadopago =
    document.createElement("div");


  mercadopago.className =
    "navigate-ux-item";


  mercadopago.textContent =
    "Mercado Pago";


  mercadopago.addEventListener(
    "click",
    () => {

      navigate("mercadopago");

    }
  );


  return mercadopago;

}
