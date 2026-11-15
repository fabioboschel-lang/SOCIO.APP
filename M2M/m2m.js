import { obtenerUsuarioLocal } from "../socioID.js";
import { cargarDatos } from "./cargardatos.js";
import { inicializarCompra } from "./BDC/LOGICbdc.js";
import { supabase } from "../supabase.js";
import { obtenerEvento } from "./eventosDB.js";
import { cargarSocioStyle } from "./sociostyle.js";
import { obtenerTickets, obtenerCantidadesSeleccionadas } from "./BDC/ticketsDB.js";
import { visualizacionHTML } from "./visualización.js";
import { edicionHTML } from "./edicion.js";
import { alternadorHTML } from "./alternadorHTML.js";
import { inicializarAlternador } from "./alternador.js";

/*
============================================================
VISTA DEL EVENTO
============================================================
*/

export async function m2m(app) {
  const socioId = obtenerUsuarioLocal();

  app.innerHTML = `
    ${visualizacionHTML}
    ${edicionHTML}
    ${alternadorHTML}
  `;

  inicializarAlternador();

  /*
  ==========================================================
  CARGAR ESTILO Y EVENTO
  ==========================================================
  Primero se obtiene y aplica sociostyle.
  Después se carga y presenta el evento.
  ==========================================================
  */

  try {
    await cargarSocioStyle();
    await cargarEvento(socioId);
  } catch (error) {
    console.error("Error inicializando evento:", error);
    mostrarError();
  }
}

/*
============================================================
CARGAR EVENTO
============================================================
*/

async function cargarEvento(socioId) {
  const loading = document.getElementById("eventoLoading");
  const container = document.getElementById("eventoContainer");

  const evento = await obtenerEvento(socioId);
  const tickets = await obtenerTickets(socioId);

  cargarDatos(evento);
  inicializarCompra(evento, eventId, userId);

  /*
  ==========================================================
  MOSTRAR EVENTO
  ==========================================================
  El estilo de sociostyle ya fue aplicado antes de llegar
  a este punto.
  ==========================================================
  */

  loading.style.display = "none";
  container.style.display = "block";
}

/*
============================================================
MOSTRAR ERROR
============================================================
*/

function mostrarError() {
  const loading = document.getElementById("eventoLoading");
  const errorElement = document.getElementById("eventoError");

  if (loading) {
    loading.style.display = "none";
  }

  if (errorElement) {
    errorElement.style.display = "block";
  }
}
