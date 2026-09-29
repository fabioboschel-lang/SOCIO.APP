// CREATE/precio.js

export const preciohtml = `

  <div class="create-ticket-config">

    <!-- ========================================
         CAPACIDAD TOTAL
    ======================================== -->

    <div class="create-field">

      <label for="create-capacidad">
        ¿Cuántas personas pueden asistir?
      </label>

      <input
        type="number"
        id="create-capacidad"
        name="capacidad"
        placeholder="1000"
        min="1"
        max="1000000"
        step="1"
        inputmode="numeric"
        autocomplete="off"
        required
      >

      <small class="create-field-hint">
        Es el máximo total de personas que pueden entrar al evento.
      </small>

    </div>


    <!-- ========================================
         TIPOS DE ENTRADA
    ======================================== -->

    <div class="create-ticket-types">

      <div class="create-ticket-types-header">

        <h2>
          Tipos de entrada
        </h2>

        <p>
          Podés crear uno o varios tipos de entrada.
        </p>

      </div>


      <!-- ======================================
           LISTA
      ====================================== -->

      <div
        id="create-ticket-list"
        class="create-ticket-list"
      >

        <!-- ====================================
             TIPO DE ENTRADA 1
        ==================================== -->

        <article
          class="create-ticket-card"
          data-ticket-index="0"
        >

          <div class="create-ticket-card-header">

            <span class="create-ticket-number">
              Entrada 1
            </span>

            <button
              type="button"
              class="create-ticket-remove"
              aria-label="Eliminar tipo de entrada"
              hidden
            >
              ×
            </button>

          </div>


          <div class="create-ticket-fields">

            <!-- ==================================
                 NOMBRE
            ================================== -->

            <div class="create-field">

              <label for="create-ticket-name-0">
                Nombre
              </label>

              <input
                type="text"
                id="create-ticket-name-0"
                class="create-ticket-name"
                placeholder="General"
                maxlength="80"
                autocomplete="off"
                required
              >

            </div>


            <!-- ==================================
                 PRECIO
            ================================== -->

            <div class="create-field">

              <label for="create-ticket-price-0">
                Precio
              </label>

              <div class="create-price-input">

                <span aria-hidden="true">
                  $
                </span>

                <input
                  type="number"
                  id="create-ticket-price-0"
                  class="create-ticket-price"
                  placeholder="0"
                  min="0"
                  max="100000000"
                  step="1"
                  inputmode="numeric"
                  autocomplete="off"
                  required
                >

              </div>

              <small class="create-field-hint">
                Ingresá 0 si esta entrada es gratuita.
              </small>

            </div>


            <!-- ==================================
                 LÍMITE INDIVIDUAL
            ================================== -->

            <div class="create-field create-ticket-limit-field">

              <label>
                Límite de venta
              </label>


              <div class="create-ticket-limit-options">

                <!-- SIN LÍMITE -->

                <label class="create-ticket-limit-option">

                  <input
                    type="radio"
                    name="create-ticket-limit-0"
                    class="create-ticket-limit-mode"
                    value="none"
                    checked
                  >

                  <span>
                    Sin límite
                  </span>

                </label>


                <!-- CON LÍMITE -->

                <label class="create-ticket-limit-option">

                  <input
                    type="radio"
                    name="create-ticket-limit-0"
                    class="create-ticket-limit-mode"
                    value="limited"
                  >

                  <span>
                    Establecer límite
                  </span>

                </label>

              </div>


              <!-- ==================================
                   CANTIDAD MÁXIMA
              ================================== -->

              <div
                class="create-ticket-limit-input"
                hidden
              >

                <input
                  type="number"
                  class="create-ticket-limit"
                  min="1"
                  max="1000000"
                  step="1"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Cantidad máxima"
                  aria-label="Cantidad máxima de entradas"
                >

              </div>


              <small class="create-field-hint">
                Sin límite permite vender este tipo hasta alcanzar la capacidad total del evento.
              </small>

            </div>

          </div>

        </article>

      </div>


      <!-- ========================================
           AGREGAR TIPO
      ======================================== -->

      <button
        type="button"
        id="create-add-ticket"
        class="create-add-ticket"
      >
        + Agregar tipo de entrada
      </button>

    </div>

  </div>

`;