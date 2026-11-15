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

    <section id="selectorColores" class="selector-colores" aria-label="Personalización de colores">
      <div class="selector-colores-grupo">
        <h2 class="selector-colores-titulo">Color del fondo</h2>
        <div class="selector-colores-opciones" role="group" aria-label="Seleccionar color del fondo">
          <label class="selector-color" aria-label="Blanco">
            <input type="radio" name="colorFondo" value="#ffffff">
            <span style="--color-opcion: #ffffff;"></span>
          </label>
          <label class="selector-color" aria-label="Negro">
            <input type="radio" name="colorFondo" value="#000000">
            <span style="--color-opcion: #000000;"></span>
          </label>
          <label class="selector-color" aria-label="Gris">
            <input type="radio" name="colorFondo" value="#6b7280">
            <span style="--color-opcion: #6b7280;"></span>
          </label>
          <label class="selector-color" aria-label="Azul">
            <input type="radio" name="colorFondo" value="#2563eb">
            <span style="--color-opcion: #2563eb;"></span>
          </label>
          <label class="selector-color" aria-label="Celeste">
            <input type="radio" name="colorFondo" value="#38bdf8">
            <span style="--color-opcion: #38bdf8;"></span>
          </label>
          <label class="selector-color" aria-label="Violeta">
            <input type="radio" name="colorFondo" value="#8b5cf6">
            <span style="--color-opcion: #8b5cf6;"></span>
          </label>
          <label class="selector-color" aria-label="Rosa">
            <input type="radio" name="colorFondo" value="#ec4899">
            <span style="--color-opcion: #ec4899;"></span>
          </label>
          <label class="selector-color" aria-label="Rojo">
            <input type="radio" name="colorFondo" value="#ef4444">
            <span style="--color-opcion: #ef4444;"></span>
          </label>
          <label class="selector-color" aria-label="Naranja">
            <input type="radio" name="colorFondo" value="#f97316">
            <span style="--color-opcion: #f97316;"></span>
          </label>
          <label class="selector-color" aria-label="Verde">
            <input type="radio" name="colorFondo" value="#22c55e">
            <span style="--color-opcion: #22c55e;"></span>
          </label>
        </div>
      </div>

      <div class="selector-colores-grupo">
        <h2 class="selector-colores-titulo">Color del texto</h2>
        <div class="selector-colores-opciones" role="group" aria-label="Seleccionar color del texto">
          <label class="selector-color" aria-label="Blanco">
            <input type="radio" name="colorTexto" value="#ffffff">
            <span style="--color-opcion: #ffffff;"></span>
          </label>
          <label class="selector-color" aria-label="Negro">
            <input type="radio" name="colorTexto" value="#000000">
            <span style="--color-opcion: #000000;"></span>
          </label>
          <label class="selector-color" aria-label="Gris">
            <input type="radio" name="colorTexto" value="#6b7280">
            <span style="--color-opcion: #6b7280;"></span>
          </label>
          <label class="selector-color" aria-label="Azul">
            <input type="radio" name="colorTexto" value="#2563eb">
            <span style="--color-opcion: #2563eb;"></span>
          </label>
          <label class="selector-color" aria-label="Celeste">
            <input type="radio" name="colorTexto" value="#38bdf8">
            <span style="--color-opcion: #38bdf8;"></span>
          </label>
          <label class="selector-color" aria-label="Violeta">
            <input type="radio" name="colorTexto" value="#8b5cf6">
            <span style="--color-opcion: #8b5cf6;"></span>
          </label>
          <label class="selector-color" aria-label="Rosa">
            <input type="radio" name="colorTexto" value="#ec4899">
            <span style="--color-opcion: #ec4899;"></span>
          </label>
          <label class="selector-color" aria-label="Rojo">
            <input type="radio" name="colorTexto" value="#ef4444">
            <span style="--color-opcion: #ef4444;"></span>
          </label>
          <label class="selector-color" aria-label="Naranja">
            <input type="radio" name="colorTexto" value="#f97316">
            <span style="--color-opcion: #f97316;"></span>
          </label>
          <label class="selector-color" aria-label="Verde">
            <input type="radio" name="colorTexto" value="#22c55e">
            <span style="--color-opcion: #22c55e;"></span>
          </label>
        </div>
      </div>
    </section>
  </section>

  <div id="eventoError" class="evento-error" style="display: none;">
    No se pudo encontrar este evento.
  </div>

</main>

</div>
`;
