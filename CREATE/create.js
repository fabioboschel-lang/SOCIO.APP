// CREATE/create.js

import { navigate } from "../navigate.js";
import { supabase } from "../supabase.js";

import { nombrehtml } from "./nombre.js";
import { descripcionhtml } from "./descripcion.js";
import { imagenhtml } from "./imagen.js";

import {
  ubicacionhtml,
  initUbicacion
} from "./ubicacion.js";

import {
  fechahtml,
  initFecha
} from "./fecha.js";

import { preciohtml } from "./precio.js";


export function Create(app) {

  let currentStep = 3;
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

        <h1></h1>

        <p></p>

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

          <!-- ======================================
               PASO 1 - NOMBRE
          ====================================== -->

          <div
            id="create-nombre-step"
            class="create-step"
          >

            ${nombrehtml}

          </div>


          <!-- ======================================
               PASO 2 - UBICACIÓN + FECHA
          ====================================== -->

          <div
            id="create-ubicacion-fecha-step"
            class="create-step"
          >

            ${ubicacionhtml}

            ${fechahtml}

          </div>


          <!-- ======================================
               PASO 3 - IMAGEN
          ====================================== -->

          <div
            id="create-imagen-step"
            class="create-step"
          >

            ${imagenhtml}

          </div>


          <!-- ======================================
               PASO 4 - PRECIO
          ====================================== -->

          <div
            id="create-precio-step"
            class="create-step"
          >

            ${preciohtml}

          </div>


          <!-- ======================================
               PASO 5 - DESCRIPCIÓN
          ====================================== -->

          <div
            id="create-descripcion-step"
            class="create-step"
          >

            ${descripcionhtml}

          </div>

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

    app.querySelector(
      "#create-nombre-step"
    ),

    app.querySelector(
      "#create-ubicacion-fecha-step"
    ),

    app.querySelector(
      "#create-imagen-step"
    ),

    app.querySelector(
      "#create-precio-step"
    ),

    app.querySelector(
      "#create-descripcion-step"
    )

  ];


  const totalSteps =
    stepElements.length;


  initUbicacion();

  initFecha();


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


    if (
      keyboardHeight > 100
    ) {

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
    app.querySelector(
      "#create-imagen"
    );


  const imagePreview =
    app.querySelector(
      "#create-image-preview"
    );


  const imagePlaceholder =
    app.querySelector(
      ".create-image-placeholder"
    );


  let imagePreviewUrl =
    null;


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

          imagePreviewUrl =
            null;
        }


        if (!file) {

          imagePreview.removeAttribute(
            "src"
          );

          imagePreview.hidden =
            true;

          imagePlaceholder.hidden =
            false;

          return;
        }


        imagePreviewUrl =
          URL.createObjectURL(
            file
          );


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
     ERROR
  ======================================== */

  function showError(message) {

    errorMessage.textContent =
      message;

    errorMessage.hidden =
      false;
  }


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
      currentStep ===
      totalSteps - 1;


    stepNumber.textContent =
      `Paso ${current} de ${totalSteps}`;


    progressBar.style.width =
      `${(current / totalSteps) * 100}%`;


    backButton.style.display =
      isFirst
        ? "none"
        : "block";


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
      app.querySelector(
        "#create-nombre"
      );


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


    if (
      value.length < 3
    ) {

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


    if (
      value.length < 10
    ) {

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


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      input.setCustomValidity(
        "El archivo debe ser una imagen."
      );

      input.reportValidity();

      input.setCustomValidity("");

      return false;
    }


    const maxSize =
      10 * 1024 * 1024;


    if (
      file.size > maxSize
    ) {

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

    const picker =
      app.querySelector(
        "#create-fecha-picker"
      );


    const hourDisplay =
      app.querySelector(
        "#create-fecha-hour"
      );


    const value =
      picker?.dataset.value ||
      "";


    if (!value) {

      showError(
        "Seleccioná la fecha y hora."
      );


      hourDisplay?.focus();


      return false;
    }


    const selectedDate =
      new Date(value);


    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {

      showError(
        "Ingresá una fecha válida."
      );


      hourDisplay?.focus();


      return false;
    }


    if (
      selectedDate.getTime() <=
      Date.now()
    ) {

      showError(
        "La fecha del evento debe ser futura."
      );


      hourDisplay?.focus();


      return false;
    }


    return true;
  }


  /* ========================================
     OBTENER TIPOS DE ENTRADA
  ======================================== */

  function getTicketTypes() {

    const cards =
      Array.from(
        app.querySelectorAll(
          ".create-ticket-card"
        )
      );


    return cards.map(
      card => {

        const nameInput =
          card.querySelector(
            ".create-ticket-name"
          );


        const priceInput =
          card.querySelector(
            ".create-ticket-price"
          );


        const limitMode =
          card.querySelector(
            ".create-ticket-limit-mode:checked"
          );


        const limitInput =
          card.querySelector(
            ".create-ticket-limit"
          );


        const name =
          nameInput.value.trim();


        const price =
          Number(
            priceInput.value
          );


        let limit =
          null;


        if (
          limitMode?.value ===
          "limited"
        ) {

          limit =
            Number(
              limitInput.value
            );
        }


        return {
          name,
          price,
          limit
        };
      }
    );
  }


  /* ========================================
     VALIDAR PRECIO / ENTRADAS
  ======================================== */

  function validatePrecio() {

    const capacidadInput =
      app.querySelector(
        "#create-capacidad"
      );


    const capacidadRaw =
      capacidadInput.value.trim();


    const capacidad =
      Number(
        capacidadRaw
      );


    /* ========================================
       CAPACIDAD
    ======================================== */

    if (
      capacidadRaw === ""
    ) {

      capacidadInput.setCustomValidity(
        "Ingresá la capacidad del evento."
      );

      capacidadInput.reportValidity();

      capacidadInput.setCustomValidity("");

      return false;
    }


    if (
      !Number.isInteger(capacidad) ||
      capacidad < 1
    ) {

      capacidadInput.setCustomValidity(
        "La capacidad debe ser un número entero mayor a 0."
      );

      capacidadInput.reportValidity();

      capacidadInput.setCustomValidity("");

      return false;
    }


    /* ========================================
       TIPOS
    ======================================== */

    const cards =
      Array.from(
        app.querySelectorAll(
          ".create-ticket-card"
        )
      );


    if (
      cards.length === 0
    ) {

      showError(
        "Agregá al menos un tipo de entrada."
      );

      return false;
    }


    const tickets =
      getTicketTypes();


    for (
      let i = 0;
      i < tickets.length;
      i++
    ) {

      const ticket =
        tickets[i];


      const card =
        cards[i];


      const nameInput =
        card.querySelector(
          ".create-ticket-name"
        );


      const priceInput =
        card.querySelector(
          ".create-ticket-price"
        );


      const limitMode =
        card.querySelector(
          ".create-ticket-limit-mode:checked"
        );


      const limitInput =
        card.querySelector(
          ".create-ticket-limit"
        );


      /* ======================================
         NOMBRE
      ====================================== */

      if (
        !ticket.name
      ) {

        nameInput.setCustomValidity(
          "Ingresá el nombre de la entrada."
        );

        nameInput.reportValidity();

        nameInput.setCustomValidity("");

        return false;
      }


      /* ======================================
         PRECIO
      ====================================== */

      if (
        !Number.isFinite(
          ticket.price
        ) ||
        !Number.isInteger(
          ticket.price
        ) ||
        ticket.price < 0
      ) {

        priceInput.setCustomValidity(
          "Ingresá un precio válido."
        );

        priceInput.reportValidity();

        priceInput.setCustomValidity("");

        return false;
      }


      /* ======================================
         LÍMITE
      ====================================== */

      if (
        limitMode?.value ===
        "limited"
      ) {

        if (
          !Number.isInteger(
            ticket.limit
          ) ||
          ticket.limit < 1
        ) {

          limitInput.setCustomValidity(
            "El límite debe ser un número entero mayor a 0."
          );

          limitInput.reportValidity();

          limitInput.setCustomValidity("");

          return false;
        }


        /*
         * Un límite individual superior a la
         * capacidad global no aporta ninguna
         * capacidad real adicional.
         *
         * No lo rechazamos: sigue siendo válido,
         * porque la capacidad global continuará
         * siendo el límite definitivo.
         */
      }
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

        return (
          validateUbicacion() &&
          validateFecha()
        );


      case 2:

        return validateImagen();


      case 3:

        return validatePrecio();


      case 4:

        return validateDescripcion();


      default:

        return false;
    }
  }


  /* ========================================
     DATOS DEL FORMULARIO
  ======================================== */

  function getFormData() {

    const capacidad =
      Number(
        app
          .querySelector(
            "#create-capacidad"
          )
          .value
      );


    return {

      nombre:
        app
          .querySelector(
            "#create-nombre"
          )
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
            "#create-fecha-picker"
          )
          ?.dataset
          .value || "",


      capacidad,


      tickets:
        getTicketTypes()
    };
  }


  /* ========================================
     CONVERTIR TIPOS A ticketsdate
  ======================================== */

  function buildTicketsDateData(
    eventoId,
    tickets
  ) {

    const data = {
      evento_id: eventoId
    };


    tickets.forEach(
      (ticket, index) => {

        const number =
          index + 1;


        data[`tipo${number}`] =
          ticket.name;


        data[`valor${number}`] =
          ticket.price;


        /*
         * NULL = sin límite individual.
         *
         * La disponibilidad seguirá
         * limitada por Eventos.capacidad.
         */

        data[`limite${number}`] =
          ticket.limit;
      }
    );


    return data;
  }


  /* ========================================
     PUBLICAR EVENTO
  ======================================== */

  async function publishEvent() {

    if (
      isPublishing
    ) {
      return;
    }


    isPublishing =
      true;


    nextButton.disabled =
      true;


    backButton.disabled =
      true;


    nextButton.textContent =
      "Publicando...";


    clearError();


    let imagePath =
      null;


    try {

      const {
        nombre,
        descripcion,
        imagen,
        ubicacion,
        fecha,
        capacidad,
        tickets
      } =
        getFormData();


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
          .pop() ||
        "jpg";


      imagePath =
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
         CREAR EVENTO
      ======================================== */

      const {
        data: evento,
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
            capacidad,
            "ID usuario": user.id
          })
          .select("id")
          .single();


      if (insertError) {
        throw insertError;
      }


      if (
        !evento?.id
      ) {

        throw new Error(
          "No se pudo obtener el ID del evento."
        );
      }


      /* ========================================
         CREAR CONFIGURACIÓN DE ENTRADAS
      ======================================== */

      const ticketsDateData =
        buildTicketsDateData(
          evento.id,
          tickets
        );


      const {
        error: ticketsError
      } =
        await supabase
          .from("ticketsdate")
          .insert(
            ticketsDateData
          );


      /* ========================================
         SI FALLA ticketsdate
      ======================================== */

      if (ticketsError) {

        /*
         * Eliminamos el evento creado para
         * evitar dejar un evento incompleto.
         */

        await supabase
          .from("Eventos")
          .delete()
          .eq(
            "id",
            evento.id
          );


        throw ticketsError;
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


      /*
       * Si la imagen ya fue subida pero algo
       * posterior falló, la eliminamos.
       */

      if (imagePath) {

        await supabase.storage
          .from("eventos")
          .remove([
            imagePath
          ]);
      }


      showError(
        error?.message ||
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
     AGREGAR / ELIMINAR TIPOS DE ENTRADA
  ======================================== */

  const ticketList =
    app.querySelector(
      "#create-ticket-list"
    );


  const addTicketButton =
    app.querySelector(
      "#create-add-ticket"
    );


  function updateTicketCards() {

    const cards =
      Array.from(
        ticketList.querySelectorAll(
          ".create-ticket-card"
        )
      );


    cards.forEach(
      (card, index) => {

        const number =
          index + 1;


        card.dataset.ticketIndex =
          index;


        const numberElement =
          card.querySelector(
            ".create-ticket-number"
          );


        if (numberElement) {

          numberElement.textContent =
            `Entrada ${number}`;
        }


        const removeButton =
          card.querySelector(
            ".create-ticket-remove"
          );


        if (removeButton) {

          removeButton.hidden =
            cards.length === 1;
        }


        const nameInput =
          card.querySelector(
            ".create-ticket-name"
          );


        const priceInput =
          card.querySelector(
            ".create-ticket-price"
          );


        const radioInputs =
          card.querySelectorAll(
            ".create-ticket-limit-mode"
          );


        const limitInput =
          card.querySelector(
            ".create-ticket-limit"
          );


        if (nameInput) {

          nameInput.id =
            `create-ticket-name-${index}`;


          nameInput.value =
            nameInput.value.trim();
        }


        if (priceInput) {

          priceInput.id =
            `create-ticket-price-${index}`;
        }


        radioInputs.forEach(
          radio => {

            radio.name =
              `create-ticket-limit-${index}`;
          }
        );


        if (limitInput) {

          limitInput.id =
            `create-ticket-limit-${index}`;
        }
      }
    );
  }


  function createTicketCard() {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "create-ticket-card";


    card.innerHTML = `

      <div class="create-ticket-card-header">

        <span class="create-ticket-number">
          Entrada
        </span>

        <button
          type="button"
          class="create-ticket-remove"
          aria-label="Eliminar tipo de entrada"
        >
          ×
        </button>

      </div>


      <div class="create-ticket-fields">

        <div class="create-field">

          <label>
            Nombre
          </label>

          <input
            type="text"
            class="create-ticket-name"
            placeholder="VIP"
            maxlength="80"
            autocomplete="off"
            required
          >

        </div>


        <div class="create-field">

          <label>
            Precio
          </label>

          <div class="create-price-input">

            <span aria-hidden="true">
              $
            </span>

            <input
              type="number"
              class="create-ticket-price"
              placeholder="0"
              min="0"
              max="100000000"
              step="1"
              inputmode="numeric"
              autocomplete="off"
              required
            >

          </div>

          <small class="create-field-hint">
            Ingresá 0 si esta entrada es gratuita.
          </small>

        </div>


        <div class="create-field create-ticket-limit-field">

          <label>
            Límite de venta
          </label>


          <div class="create-ticket-limit-options">

            <label class="create-ticket-limit-option">

              <input
                type="radio"
                class="create-ticket-limit-mode"
                value="none"
                checked
              >

              <span>
                Sin límite
              </span>

            </label>


            <label class="create-ticket-limit-option">

              <input
                type="radio"
                class="create-ticket-limit-mode"
                value="limited"
              >

              <span>
                Establecer límite
              </span>

            </label>

          </div>


          <div
            class="create-ticket-limit-input"
            hidden
          >

            <input
              type="number"
              class="create-ticket-limit"
              min="1"
              max="1000000"
              step="1"
              inputmode="numeric"
              autocomplete="off"
              placeholder="Cantidad máxima"
              aria-label="Cantidad máxima de entradas"
            >

          </div>


          <small class="create-field-hint">
            Sin límite permite vender este tipo hasta alcanzar la capacidad total del evento.
          </small>

        </div>

      </div>
    `;


    return card;
  }


  if (
    addTicketButton &&
    ticketList
  ) {

    addTicketButton.addEventListener(
      "click",
      () => {

        const cards =
          ticketList.querySelectorAll(
            ".create-ticket-card"
          );


        /*
         * La estructura actual de ticketsdate
         * permite hasta 7 tipos.
         */

        if (
          cards.length >= 7
        ) {

          showError(
            "Podés crear hasta 7 tipos de entrada."
          );

          return;
        }


        const card =
          createTicketCard();


        ticketList.appendChild(
          card
        );


        updateTicketCards();


        clearError();


        const nameInput =
          card.querySelector(
            ".create-ticket-name"
          );


        nameInput?.focus();
      }
    );


    ticketList.addEventListener(
      "click",
      event => {

        const removeButton =
          event.target.closest(
            ".create-ticket-remove"
          );


        if (
          !removeButton
        ) {
          return;
        }


        const card =
          removeButton.closest(
            ".create-ticket-card"
          );


        if (
          !card
        ) {
          return;
        }


        const cards =
          ticketList.querySelectorAll(
            ".create-ticket-card"
          );


        if (
          cards.length <= 1
        ) {
          return;
        }


        card.remove();


        updateTicketCards();


        clearError();
      }
    );


    ticketList.addEventListener(
      "change",
      event => {

        const radio =
          event.target.closest(
            ".create-ticket-limit-mode"
          );


        if (
          !radio
        ) {
          return;
        }


        const card =
          radio.closest(
            ".create-ticket-card"
          );


        if (
          !card
        ) {
          return;
        }


        const limitContainer =
          card.querySelector(
            ".create-ticket-limit-input"
          );


        const limitInput =
          card.querySelector(
            ".create-ticket-limit"
          );


        const limited =
          radio.value ===
          "limited";


        limitContainer.hidden =
          !limited;


        limitInput.required =
          limited;


        if (
          !limited
        ) {

          limitInput.value =
            "";

          limitInput.setCustomValidity(
            ""
          );
        }
      }
    );
  }


  updateTicketCards();


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

      if (
        isPublishing
      ) {
        return;
      }


      clearError();


      if (
        !validateCurrentStep()
      ) {
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