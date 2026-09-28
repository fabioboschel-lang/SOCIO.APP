
import { navigate } from "../navigate.js";
import { supabase } from "../supabase.js";

import { createNombreStep } from "./nombre.js";
import { createDescripcionStep } from "./descripcion.js";
import { createImagenStep } from "./imagen.js";
import { createUbicacionStep } from "./ubicacion.js";
import { createFechaStep } from "./fecha.js";
import { createPrecioStep } from "./precio.js";

export function Create(app) {
  const steps = [
    createNombreStep(),
    createDescripcionStep(),
    createImagenStep(),
    createUbicacionStep(),
    createFechaStep(),
    createPrecioStep()
  ];

  let currentStep = 0;
  let isPublishing = false;

  app.innerHTML = `
    <main class="create-view">
      <header class="create-header">
        <h1>Crear evento</h1>
        <p>Completá los dato  tu evento.</p>
      </header>

      <div class="create-progress">
        <div class="create-progress-info">
          <span id="create-step-label"></span>
          <span id="create-step-number"></span>
        </div>

        <div class="create-progress-track">
          <div
            id="create-progress-bar"
            class="create-progress-bar"
          ></div>
        </div>
      </div>

      <form id="create-form" novalidate>
        <div id="create-steps"></div>

        <div class="create-actions">
          <button
            type="button"
            id="create-back"
            class="create-btn create-btn-secondary"
          >
            Volver
          </button>

          <button
            type="button"
            id="create-next"
            class="create-btn create-btn-primary"
          >
            Continuar
          </button>
        </div>

        <p
          id="create-error"
          class="create-error"
          role="alert"
          hidden
        ></p>
      </form>
    </main>
  `;

  const form = app.querySelector("#create-form");
  const stepsContainer = app.querySelector("#create-steps");
  const backButton = app.querySelector("#create-back");
  const nextButton = app.querySelector("#create-next");
  const stepLabel = app.querySelector("#create-step-label");
  const stepNumber = app.querySelector("#create-step-number");
  const progressBar = app.querySelector("#create-progress-bar");
  const errorMessage = app.querySelector("#create-error");

  // Cada pantalla se crea una sola vez.
  const stepElements = steps.map((step, index) => {
    const section = document.createElement("section");

    section.className = "create-step";
    section.dataset.step = index;
    section.hidden = true;
    section.innerHTML = step.html;

    stepsContainer.appendChild(section);

    if (typeof step.mount === "function") {
      step.mount(section);
    }

    return section;
  });

  // Mantiene el comportamiento de la navegación inferior.
  NavigateUX(app);

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function renderStep() {
    stepElements.forEach((section, index) => {
      const isActive = index === currentStep;

      section.hidden = !isActive;
      section.classList.toggle("active", isActive);
    });

    const current = currentStep + 1;
    const total = steps.length;
    const isFirst = currentStep === 0;
    const isLast = currentStep === total - 1;

    stepLabel.textContent = steps[currentStep].title;
    stepNumber.textContent = `${current} de ${total}`;

    progressBar.style.width = `${(current / total) * 100}%`;

    backButton.hidden = isFirst;
    nextButton.textContent = isLast ? "Publicar evento" : "Continuar";
    nextButton.disabled = isPublishing;

    clearError();
  }

  function validateCurrentStep() {
    const step = steps[currentStep];
    const section = stepElements[currentStep];

    if (typeof step.validate !== "function") {
      return true;
    }

    return step.validate(section);
  }

  function getFormData() {
    const data = {};

    steps.forEach((step, index) => {
      const value = step.getValue(stepElements[index]);
      Object.assign(data, value);
    });

    return data;
  }

  async function publishEvent() {
    if (isPublishing) return;

    isPublishing = true;
    nextButton.disabled = true;
    backButton.disabled = true;
    nextButton.textContent = "Publicando...";
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

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Tenés que iniciar sesión para publicar.");
      }

      // Subir imagen a Supabase Storage.
      const extension = imagen.name.split(".").pop() || "jpg";
      const imagePath =
        `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("eventos")
        .upload(imagePath, imagen, {
          upsert: false,
          contentType: imagen.type || undefined
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("eventos")
        .getPublicUrl(imagePath);

      const imagenUrl = publicUrlData.publicUrl;

      // Crear el evento.
      const { error: insertError } = await supabase
        .from("Eventos")
        .insert({
          nombre,
          imagen: imagenUrl,
          descripcion,
          ubicacion,
          fecha,
          valor: Number(valor),
          "ID usuario": user.id
        });

      if (insertError) {
        // Evita dejar una imagen huérfana si falla el INSERT.
        await supabase.storage
          .from("eventos")
          .remove([imagePath]);

        throw insertError;
      }

      navigate("home");
    } catch (error) {
      console.error("Error al publicar el evento:", error);

      showError(
        error.message || "No se pudo publicar el evento."
      );
    } finally {
      isPublishing = false;
      nextButton.disabled = false;
      backButton.disabled = false;
      renderStep();
    }
  }

  backButton.addEventListener("click", () => {
    if (isPublishing || currentStep === 0) return;

    currentStep--;
    renderStep();
  });

  nextButton.addEventListener("click", async () => {
    if (isPublishing) return;

    clearError();

    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep();
      return;
    }

    await publishEvent();
  });

  // Evita que Enter envíe el formulario y recargue la página.
  form.addEventListener("submit", event => {
    event.preventDefault();
  });

  renderStep();
}
