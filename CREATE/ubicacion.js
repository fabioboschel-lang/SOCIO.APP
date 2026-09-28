// CREATE/ubicacion.js

export const ubicacionhtml = `

<div
  id="create-ubicacion-step"
  class="create-step"
  style="display: none;"
>

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

</div>

`;