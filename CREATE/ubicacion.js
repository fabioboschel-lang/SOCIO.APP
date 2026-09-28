export function createUbicacionStep() {
  return {
    title: "Ubicación",

    html: `
      <div class="create-field">
        <label for="create-ubicacion">
          ¿Dónde se realiza?
        </label>

        <input
          type="text"
          id="create-ubicacion"
          name="ubicacion"
          placeholder="Dirección o nombre del lugar"
          maxlength="250"
          autocomplete="street-address"
          required
        >
      </div>
    `,

    validate(section) {
      const input = section.querySelector("#create-ubicacion");
      const value = input.value.trim();

      if (!value) {
        input.setCustomValidity("Ingresá la ubicación del evento.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      return true;
    },

    getValue(section) {
      return {
        ubicacion: section
          .querySelector("#create-ubicacion")
          .value.trim()
      };
    }
  };
}