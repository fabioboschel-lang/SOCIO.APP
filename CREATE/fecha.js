// CREATE/fecha.js

/* ========================================
   HTML
======================================== */

export const fechahtml = `

<div
  id="create-fecha-step"
  class="create-step"
  style="display: none;"
>

  <div class="create-field">

    <label>
      ¿Cuándo se realiza?
    </label>

    <p class="create-field-hint">
      Elegí la fecha y hora del evento.
    </p>

    <div
      id="create-fecha-picker"
      class="create-fecha-picker"
    >

      <!-- HORA -->
      <div
        class="create-fecha-column"
        data-type="hour"
      >

        <div
          id="create-fecha-hour"
          class="create-fecha-scroll"
          tabindex="0"
        ></div>

        <span class="create-fecha-label">
          hs
        </span>

      </div>

      <!-- DÍA -->
      <div
        class="create-fecha-column"
        data-type="day"
      >

        <div
          id="create-fecha-day"
          class="create-fecha-scroll"
          tabindex="0"
        ></div>

        <span class="create-fecha-label">
          día
        </span>

      </div>

      <!-- MES -->
      <div
        class="create-fecha-column"
        data-type="month"
      >

        <div
          id="create-fecha-month"
          class="create-fecha-scroll"
          tabindex="0"
        ></div>

        <span class="create-fecha-label">
          mes
        </span>

      </div>

    </div>

    <!--
      Valor final utilizado por create.js
      y Supabase.
    -->
    <input
      type="datetime-local"
      id="create-fecha"
      name="fecha"
      hidden
    >

  </div>

</div>

`;


/* ========================================
   CONFIGURACIÓN
======================================== */

const MONTHS = [
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


/* ========================================
   ESTADO
======================================== */

let initialized = false;

let selectedHour = 0;
let selectedMinute = 0;
let selectedDay = 1;
let selectedMonth = 0;
let selectedYear = 0;


/* ========================================
   INICIALIZAR
======================================== */

export function initFecha() {

  if (initialized) {
    return;
  }

  const hourContainer =
    document.querySelector(
      "#create-fecha-hour"
    );

  const dayContainer =
    document.querySelector(
      "#create-fecha-day"
    );

  const monthContainer =
    document.querySelector(
      "#create-fecha-month"
    );

  const input =
    document.querySelector(
      "#create-fecha"
    );

  if (
    !hourContainer ||
    !dayContainer ||
    !monthContainer ||
    !input
  ) {
    return;
  }


  /* ========================================
     FECHA ACTUAL
  ======================================== */

  const now = new Date();

  selectedYear =
    now.getFullYear();

  selectedMonth =
    now.getMonth();

  /*
    Redondeamos la hora actual
    al próximo intervalo de 30 minutos.
  */

  let currentHour =
    now.getHours();

  let currentMinute =
    now.getMinutes();

  if (currentMinute === 0) {

    selectedHour =
      currentHour;

    selectedMinute =
      0;

  } else if (currentMinute <= 30) {

    selectedHour =
      currentHour;

    selectedMinute =
      30;

  } else {

    selectedHour =
      currentHour + 1;

    selectedMinute =
      0;
  }

  /*
    Si el redondeo pasa de las 23:30,
    avanzamos al día siguiente.
  */

  if (selectedHour >= 24) {

    selectedHour = 0;

    const tomorrow =
      new Date(now);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    selectedDay =
      tomorrow.getDate();

    selectedMonth =
      tomorrow.getMonth();

    selectedYear =
      tomorrow.getFullYear();

  } else {

    selectedDay =
      now.getDate();
  }


  /* ========================================
     CREAR OPCIONES
  ======================================== */

  renderHours();

  renderMonths();

  renderDays();


  /* ========================================
     EVENTOS
  ======================================== */

  hourContainer.addEventListener(
    "click",
    handleHourClick
  );

  dayContainer.addEventListener(
    "click",
    handleDayClick
  );

  monthContainer.addEventListener(
    "click",
    handleMonthClick
  );


  /* ========================================
     VALOR INICIAL
  ======================================== */

  updateInput();

  initialized = true;
}


/* ========================================
   HORAS
======================================== */

function renderHours() {

  const container =
    document.querySelector(
      "#create-fecha-hour"
    );

  if (!container) {
    return;
  }

  let html = "";

  for (
    let hour = 0;
    hour < 24;
    hour++
  ) {

    for (
      let minute of [0, 30]
    ) {

      const value =
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      const selected =
        hour === selectedHour &&
        minute === selectedMinute;

      html += `
        <button
          type="button"
          class="create-fecha-option ${
            selected
              ? "is-selected"
              : ""
          }"
          data-value="${value}"
        >
          ${value}
        </button>
      `;
    }
  }

  container.innerHTML = html;

  scrollToSelected(
    container
  );
}


/* ========================================
   MESES
======================================== */

function renderMonths() {

  const container =
    document.querySelector(
      "#create-fecha-month"
    );

  if (!container) {
    return;
  }

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  let html = "";

  /*
    Como solamente permitimos fechas
    dentro del año actual, mostramos
    desde el mes actual hasta diciembre.
  */

  for (
    let month = currentMonth;
    month < 12;
    month++
  ) {

    const selected =
      month === selectedMonth;

    html += `
      <button
        type="button"
        class="create-fecha-option ${
          selected
            ? "is-selected"
            : ""
        }"
        data-month="${month}"
      >
        ${MONTHS[month]}
      </button>
    `;
  }

  container.innerHTML =
    html;

  scrollToSelected(
    container
  );
}


/* ========================================
   DÍAS
======================================== */

function renderDays() {

  const container =
    document.querySelector(
      "#create-fecha-day"
    );

  if (!container) {
    return;
  }

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  let firstDay = 1;

  /*
    Si estamos en el mes actual,
    no permitimos días anteriores a hoy.
  */

  if (
    selectedYear === currentYear &&
    selectedMonth === currentMonth
  ) {

    firstDay =
      now.getDate();
  }


  /*
    Cantidad de días del mes.
  */

  const daysInMonth =
    new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();


  /*
    Si el día seleccionado ya no existe
    en el nuevo mes, lo ajustamos al último.
  */

  if (
    selectedDay < firstDay
  ) {

    selectedDay =
      firstDay;
  }

  if (
    selectedDay > daysInMonth
  ) {

    selectedDay =
      daysInMonth;
  }


  let html = "";

  for (
    let day = firstDay;
    day <= daysInMonth;
    day++
  ) {

    const selected =
      day === selectedDay;

    html += `
      <button
        type="button"
        class="create-fecha-option ${
          selected
            ? "is-selected"
            : ""
        }"
        data-day="${day}"
      >
        ${day}
      </button>
    `;
  }

  container.innerHTML =
    html;

  scrollToSelected(
    container
  );
}


/* ========================================
   CLICK HORA
======================================== */

function handleHourClick(event) {

  const option =
    event.target.closest(
      "[data-value]"
    );

  if (!option) {
    return;
  }

  const value =
    option.dataset.value;

  const [
    hour,
    minute
  ] =
    value
      .split(":")
      .map(Number);

  selectedHour =
    hour;

  selectedMinute =
    minute;

  renderHours();

  updateInput();
}


/* ========================================
   CLICK DÍA
======================================== */

function handleDayClick(event) {

  const option =
    event.target.closest(
      "[data-day]"
    );

  if (!option) {
    return;
  }

  selectedDay =
    Number(
      option.dataset.day
    );

  renderDays();

  updateInput();
}


/* ========================================
   CLICK MES
======================================== */

function handleMonthClick(event) {

  const option =
    event.target.closest(
      "[data-month]"
    );

  if (!option) {
    return;
  }

  selectedMonth =
    Number(
      option.dataset.month
    );

  /*
    Al cambiar de mes tenemos que
    reconstruir los días disponibles.
  */

  renderMonths();

  renderDays();

  updateInput();
}


/* ========================================
   ACTUALIZAR INPUT FINAL
======================================== */

function updateInput() {

  const input =
    document.querySelector(
      "#create-fecha"
    );

  if (!input) {
    return;
  }

  const month =
    String(
      selectedMonth + 1
    ).padStart(2, "0");

  const day =
    String(
      selectedDay
    ).padStart(2, "0");

  const hour =
    String(
      selectedHour
    ).padStart(2, "0");

  const minute =
    String(
      selectedMinute
    ).padStart(2, "0");

  input.value =
    `${selectedYear}-${month}-${day}T${hour}:${minute}`;
}


/* ========================================
   SCROLL AL ELEMENTO SELECCIONADO
======================================== */

function scrollToSelected(
  container
) {

  const selected =
    container.querySelector(
      ".is-selected"
    );

  if (!selected) {
    return;
  }

  requestAnimationFrame(() => {

    selected.scrollIntoView({
      behavior: "auto",
      block: "center"
    });

  });
}