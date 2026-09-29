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


  if (picker.dataset.initialized === "true") {
    return;
  }

  picker.dataset.initialized = "true";


  /* ========================================
     FECHA ACTUAL
  ======================================== */

  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();


  /* ========================================
     HORA INICIAL
  ======================================== */

  let initialHour = now.getHours();
  let initialMinute = now.getMinutes();

  let roundedMinutes =
    Math.ceil(initialMinute / 30) * 30;


  if (roundedMinutes === 60) {

    initialHour += 1;
    roundedMinutes = 0;
  }


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


  /* ========================================
     ESTADO
  ======================================== */

  let selectedHour = initialHour;
  let selectedMinute = roundedMinutes;

  let selectedDay = initialDay;
  let selectedMonth = initialMonth;
  let selectedYear = initialYear;


  /* ========================================
     UTILIDADES
  ======================================== */

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

    const minimumDay =
      getMinimumDay(selectedMonth);

    const maximumDay =
      daysInMonth(
        selectedYear,
        selectedMonth
      );

    selectedDay = Math.max(
      minimumDay,
      Math.min(
        selectedDay,
        maximumDay
      )
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


  /* ========================================
     RENDER
  ======================================== */

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


  /* ========================================
     CAMBIAR HORA
  ======================================== */

  function changeHour(direction) {

    let totalMinutes =
      selectedHour * 60 +
      selectedMinute;


    totalMinutes +=
      direction * 30;


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


    hourDisplay.textContent =
      `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`;


    hourDisplay.setAttribute(
      "aria-valuetext",
      hourDisplay.textContent
    );


    updateInput();
  }


  /* ========================================
     CAMBIAR DÍA
  ======================================== */

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


    dayDisplay.textContent =
      String(selectedDay);


    dayDisplay.setAttribute(
      "aria-valuetext",
      dayDisplay.textContent
    );


    updateInput();
  }


  /* ========================================
     CAMBIAR MES
  ======================================== */

  function changeMonth(direction) {

    let nextMonth =
      selectedMonth + direction;


    if (nextMonth < currentMonth) {
      nextMonth = 11;
    }


    if (nextMonth > 11) {
      nextMonth = currentMonth;
    }


    selectedMonth = nextMonth;

    clampDay();


    monthDisplay.textContent =
      MONTH_NAMES[selectedMonth];


    dayDisplay.textContent =
      String(selectedDay);


    monthDisplay.setAttribute(
      "aria-valuetext",
      monthDisplay.textContent
    );

    dayDisplay.setAttribute(
      "aria-valuetext",
      dayDisplay.textContent
    );


    updateInput();
  }


  /* ========================================
     SWIPE CONTINUO
  ======================================== */

  function setupContinuousSwipe(
    element,
    onNext,
    onPrev
  ) {

    let startY = 0;
    let lastY = 0;
    let accumulatedDistance = 0;

    let pointerActive = false;


    /*
    Cuántos píxeles hay que desplazar
    para cambiar un valor.

    Un valor más bajo hace que la rueda
    sea más sensible.
    */

    const pixelsPerStep = 28;


    element.addEventListener(
      "pointerdown",
      (event) => {

        pointerActive = true;

        startY = event.clientY;
        lastY = event.clientY;

        accumulatedDistance = 0;


        try {

          element.setPointerCapture(
            event.pointerId
          );

        } catch {}
      }
    );


    element.addEventListener(
      "pointermove",
      (event) => {

        if (!pointerActive) {
          return;
        }


        const currentY =
          event.clientY;


        /*
        Movimiento desde el último frame.
        */

        const movement =
          lastY - currentY;


        lastY = currentY;


        /*
        Acumulamos el desplazamiento.

        Positivo = dedo sube
        Negativo = dedo baja
        */

        accumulatedDistance +=
          movement;


        /*
        Mientras haya suficiente distancia
        acumulada, seguimos cambiando valores.
        */

        while (
          accumulatedDistance >=
          pixelsPerStep
        ) {

          onNext();

          accumulatedDistance -=
            pixelsPerStep;
        }


        while (
          accumulatedDistance <=
          -pixelsPerStep
        ) {

          onPrev();

          accumulatedDistance +=
            pixelsPerStep;
        }
      }
    );


    element.addEventListener(
      "pointerup",
      (event) => {

        pointerActive = false;

        accumulatedDistance = 0;


        try {

          element.releasePointerCapture(
            event.pointerId
          );

        } catch {}
      }
    );


    element.addEventListener(
      "pointercancel",
      () => {

        pointerActive = false;
        accumulatedDistance = 0;
      }
    );
  }


  /* ========================================
     ACTIVAR RUEDA CONTINUA
  ======================================== */

  setupContinuousSwipe(
    hourDisplay,
    () => changeHour(1),
    () => changeHour(-1)
  );


  setupContinuousSwipe(
    dayDisplay,
    () => changeDay(1),
    () => changeDay(-1)
  );


  setupContinuousSwipe(
    monthDisplay,
    () => changeMonth(1),
    () => changeMonth(-1)
  );


  /* ========================================
     TECLADO
  ======================================== */

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


  /* ========================================
     INICIALIZAR
  ======================================== */

  clampDay();

  renderAll();
}