// CREATE/precio.js

export const preciohtml = `



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



`;