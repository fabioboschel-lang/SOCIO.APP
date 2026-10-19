// CREATE/imagen.js

export const imagenhtml = `



  <div class="create-field">

    <label for="create-imagen">
      Elegí la imagen de tu evento
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
      Esta imagen representará tu evento en su página. No hace falta que sea un flyer.
    </small>

  </div>



`;