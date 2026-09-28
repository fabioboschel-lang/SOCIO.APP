export function createImagenStep() {
  return {
    title: "Imagen del evento",

    html: `
      <div class="create-field">
        <label for="create-imagen">
          Elegí una imagen
        </label>

        <label
          for="create-imagen"
          class="create-image-picker"
        >
          <span class="create-image-placeholder">
            Seleccionar imagen
          </span>

          <img
            id="create-image-preview"
            class="create-image-preview"
            alt="Vista previa de la imagen del evento"
            hidden
          >
        </label>

        <input
          type="file"
          id="create-imagen"
          name="imagen"
          accept="image/*"
          required
        >

        <small class="create-field-hint">
          Seleccioná una imagen en formato JPG, PNG o WebP.
        </small>
      </div>
    `,

    mount(section) {
      const input = section.querySelector("#create-imagen");
      const preview = section.querySelector("#create-image-preview");
      const placeholder = section.querySelector(
        ".create-image-placeholder"
      );

      let previewUrl = null;

      input.addEventListener("change", () => {
        const file = input.files?.[0];

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          previewUrl = null;
        }

        if (!file) {
          preview.removeAttribute("src");
          preview.hidden = true;
          placeholder.hidden = false;
          return;
        }

        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
        preview.hidden = false;
        placeholder.hidden = true;
      });
    },

    validate(section) {
      const input = section.querySelector("#create-imagen");
      const file = input.files?.[0];

      if (!file) {
        input.setCustomValidity("Seleccioná una imagen para el evento.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      if (!file.type.startsWith("image/")) {
        input.setCustomValidity("El archivo debe ser una imagen.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        input.setCustomValidity(
          "La imagen no puede superar los 10 MB."
        );
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      return true;
    },

    getValue(section) {
      return {
        imagen: section.querySelector("#create-imagen").files[0]
      };
    }
  };
}