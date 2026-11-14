import { HTMLbdc } from "./BDC/HTMLbdc.js";

/*
============================================================
HTML DE VISUALIZACIÓN DEL EVENTO
============================================================
*/

export const visualizacionHTML = `
<div id="visualizacionContainer">

<main>

  <div
    id="eventoLoading"
    class="evento-loading"
  >
    Cargando X...
  </div>

  <section
    id="eventoContainer"
    class="evento-container"
    style="display: none;"
  >

    <div class="evento-image-container">
      <img id="eventoImagen" class="evento-image" alt="Imagen del evento">
    </div>

    <h1 id="eventoNombre" class="evento-name"></h1>

    <p id="eventoDescripcion" class="evento-description"></p>

    <div id="eventoFecha" class="evento-data"></div>

    <div id="eventoValor" class="evento-price"></div>

    ${HTMLbdc}
  </section>

  <div id="eventoError" class="evento-error" style="display: none;">
    No se pudo encontrar este evento.
  </div>

</main>

</div>
`;
