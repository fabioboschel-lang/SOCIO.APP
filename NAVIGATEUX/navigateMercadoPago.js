export function NavigateMercadoPago(navigate) {


  const mercadopago =
    document.createElement("div");


  mercadopago.className =
    "navigate-ux-item";


  mercadopago.innerHTML = `

    <svg
      class="navigate-ux-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />

      <path
        d="M3 10h18"
        stroke="currentColor"
        stroke-width="2"
      />

      <circle
        cx="17"
        cy="15"
        r="1"
        fill="currentColor"
      />

    </svg>

    <span>
      Mercado Pago
    </span>

  `;


  mercadopago.addEventListener(
    "click",
    () => {

      navigate("mercadopago");

    }
  );


  return mercadopago;

}