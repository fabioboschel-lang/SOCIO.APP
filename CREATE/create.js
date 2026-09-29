// CREATE/create.js

import { navigate } from "../navigate.js";
import { supabase } from "../supabase.js";

import { nombrehtml } from "./nombre.js";
import { descripcionhtml } from "./descripcion.js";
import { imagenhtml } from "./imagen.js";
import { ubicacionhtml } from "./ubicacion.js";
import { fechahtml } from "./fecha.js";
import { preciohtml } from "./precio.js";

export function Create(app) {

  let currentStep = 0;
  let isPublishing = false;

  app.innerHTML = `

    <main class="create-view">

      <!-- ========================================
           FLECHA VOLVER
      ======================================== -->

      <button
        type="button"
        id="create-back"
        class="create-back"
        aria-label="Volver"
        style="display: none;"
      >
        ←
      </button>


      <!-- ========================================
           ENCABEZADO
      ======================================== -->

      <header class="create-header">
        <h1><h1>
        <p>.</p>
      </header>


      <!-- ========================================
           FORMULARIO
      ======================================== -->

      <form
        id="create-form"
        novalidate
      >

        <!-- ========================================
             PANTALLAS
        ======================================== -->

        <div id="create-steps">

  ${nombrehtml}

  ${ubicacionhtml}

  ${fechahtml}

  ${imagenhtml}

  ${preciohtml}

  ${descripcionhtml}

</div>


        <!-- ========================================
             ACCIONES
        ======================================== -->

        <div class="create-actions">

          <button
            type="button"
            id="create-next"
            class="create-btn create-btn-primary"
          >
            Continuar
          </button>

        </div>


        <!-- ========================================
             ERROR
        ======================================== -->

        <p
          id="create-error"
          class="create-error"
          role="alert"
          hidden
        ></p>

      </form>


      <!-- ========================================
           PROGRESO
      ======================================== -->

      <div class="create-progress">

        <div class="create-progress-info">
          <span id="create-step-number"></span>
        </div>

        <div class="create-progress-track">

          <div
            id="create-progress-bar"
            class="create-progress-bar"
          ></div>

        </div>

      </div>

    </main>
  `;


  /* ========================================
     REFERENCIAS
  ======================================== */

  const form =
    app.querySelector("#create-form");

  const backButton =
    app.querySelector("#create-back");

  const nextButton =
    app.querySelector("#create-next");

  const createActions =
    app.querySelector(".create-actions");

  const stepNumber =
    app.querySelector("#create-step-number");

  const progressBar =
    app.querySelector("#create-progress-bar");

  const errorMessage =
    app.querySelector("#create-error");


  const stepElements = [
  app.querySelector("#create-nombre-step"),
  app.querySelector("#create-ubicacion-step"),
  app.querySelector("#create-fecha-step"),
  app.querySelector("#create-imagen-step"),
  app.querySelector("#create-precio-step"),
  app.querySelector("#create-descripcion-step")
];

  const totalSteps =
    stepElements.length;


  /* ========================================
     POSICIÓN DEL BOTÓN CON TECLADO MÓVIL
  ======================================== */

  const visualViewport =
    window.visualViewport;


  function updateKeyboardPosition() {

    if (!visualViewport) {
      return;
    }


    const keyboardHeight =
      window.innerHeight -
      visualViewport.height;


    if (keyboardHeight > 100) {

      createActions.style.bottom =
        `${keyboardHeight + 6}px`;

    } else {

      createActions.style.bottom =
        "";

    }
  }


  if (visualViewport) {

    visualViewport.addEventListener(
      "resize",
      updateKeyboardPosition
    );

    visualViewport.addEventListener(
      "scroll",
      updateKeyboardPosition
    );
  }


  window.addEventListener(
    "resize",
    updateKeyboardPosition
  );


  updateKeyboardPosition();


  /* ========================================
     PREVIEW DE IMAGEN
  ======================================== */

  const imageInput =
    app.querySelector("#create-imagen");

  const imagePreview =
    app.querySelector("#create-image-preview");

  const imagePlaceholder =
    app.querySelector(".create-image-placeholder");

  let imagePreviewUrl = null;


  if (
    imageInput &&
    imagePreview &&
    imagePlaceholder
  ) {

    imageInput.addEventListener(
      "change",
      () => {

        const file =
          imageInput.files?.[0];


        if (imagePreviewUrl) {

          URL.revokeObjectURL(
            imagePreviewUrl
          );

          imagePreviewUrl = null;
        }


        if (!file) {

          imagePreview.removeAttribute(
            "src"
          );

          imagePreview.hidden = true;

          imagePlaceholder.hidden =
            false;

          return;
        }


        imagePreviewUrl =
          URL.createObjectURL(file);

        imagePreview.src =
          imagePreviewUrl;

        imagePreview.hidden =
          false;

        imagePlaceholder.hidden =
          true;
      }
    );
  }


  /* ========================================
     MOSTRAR ERROR
  ======================================== */

  function showError(message) {

    errorMessage.textContent =
      message;

    errorMessage.hidden =
      false;
  }


  /* ========================================
     LIMPIAR ERROR
  ======================================== */

  function clearError() {

    errorMessage.textContent =
      "";

    errorMessage.hidden =
      true;
  }


  /* ========================================
     MOSTRAR PANTALLA ACTUAL
  ======================================== */

  function renderStep() {

    stepElements.forEach(
      (section, index) => {

        section.style.display =
          index === currentStep
            ? "block"
            : "none";
      }
    );


    const current =
      currentStep + 1;


    const isFirst =
      currentStep === 0;


    const isLast =
      currentStep === totalSteps - 1;


    /* ========================================
       PROGRESO
    ======================================== */

    stepNumber.textContent =
      `Paso ${current} de ${totalSteps}`;


    progressBar.style.width =
      `${(current / totalSteps) * 100}%`;


    /* ========================================
       FLECHA
    ======================================== */

    backButton.style.display =
      isFirst
        ? "none"
        : "block";


    /* ========================================
       CONTINUAR
    ======================================== */

    nextButton.textContent =
      isLast
        ? "Publicar evento"
        : "Continuar";


    nextButton.disabled =
      isPublishing;


    clearError();
  }


  /* ========================================
     VALIDAR NOMBRE
  ======================================== */

  function validateNombre() {

    const input =
      app.querySelector("#create-nombre");

    const value =
      input.value.trim();


    if (!value) {

      input.setCustomValidity(
        "Ingresá el nombre del evento."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (value.length < 3) {

      input.setCustomValidity(
        "El nombre debe tener al menos 3 caracteres."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR DESCRIPCIÓN
  ======================================== */

  function validateDescripcion() {

    const input =
      app.querySelector(
        "#create-descripcion"
      );

    const value =
      input.value.trim();


    if (!value) {

      input.setCustomValidity(
        "Ingresá una descripción."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (value.length < 10) {

      input.setCustomValidity(
        "La descripción debe tener al menos 10 caracteres."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR IMAGEN
  ======================================== */

  function validateImagen() {

    const input =
      app.querySelector(
        "#create-imagen"
      );

    const file =
      input.files?.[0];


    if (!file) {

      input.setCustomValidity(
        "Seleccioná una imagen para el evento."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (!file.type.startsWith("image/")) {

      input.setCustomValidity(
        "El archivo debe ser una imagen."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    const maxSize =
      10 * 1024 * 1024;


    if (file.size > maxSize) {

      input.setCustomValidity(
        "La imagen no puede superar los 10 MB."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR UBICACIÓN
  ======================================== */

  function validateUbicacion() {

    const input =
      app.querySelector(
        "#create-ubicacion"
      );

    const value =
      input.value.trim();


    if (!value) {

      input.setCustomValidity(
        "Ingresá la ubicación del evento."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR FECHA
  ======================================== */

  function validateFecha() {

    const input =
      app.querySelector(
        "#create-fecha"
      );

    const value =
      input.value;


    if (!value) {

      input.setCustomValidity(
        "Seleccioná la fecha y hora."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    const selectedDate =
      new Date(value);


    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {

      input.setCustomValidity(
        "Ingresá una fecha válida."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (
      selectedDate.getTime() <=
      Date.now()
    ) {

      input.setCustomValidity(
        "La fecha del evento debe ser futura."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR PRECIO
  ======================================== */

  function validatePrecio() {

    const input =
      app.querySelector(
        "#create-precio"
      );

    const rawValue =
      input.value.trim();

    const value =
      Number(rawValue);


    if (rawValue === "") {

      input.setCustomValidity(
        "Ingresá el precio de la entrada."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (
      !Number.isFinite(value) ||
      value < 0
    ) {

      input.setCustomValidity(
        "El precio debe ser un número igual o mayor a 0."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    if (!Number.isInteger(value)) {

      input.setCustomValidity(
        "Ingresá el precio como un número entero."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    return true;
  }


  /* ========================================
     VALIDAR PANTALLA ACTUAL
  ======================================== */

  function validateCurrentStep() {

  switch (currentStep) {

    case 0:
      return validateNombre();

    case 1:
      return validateUbicacion();

    case 2:
      return validateFecha();

    case 3:
      return validateImagen();

    case 4:
      return validatePrecio();

    case 5:
      return validateDescripcion();

    default:
      return false;
  }
}


  /* ========================================
     OBTENER DATOS
  ======================================== */

  function getFormData() {

    return {

      nombre:
        app
          .querySelector("#create-nombre")
          .value
          .trim(),

      descripcion:
        app
          .querySelector(
            "#create-descripcion"
          )
          .value
          .trim(),

      imagen:
        app
          .querySelector(
            "#create-imagen"
          )
          .files?.[0],

      ubicacion:
        app
          .querySelector(
            "#create-ubicacion"
          )
          .value
          .trim(),

      fecha:
        app
          .querySelector(
            "#create-fecha"
          )
          .value,

      valor:
        Number(
          app
            .querySelector(
              "#create-precio"
            )
            .value
        )
    };
  }


  /* ========================================
     PUBLICAR EVENTO
  ======================================== */

  async function publishEvent() {

    if (isPublishing) {
      return;
    }


    isPublishing = true;


    nextButton.disabled =
      true;

    backButton.disabled =
      true;

    nextButton.textContent =
      "Publicando...";


    clearError();


    try {

      const {
        nombre,
        descripcion,
        imagen,
        ubicacion,
        fecha,
        valor
      } = getFormData();


      /* ========================================
         USUARIO
      ======================================== */

      const {
        data: { user },
        error: authError
      } =
        await supabase.auth.getUser();


      if (authError) {
        throw authError;
      }


      if (!user) {

        throw new Error(
          "Tenés que iniciar sesión para publicar."
        );
      }


      /* ========================================
         SUBIR IMAGEN
      ======================================== */

      const extension =
        imagen.name
          .split(".")
          .pop() || "jpg";


      const imagePath =
        `${user.id}/${crypto.randomUUID()}.${extension}`;


      const {
        error: uploadError
      } =
        await supabase.storage
          .from("eventos")
          .upload(
            imagePath,
            imagen,
            {
              upsert: false,
              contentType:
                imagen.type ||
                undefined
            }
          );


      if (uploadError) {
        throw uploadError;
      }


      /* ========================================
         URL PÚBLICA
      ======================================== */

      const {
        data: publicUrlData
      } =
        supabase.storage
          .from("eventos")
          .getPublicUrl(
            imagePath
          );


      const imagenUrl =
        publicUrlData.publicUrl;


      /* ========================================
         INSERTAR EVENTO
      ======================================== */

      const {
        error: insertError
      } =
        await supabase
          .from("Eventos")
          .insert({
            nombre,
            imagen: imagenUrl,
            descripcion,
            ubicacion,
            fecha,
            valor,
            "ID usuario": user.id
          });


      /* ========================================
         SI FALLA EL INSERT
      ======================================== */

      if (insertError) {

        await supabase.storage
          .from("eventos")
          .remove([
            imagePath
          ]);

        throw insertError;
      }


      /* ========================================
         HOME
      ======================================== */

      navigate("home");


    } catch (error) {

      console.error(
        "Error al publicar el evento:",
        error
      );


      showError(
        error.message ||
        "No se pudo publicar el evento."
      );


    } finally {

      isPublishing =
        false;

      nextButton.disabled =
        false;

      backButton.disabled =
        false;

      renderStep();
    }
  }


  /* ========================================
     FLECHA VOLVER
  ======================================== */

  backButton.addEventListener(
    "click",
    () => {

      if (
        isPublishing ||
        currentStep === 0
      ) {
        return;
      }


      currentStep--;

      renderStep();
    }
  );


  /* ========================================
     CONTINUAR / PUBLICAR
  ======================================== */

  nextButton.addEventListener(
    "click",
    async () => {

      if (isPublishing) {
        return;
      }


      clearError();


      if (!validateCurrentStep()) {
        return;
      }


      if (
        currentStep <
        totalSteps - 1
      ) {

        currentStep++;

        renderStep();

        return;
      }


      await publishEvent();
    }
  );


  /* ========================================
     EVITAR SUBMIT
  ======================================== */

  form.addEventListener(
    "submit",
    event => {
      event.preventDefault();
    }
  );


  /* ========================================
     INICIAR
  ======================================== */

  renderStep();
}
