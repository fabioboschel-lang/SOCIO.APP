// CREATE/descripcion.js

export const descripcionhtml = `

<div
  id="create-descripcion-step"
  class="create-step"
  style="display: none;"
>

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

</div>

`;