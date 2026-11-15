import { obtenerUsuarioLocal } from "../socioID.js";
import { cargarDatos } from "./cargardatos.js";
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
  let etapa = "obtener usuario local";

  try {
    const socioId = obtenerUsuarioLocal();

    etapa = "renderizar estructura HTML";
    app.innerHTML = `
      ${visualizacionHTML}
      ${edicionHTML}
      ${alternadorHTML}
    `;

    etapa = "inicializar alternador";
    inicializarAlternador();

    etapa = "cargar sociostyle";
    await cargarSocioStyle();

    etapa = "cargar evento";
    await cargarEvento(socioId);

  } catch (error) {
    console.error(`Error inicializando M2M durante: ${etapa}`, error);
    mostrarError();
  }
}

async function cargarEvento(socioId) {
  let etapa = "obtener referencias del HTML";

  try {
    const loading = document.getElementById("eventoLoading");
    const container = document.getElementById("eventoContainer");

    if (!loading || !container) {
      throw new Error("No se encontraron los elementos eventoLoading o eventoContainer.");
    }

    etapa = "consultar evento en Supabase";
    const evento = await obtenerEvento(socioId);

    if (!evento) {
      throw new Error(`No se recibió un evento para el socioId: ${socioId ?? "null"}.`);
    }

    etapa = "consultar tickets en Supabase";
    const tickets = await obtenerTickets(socioId);

    etapa = "cargar datos del evento en el HTML";
    cargarDatos(evento);

    loading.style.display = "none";
    container.style.display = "block";

  } catch (error) {
    console.error(`Error cargando evento durante: ${etapa}`, error);
    throw error;
  }
}

function mostrarError() {
  const loading = document.getElementById("eventoLoading");
  const errorElement = document.getElementById("eventoError");

  if (loading) {
    loading.style.display = "none";
  }

  if (errorElement) {
    errorElement.style.display = "block";
  } else {
    console.error("No se pudo mostrar el error: no existe el elemento eventoError.");
  }
}
