import { NavigateUX } from "./NAVIGATEUX/navigateUX.js";
import { KiteEditor } from "./kiteditor.js";
import { navigate } from "./navigate.js";
import { supabase } from "./supabase.js";

export function Create(app) {
  app.innerHTML = `
    <div class="create-view">

      <div class="create-content">

        <div class="create-top">
          <span class="create-brand">SOCIO</span>
          <span id="stepCounter" class="step-counter">1 de 6</span>
        </div>

        <div class="progress-track">
          <div id="progressBar" class="progress-bar"></div>
        </div>

        <!-- PASO 1: NOMBRE -->
        <section class="create-step active" data-step="0">
          <h1 class="create-title">
            ¿Cómo se llama tu discoteca?
          </h1>

          <p class="create-description">
            Escribí el nombre con el que tus clientes la conocen.
          </p>

          <input
            id="eventName"
            class="create-input"
            type="text"
            placeholder="Nombre de la discoteca"
            autocomplete="organization"
            maxlength="100"
          >
        </section>

        <!-- PASO 2: DESCRIPCIÓN -->
        <section class="create-step" data-step="1">
          <h1 class="create-title">
            Describí tu discoteca
          </h1>

          <p class="create-description">
            Contales a tus clientes qué hace especial a tu lugar.
          </p>

          <textarea
            id="eventDescription"
            class="create-textarea"
            placeholder="Escribí una descripción..."
            maxlength="1000"
          ></textarea>
        </section>

        <!-- PASO 3: IMAGEN -->
        <section class="create-step" data-step="2">
          <h1 class="create-title">
            Agregá una imagen
          </h1>

          <p class="create-description">
            Elegí una imagen que represente tu discoteca.
          </p>

          <label for="eventImage" class="image-selector">
            <span id="imageText">
              <span class="image-plus">+</span>
              Seleccionar imagen
            </span>

            <img
              id="imagePreview"
              class="image-preview"
              alt="Vista previa de la imagen"
              style="display: none;"
            >
          </label>

          <input
            id="eventImage"
            type="file"
            accept="image/*"
            hidden
          >
        </section>

        <!-- PASO 4: UBICACIÓN -->
        <section class="create-step" data-step="3">
          <h1 class="create-title">
            ¿Dónde está ubicada?
          </h1>

          <p class="create-description">
            Indicá la dirección de tu discoteca.
          </p>

          <input
            id="eventLocation"
            class="create-input"
            type="text"
            placeholder="Dirección o ubicación"
            autocomplete="street-address"
            maxlength="250"
          >
        </section>

        <!-- PASO 5: FECHA -->
        <section class="create-step" data-step="4">
          <h1 class="create-title">
            ¿Cuándo se realiza?
          </h1>

          <p class="create-description">
            Seleccioná la fecha y hora del evento.
          </p>

          <input
            id="eventDate"
            class="create-input"
            type="datetime-local"
          >
        </section>

        <!-- PASO 6: PRECIO -->
        <section class="create-step" data-step="5">
          <h1 class="create-title">
            ¿Cuánto cuesta la entrada?
          </h1>

          <p class="create-description">
            Ingresá el precio de la entrada en pesos.
          </p>

          <div class="price-field">
            <span class="price-symbol">$</span>

            <input
              id="eventPrice"
              class="create-input price-input"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              inputmode="decimal"
            >
          </div>
        </section>

        <!-- NAVEGACIÓN -->
        <div class="create-actions">
          <button
            id="backBtn"
            class="back-btn"
            type="button"
            style="visibility: hidden;"
          >
            Volver
          </button>

          <button
            id="nextBtn"
            class="create-btn"
            type="button"
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  `;

  NavigateUX(app);

  const steps = [
    ...app.querySelectorAll(".create-step")
  ];

  const stepCounter =
    app.querySelector("#stepCounter");

  const progressBar =
    app.querySelector("#progressBar");

  const backBtn =
    app.querySelector("#backBtn");

  const nextBtn =
    app.querySelector("#nextBtn");

  const imageInput =
    app.querySelector("#eventImage");

  const imagePreview =
    app.querySelector("#imagePreview");

  const imageText =
    app.querySelector("#imageText");

  let currentStep = 0;
  let isPublishing = false;

  /*
   * =========================
   * SELECTOR DE IMAGEN
   * =========================
   */

  imageInput.addEventListener("change", () => {
    const imagen = imageInput.files?.[0];

    if (!imagen) return;

    if (!imagen.type.startsWith("image/")) {
      alert("Seleccioná un archivo de imagen.");
      imageInput.value = "";
      return;
    }

    imagePreview.src = URL.createObjectURL(imagen);
    imagePreview.style.display = "block";
    imageText.style.display = "none";
  });

  /*
   * =========================
   * MOSTRAR PASO
   * =========================
   */

  function showStep(index) {
    currentStep = index;

    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index);
    });

    stepCounter.textContent =
      `${index + 1} de ${steps.length}`;

    progressBar.style.width =
      `${((index + 1) / steps.length) * 100}%`;

    backBtn.style.visibility =
      index === 0 ? "hidden" : "visible";

    nextBtn.textContent =
      index === steps.length - 1
        ? "Publicar discoteca"
        : "Continuar";

    nextBtn.disabled = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    const field = steps[index].querySelector(
      "input:not([type='file']), textarea"
    );

    if (field) {
      setTimeout(() => field.focus(), 250);
    }
  }

  /*
   * =========================
   * VALIDAR PASO
   * =========================
   */

  function validateStep(index) {
    switch (index) {
      case 0: {
        const nombre =
          app.querySelector("#eventName").value.trim();

        if (!nombre) {
          alert("Ingresá el nombre de tu discoteca.");
          return false;
        }

        return true;
      }

      case 1: {
        const descripcion =
          app.querySelector("#eventDescription").value.trim();

        if (!descripcion) {
          alert("Ingresá una descripción.");
          return false;
        }

        return true;
      }

      case 2: {
        const imagen = imageInput.files?.[0];

        if (!imagen) {
          alert("Seleccioná una imagen.");
          return false;
        }

        return true;
      }

      case 3: {
        const ubicacion =
          app.querySelector("#eventLocation").value.trim();

        if (!ubicacion) {
          alert("Ingresá la ubicación.");
          return false;
        }

        return true;
      }

      case 4: {
        const fecha =
          app.querySelector("#eventDate").value;

        if (!fecha) {
          alert("Seleccioná la fecha y hora.");
          return false;
        }

        return true;
      }

      case 5: {
        const valor =
          app.querySelector("#eventPrice").value.trim();

        if (valor === "") {
          alert("Ingresá el precio de la entrada.");
          return false;
        }

        if (!Number.isFinite(Number(valor)) || Number(valor) < 0) {
          alert("Ingresá un precio válido.");
          return false;
        }

        return true;
      }

      default:
        return false;
    }
  }

  /*
   * =========================
   * VOLVER
   * =========================
   */

  backBtn.addEventListener("click", () => {
    if (currentStep > 0 && !isPublishing) {
      showStep(currentStep - 1);
    }
  });

  /*
   * =========================
   * CONTINUAR / PUBLICAR
   * =========================
   */

  nextBtn.addEventListener("click", async () => {
    if (isPublishing) return;

    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }

    await publishEvent();
  });

  /*
   * =========================
   * PUBLICAR EVENTO
   * =========================
   */

  async function publishEvent() {
    if (isPublishing) return;

    isPublishing = true;
    nextBtn.disabled = true;
    backBtn.disabled = true;
    nextBtn.textContent = "Publicando...";

    const nombre =
      app.querySelector("#eventName").value.trim();

    const descripcion =
      app.querySelector("#eventDescription").value.trim();

    const imagen =
      imageInput.files?.[0];

    const ubicacion =
      app.querySelector("#eventLocation").value.trim();

    const fecha =
      app.querySelector("#eventDate").value;

    const valor =
      app.querySelector("#eventPrice").value.trim();

    try {
      /*
       * OBTENER SESIÓN
       */

      const {
        data: sessionData,
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const user = sessionData.session?.user;

      if (!user) {
        alert("No hay ninguna sesión iniciada.");
        navigate("sesion");
        return;
      }

      /*
       * SUBIR IMAGEN
       */

      const extension =
        imagen.name.split(".").pop() || "jpg";

      const nombreArchivo =
        `${crypto.randomUUID()}.${extension}`;

      const ruta =
        `${user.id}/${nombreArchivo}`;

      const {
        error: uploadError
      } = await supabase
        .storage
        .from("eventos")
        .upload(ruta, imagen);

      if (uploadError) throw uploadError;

      /*
       * OBTENER URL PÚBLICA
       */

      const {
        data: urlData
      } = supabase
        .storage
        .from("eventos")
        .getPublicUrl(ruta);

      const imagenUrl = urlData.publicUrl;

      /*
       * INSERTAR EN EVENTOS
       *
       * Se conservan los campos de la tabla.
       * Redes y color quedan fuera de este flujo.
       */

      const {
        error: insertError
      } = await supabase
        .from("Eventos")
        .insert({
          nombre: nombre,
          imagen: imagenUrl,
          descripcion: descripcion,
          ubicacion: ubicacion,
          fecha: fecha,
          valor: Number(valor),
          "ID usuario": user.id
        });

      if (insertError) throw insertError;

      navigate("home");

    } catch (err) {
      console.error("Error al publicar el evento:", err);

      alert("No se pudo publicar el evento. Intentá nuevamente.");

      isPublishing = false;
      nextBtn.disabled = false;
      backBtn.disabled = false;
      nextBtn.textContent = "Publicar discoteca";
    }
  }

  /*
   * INICIAR FLUJO
   */

  showStep(0);
}