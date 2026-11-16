/*
============================================================
LÓGICA DEL ALTERNADOR DE VISTAS
============================================================
*/

export function inicializarAlternador() {
  const boton = document.getElementById("alternadorM2M");
  const visualizacion = document.getElementById("visualizacionContainer");
  const edicion = document.getElementById("edicionContainer");
  const app = document.getElementById("app");

  if (!boton || !visualizacion || !edicion || !app) {
    console.error("No se pudo inicializar el alternador M2M.");
    return;
  }

  const DURACION_TRANSICION = 240;
  const consultaEscritorio = window.matchMedia("(min-width: 1025px) and (pointer: fine)");
  let transicionando = false;
  let temporizadorTransicion = null;

  function actualizarTexto() {
    const edicionVisible = edicion.style.display === "block";
    const texto = boton.querySelector(".alternador-m2m-texto");

    if (texto) {
      texto.textContent = edicionVisible ? "Ver" : "Editar";
    }

    boton.setAttribute(
      "aria-label",
      edicionVisible ? "Ver visualización del evento" : "Editar personalización del evento"
    );
    boton.title = edicionVisible ? "Ver evento" : "Editar evento";

    boton.classList.remove("cambiando");
    void boton.offsetWidth;
    boton.classList.add("cambiando");
  }

  function aplicarModoDispositivo() {
    if (temporizadorTransicion !== null) {
      window.clearTimeout(temporizadorTransicion);
      temporizadorTransicion = null;
    }

    transicionando = false;
    visualizacion.classList.remove("m2m-vista-entrando", "m2m-vista-saliendo");
    edicion.classList.remove("m2m-vista-entrando", "m2m-vista-saliendo");

    if (consultaEscritorio.matches) {
      app.classList.add("m2m-escritorio");
      visualizacion.style.display = "block";
      edicion.style.display = "block";
      boton.classList.remove("cambiando");
      return;
    }

    app.classList.remove("m2m-escritorio");
    visualizacion.style.display = "block";
    edicion.style.display = "none";
    actualizarTexto();
  }

  function alternarVistas() {
    if (transicionando || consultaEscritorio.matches) return;

    transicionando = true;
    const edicionVisible = edicion.style.display === "block";
    const vistaActual = edicionVisible ? edicion : visualizacion;
    const vistaNueva = edicionVisible ? visualizacion : edicion;

    vistaNueva.style.display = "block";
    vistaNueva.classList.remove("m2m-vista-saliendo");
    vistaNueva.classList.add("m2m-vista-entrando");

    vistaActual.classList.remove("m2m-vista-entrando");
    vistaActual.classList.add("m2m-vista-saliendo");

    actualizarTexto();

    requestAnimationFrame(() => {
      vistaNueva.classList.remove("m2m-vista-entrando");
    });

    temporizadorTransicion = window.setTimeout(() => {
      vistaActual.style.display = "none";
      vistaActual.classList.remove("m2m-vista-saliendo");
      transicionando = false;
      temporizadorTransicion = null;
    }, DURACION_TRANSICION);
  }

  aplicarModoDispositivo();

  if (typeof consultaEscritorio.addEventListener === "function") {
    consultaEscritorio.addEventListener("change", aplicarModoDispositivo);
  } else {
    consultaEscritorio.addListener(aplicarModoDispositivo);
  }

  let pointerActivo = null;
  let inicioX = 0;
  let inicioY = 0;
  let posicionX = 0;
  let posicionY = 0;
  let anchoBoton = 0;
  let altoBoton = 0;
  let seMovio = false;

  boton.addEventListener("pointerdown", (evento) => {
    if (consultaEscritorio.matches) return;
    if (evento.button !== undefined && evento.button !== 0) return;

    const rect = boton.getBoundingClientRect();

    pointerActivo = evento.pointerId;
    inicioX = evento.clientX;
    inicioY = evento.clientY;
    posicionX = rect.left;
    posicionY = rect.top;
    anchoBoton = rect.width;
    altoBoton = rect.height;
    seMovio = false;

    boton.setPointerCapture(evento.pointerId);
  });

  boton.addEventListener("pointermove", (evento) => {
    if (pointerActivo !== evento.pointerId) return;

    const diferenciaX = evento.clientX - inicioX;
    const diferenciaY = evento.clientY - inicioY;

    if (!seMovio && Math.hypot(diferenciaX, diferenciaY) > 5) {
      seMovio = true;
      boton.classList.add("arrastrando");
      boton.style.right = "auto";
      boton.style.bottom = "auto";
    }

    if (!seMovio) return;

    const maxX = Math.max(0, window.innerWidth - anchoBoton);
    const maxY = Math.max(0, window.innerHeight - altoBoton);
    const nuevaX = Math.min(maxX, Math.max(0, posicionX + diferenciaX));
    const nuevaY = Math.min(maxY, Math.max(0, posicionY + diferenciaY));

    boton.style.left = `${nuevaX}px`;
    boton.style.top = `${nuevaY}px`;
  });

  boton.addEventListener("pointerup", (evento) => {
    if (pointerActivo !== evento.pointerId) return;

    if (!seMovio) {
      alternarVistas();
    }

    boton.classList.remove("arrastrando");
    pointerActivo = null;
  });

  boton.addEventListener("pointercancel", (evento) => {
    if (pointerActivo !== evento.pointerId) return;

    boton.classList.remove("arrastrando");
    pointerActivo = null;
  });

  // Permite alternar también con teclado (Enter o barra espaciadora).
  boton.addEventListener("click", (evento) => {
    if (evento.detail === 0) {
      alternarVistas();
    }
  });
}
