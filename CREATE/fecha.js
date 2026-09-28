export function createFechaStep() {
  return {
    title: "Fecha y hora",

    html: `
      <div class="create-field">
        <label for="create-fecha">
          ¿Cuándo se realiza?
        </label>

        <input
          type="datetime-local"
          id="create-fecha"
          name="fecha"
          required
        >
      </div>
    `,

    validate(section) {
      const input = section.querySelector("#create-fecha");
      const value = input.value;

      if (!value) {
        input.setCustomValidity("Seleccioná la fecha y hora.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      const selectedDate = new Date(value);

      if (Number.isNaN(selectedDate.getTime())) {
        input.setCustomValidity("Ingresá una fecha válida.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      if (selectedDate.getTime() <= Date.now()) {
        input.setCustomValidity(
          "La fecha del evento debe ser futura."
        );
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      return true;
    },

    getValue(section) {
      return {
        fecha: section.querySelector("#create-fecha").value
      };
    }
  };
}