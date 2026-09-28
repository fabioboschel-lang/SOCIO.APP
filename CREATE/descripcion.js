export function createDescripcionStep() {
  return {
    title: "Descripción",

    html: `
      <div class="create-field">
        <label for="create-descripcion">
          Describí tu evento
        </label>

        <textarea
          id="create-descripcion"
          name="descripcion"
          placeholder="Contá de qué se trata el evento..."
          maxlength="2000"
          rows="6"
          required
        ></textarea>

        <small class="create-field-hint">
          Podés incluir información sobre la experiencia,
          la música o los detalles del evento.
        </small>
      </div>
    `,

    validate(section) {
      const input = section.querySelector("#create-descripcion");
      const value = input.value.trim();

      if (!value) {
        input.setCustomValidity("Ingresá una descripción.");
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
    },

    getValue(section) {
      return {
        descripcion: section
          .querySelector("#create-descripcion")
          .value.trim()
      };
    }
  };
}