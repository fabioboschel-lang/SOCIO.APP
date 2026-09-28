import { supabase } from "../supabase.js";

export function Sesion(app) {

  app.innerHTML = `

    <div class="session-view">

      <div class="session-content">

        <div class="session-brand">
  PassFlow
</div>

<img
  class="session-logo"
  src="../IMAGENES/LOGO.png"
  alt="Logo de PassFlow"
>

<div class="session-description">
  Ticketera especializada en <br> boliches y discotecas
</div>

<div class="session-benefits">

          <div class="session-benefit">
            <img
              class="benefit-icon"
              src="../IMAGENES/Personalizar.png"
              alt=""
            >

            <span>
              Creá y personalizá tu propio sitio web
            </span>
          </div>


          <div class="session-benefit">
            <img
              class="benefit-icon"
              src="../IMAGENES/Carrito.png"
              alt=""
            >

            <span>
              Ofrecé una experiencia de compra rápida y simple
            </span>
          </div>


          <div class="session-benefit">
            <img
              class="benefit-icon"
              src="../IMAGENES/Qrlogo.png"
              alt=""
            >

            <span>
              Vendé entradas online y generá tickets con códigos QR
            </span>
          </div>


          <div class="session-benefit">
            <img
              class="benefit-icon"
              src="../IMAGENES/LogoMP.png"
              alt=""
            >

            <span>
              Recibí tus pagos directamente en Mercado Pago
            </span>
          </div>


          <div class="session-benefit">
            <img
              class="benefit-icon"
              src="../IMAGENES/Escanlogo.png"
              alt=""
            >

            <span>
              Delegá el escaneo de entradas a tu equipo
            </span>
          </div>

        </div>


        <button
          id="googleBtn"
          class="google-btn"
        >
          Empezar
        </button>

      </div>

    </div>

  `;


  document
    .getElementById("googleBtn")
    .addEventListener(
      "click",
      async () => {

        const { data, error } =
          await supabase.auth.signInWithOAuth({

            provider: "google",

            options: {
              redirectTo:
                "https://passflow.space"
            }

          });

        console.log(data);

        if (error) {

          console.error(error);

          alert(
            "No se pudo iniciar sesión."
          );

        }

      }
    );

}
