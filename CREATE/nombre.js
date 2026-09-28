export function createNombreStep() {
  return {
    title: "Nombre del evento",

    html: `
      <div class="create-field">
        <label for="create-nombre">
          ¿Cómo se llama tu evento?
        </label>

        <input
          type="text"
          id="create-nombre"
          name="nombre"
          placeholder="Nombre del evento"
          maxlength="100"
          autocomplete="off"
          required
        >
      </div>
    `,

    validate(section) {
      const input = section.querySelector("#create-nombre");
      const value = input.value.trim();

      if (!value) {
        input.setCustomValidity("Ingresá el nombre del evento.");
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
    },

    getValue(section) {
      return {
        nombre: section
          .querySelector("#create-nombre")
          .value.trim()
      };
    }
  };
}