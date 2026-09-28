// CREATE/imagen.js

export const imagenhtml = `

<div
  id="create-imagen-step"
  class="create-step"
  style="display: none;"
>

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

</div>

`;