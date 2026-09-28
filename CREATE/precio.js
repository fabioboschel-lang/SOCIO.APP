export function createPrecioStep() {
  return {
    title: "Precio de entrada",

    html: `
      <div class="create-field">
        <label for="create-precio">
          ¿Cuánto cuesta la entrada?
        </label>

        <div class="create-price-input">
          <span aria-hidden="true">$</span>

          <input
            type="number"
            id="create-precio"
            name="valor"
            placeholder="0"
            min="0"
            max="100000000"
            step="1"
            inputmode="numeric"
            required
          >
        </div>

        <small class="create-field-hint">
          Ingresá 0 si la entrada es gratuita.
        </small>
      </div>
    `,

    validate(section) {
      const input = section.querySelector("#create-precio");
      const rawValue = input.value.trim();
      const value = Number(rawValue);

      if (rawValue === "") {
        input.setCustomValidity("Ingresá el precio de la entrada.");
        input.reportValidity();
        input.setCustomValidity("");
        return false;
      }

      if (!Number.isFinite(value) || value < 0) {
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
    },

    getValue(section) {
      return {
        valor: Number(
          section.querySelector("#create-precio").value
        )
      };
    }
  };
}