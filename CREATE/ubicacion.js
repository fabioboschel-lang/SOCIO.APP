// CREATE/ubicacion.js

export const ubicacionhtml = `

<div
  id="create-ubicacion-step"
  class="create-step"
  style="display: none;"
>

  <div class="create-field">

    <label for="create-ubicacion-search">
      ¿Dónde se realiza?
    </label>

    <p class="create-field-hint">
      Buscá tu discoteca o ingresá su dirección.
    </p>

    <!-- Buscador de Google Places -->
    <div
      id="create-ubicacion-autocomplete"
      class="create-ubicacion-autocomplete"
    ></div>

    <!-- Dirección seleccionada -->
    <input
      type="hidden"
      id="create-ubicacion"
      name="ubicacion"
      required
    >

    <!-- Identificador único del lugar -->
    <input
      type="hidden"
      id="create-ubicacion-place-id"
      name="ubicacion_place_id"
    >

    <!-- Coordenadas -->
    <input
      type="hidden"
      id="create-ubicacion-lat"
      name="ubicacion_lat"
    >

    <input
      type="hidden"
      id="create-ubicacion-lng"
      name="ubicacion_lng"
    >

  </div>

</div>

`;