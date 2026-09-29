export const fechahtml = `
<div id="create-fecha-step" class="create-step" style="display:none;">

  <div class="create-field">

    <label>¿Cuándo se realiza?</label>

    <p class="create-field-hint">
      Elegí la fecha y hora del evento.
    </p>

    <div
      id="create-fecha-picker"
      class="create-fecha-picker"
      aria-label="Selector de fecha y hora"
    >

      <div
        class="create-fecha-column"
        data-type="hour"
      >
        <div
          id="create-fecha-hour"
          class="create-fecha-display"
          tabindex="0"
          role="button"
          aria-label="Hora"
        ></div>
      </div>

      <div
        class="create-fecha-column"
        data-type="day"
      >
        <div
          id="create-fecha-day"
          class="create-fecha-display"
          tabindex="0"
          role="button"
          aria-label="Día"
        ></div>
      </div>

      <div
        class="create-fecha-column"
        data-type="month"
      >
        <div
          id="create-fecha-month"
          class="create-fecha-display"
          tabindex="0"
          role="button"
          aria-label="Mes"
        ></div>
      </div>

    </div>

    <input
      type="datetime-local"
      id="create-fecha"
      name="fecha"
      hidden
    >

  </div>

</div>
`;


const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];


export function initFecha() {

  const picker = document.querySelector("#create-fecha-picker");
  const input = document.querySelector("#create-fecha");

  const hourDisplay = document.querySelector("#create-fecha-hour");
  const dayDisplay = document.querySelector("#create-fecha-day");
  const monthDisplay = document.querySelector("#create-fecha-month");

  if (
    !picker ||
    !input ||
    !hourDisplay ||
    !dayDisplay ||
    !monthDisplay
  ) {
    return;
  }


  /*
  ========================================
  EVITAR INICIALIZAR DOS VECES
  ========================================
  */

  if (picker.dataset.initialized === "true") {
    return;
  }

  picker.dataset.initialized = "true";


  /*
  ========================================
  FECHA ACTUAL
  ========================================
  */

  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();


  /*
  ========================================
  HORA INICIAL
  REDONDEADA A INTERVALOS DE 30 MINUTOS
  ========================================
  */

  let initialHour = now.getHours();
  let initialMinute = now.getMinutes();

  let roundedMinutes = Math.ceil(initialMinute / 30) * 30;

  if (roundedMinutes === 60) {
    initialHour += 1;
    roundedMinutes = 0;
  }


  /*
  ========================================
  SI PASA DE 23:30
  ========================================
  */

  let initialDay = currentDay;
  let initialMonth = currentMonth;
  let initialYear = currentYear;

  if (initialHour >= 24) {

    initialHour = 0;

    const nextDay = new Date(
      currentYear,
      currentMonth,
      currentDay + 1
    );

    /*
    Solo permitimos fechas dentro del año actual.
    Si el siguiente día ya es del próximo año,
    dejamos 23:30 del 31 de diciembre.
    */

    if (nextDay.getFullYear() !== currentYear) {

      initialDay = 31;
      initialMonth = 11;
      initialYear = currentYear;
      initialHour = 23;
      roundedMinutes = 30;

    } else {

      initialDay = nextDay.getDate();
      initialMonth = nextDay.getMonth();

    }
  }


  /*
  ========================================
  ESTADO
  ========================================
  */

  let selectedHour = initialHour;
  let selectedMinute = roundedMinutes;

  let selectedDay = initialDay;
  let selectedMonth = initialMonth;
  let selectedYear = initialYear;


  /*
  ========================================
  UTILIDADES
  ========================================
  */

  function daysInMonth(year, month) {

    return new Date(
      year,
      month + 1,
      0
    ).getDate();
  }


  function getMinimumDay(month) {

    if (month === currentMonth) {
      return currentDay;
    }

    return 1;
  }


  function clampDay() {

    const minimumDay = getMinimumDay(selectedMonth);

    const maximumDay = daysInMonth(
      selectedYear,
      selectedMonth
    );

    selectedDay = Math.max(
      minimumDay,
      Math.min(selectedDay, maximumDay)
    );
  }


  function updateInput() {

    const month = String(
      selectedMonth + 1
    ).padStart(2, "0");

    const day = String(
      selectedDay
    ).padStart(2, "0");

    const hour = String(
      selectedHour
    ).padStart(2, "0");

    const minute = String(
      selectedMinute
    ).padStart(2, "0");

    input.value =
      `${selectedYear}-${month}-${day}T${hour}:${minute}`;

    input.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    input.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
  }


  /*
  ========================================
  ACTUALIZAR VISUAL
  ========================================
  */

  function updateDisplay(
    display,
    value,
    direction = null
  ) {

    display.classList.remove(
      "is-changing-next",
      "is-changing-prev"
    );

    /*
    Forzamos un nuevo ciclo de renderizado
    para que la animación pueda volver a ejecutarse.
    */

    void display.offsetWidth;

    display.textContent = value;

    if (direction === "next") {

      display.classList.add(
        "is-changing-next"
      );

    } else if (direction === "prev") {

      display.classList.add(
        "is-changing-prev"
      );
    }


    const removeAnimation = () => {

      display.classList.remove(
        "is-changing-next",
        "is-changing-prev"
      );
    };


    display.addEventListener(
      "animationend",
      removeAnimation,
      {
        once: true
      }
    );
  }


  function renderAll() {

    hourDisplay.textContent =
      `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;

    dayDisplay.textContent =
      String(selectedDay);

    monthDisplay.textContent =
      MONTH_NAMES[selectedMonth];

    hourDisplay.setAttribute(
      "aria-valuetext",
      hourDisplay.textContent
    );

    dayDisplay.setAttribute(
      "aria-valuetext",
      dayDisplay.textContent
    );

    monthDisplay.setAttribute(
      "aria-valuetext",
      monthDisplay.textContent
    );

    updateInput();
  }


  /*
  ========================================
  HORA
  ========================================
  */

  function changeHour(direction) {

    let totalMinutes =
      (selectedHour * 60) +
      selectedMinute;

    totalMinutes += direction * 30;


    if (totalMinutes < 0) {
      totalMinutes = 23 * 60 + 30;
    }

    if (totalMinutes > 23 * 60 + 30) {
      totalMinutes = 0;
    }


    selectedHour =
      Math.floor(totalMinutes / 60);

    selectedMinute =
      totalMinutes % 60;


    updateDisplay(
      hourDisplay,
      `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`,
      direction > 0 ? "next" : "prev"
    );

    updateInput();
  }


  /*
  ========================================
  DÍA
  ========================================
  */

  function changeDay(direction) {

    const minimumDay =
      getMinimumDay(selectedMonth);

    const maximumDay =
      daysInMonth(
        selectedYear,
        selectedMonth
      );


    let nextDay =
      selectedDay + direction;


    if (nextDay > maximumDay) {
      nextDay = minimumDay;
    }

    if (nextDay < minimumDay) {
      nextDay = maximumDay;
    }


    selectedDay = nextDay;


    updateDisplay(
      dayDisplay,
      String(selectedDay),
      direction > 0 ? "next" : "prev"
    );

    updateInput();
  }


  /*
  ========================================
  MES
  ========================================
  */

  function changeMonth(direction) {

    let nextMonth =
      selectedMonth + direction;


    /*
    No permitimos meses anteriores
    al mes actual.
    */

    if (nextMonth < currentMonth) {
      nextMonth = 11;
    }


    /*
    No permitimos meses posteriores
    a diciembre del año actual.
    */

    if (nextMonth > 11) {
      nextMonth = currentMonth;
    }


    /*
    Si estamos en un mes válido distinto,
    mantenemos el mismo día siempre que exista.
    */

    selectedMonth = nextMonth;

    clampDay();


    updateDisplay(
      monthDisplay,
      MONTH_NAMES[selectedMonth],
      direction > 0 ? "next" : "prev"
    );


    /*
    Como el cambio de mes puede haber
    corregido el día, actualizamos ambos.
    */

    updateDisplay(
      dayDisplay,
      String(selectedDay)
    );

    updateInput();
  }


  /*
  ========================================
  GESTOS
  ========================================
  */

  function setupSwipe(
    element,
    onNext,
    onPrev
  ) {

    let startY = null;
    let pointerActive = false;


    element.addEventListener(
      "pointerdown",
      (event) => {

        if (
          event.pointerType !== "touch" &&
          event.pointerType !== "pen" &&
          event.pointerType !== "mouse"
        ) {
          return;
        }

        startY = event.clientY;
        pointerActive = true;


        try {
          element.setPointerCapture(
            event.pointerId
          );
        } catch {}
      }
    );


    element.addEventListener(
      "pointerup",
      (event) => {

        if (
          !pointerActive ||
          startY === null
        ) {
          return;
        }


        const deltaY =
          startY - event.clientY;


        startY = null;
        pointerActive = false;


        /*
        Una sola pasada de 30px
        equivale exactamente a un paso.
        */

        const threshold = 30;


        if (deltaY >= threshold) {

          onNext();

        } else if (deltaY <= -threshold) {

          onPrev();
        }
      }
    );


    element.addEventListener(
      "pointercancel",
      () => {

        startY = null;
        pointerActive = false;
      }
    );
  }


  /*
  ========================================
  CONFIGURAR GESTOS
  ========================================
  */

  setupSwipe(
    hourDisplay,
    () => changeHour(1),
    () => changeHour(-1)
  );

  setupSwipe(
    dayDisplay,
    () => changeDay(1),
    () => changeDay(-1)
  );

  setupSwipe(
    monthDisplay,
    () => changeMonth(1),
    () => changeMonth(-1)
  );


  /*
  ========================================
  TECLADO
  ========================================
  */

  function setupKeyboard(
    element,
    onNext,
    onPrev
  ) {

    element.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "ArrowUp") {

          event.preventDefault();
          onNext();

        } else if (event.key === "ArrowDown") {

          event.preventDefault();
          onPrev();
        }
      }
    );
  }


  setupKeyboard(
    hourDisplay,
    () => changeHour(1),
    () => changeHour(-1)
  );

  setupKeyboard(
    dayDisplay,
    () => changeDay(1),
    () => changeDay(-1)
  );

  setupKeyboard(
    monthDisplay,
    () => changeMonth(1),
    () => changeMonth(-1)
  );


  /*
  ========================================
  INICIALIZAR
  ========================================
  */

  clampDay();
  renderAll();
}