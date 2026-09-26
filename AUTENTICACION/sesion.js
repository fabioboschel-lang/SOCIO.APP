import { supabase } from "../supabase.js";

export function Sesion(app) {

  app.innerHTML = `

    <div class="session-view">

      <div class="session-content">

        <div class="session-brand">
          passflow.space
        </div>

        <div class="session-benefits">

          <div class="session-benefit">
            <span class="session-check">✓</span>
            <span>Recibí tus pagos directamente en Mercado Pago</span>
          </div>

          <div class="session-benefit">
            <span class="session-check">✓</span>
            <span>Personalizá la experiencia de tu sitio</span>
          </div>

          <div class="session-benefit">
            <span class="session-check">✓</span>
            <span>Gestioná tus ventas y operaciones desde un solo lugar</span>
          </div>

          <div class="session-benefit">
            <span class="session-check">✓</span>
            <span>Ofrecé una experiencia de compra rápida y simple</span>
          </div>

          <div class="session-benefit">
            <span class="session-check">✓</span>
            <span>Centralizá las herramientas de tu negocio</span>
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
                "https://fabioboschel-lang.github.io/SOCIO.APP/"
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