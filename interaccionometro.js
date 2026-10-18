const STORAGE_KEY = "passflow_interacciones_v1";
const VISITOR_KEY = "passflow_visitor_id";
const SESSION_KEY = "passflow_session_id";
const MAX_EVENTS = 5000;

function storageDisponible(storage) {
  try {
    const key = "__passflow_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function crearId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function obtenerId(storage, key) {
  if (!storageDisponible(storage)) return null;

  let id = storage.getItem(key);

  if (!id) {
    id = crearId();
    storage.setItem(key, id);
  }

  return id;
}

/**
 * Registra eventos de interacción en el navegador.
 *
 * Por defecto, session_view se registra una sola vez por sesión de pestaña
 * (sessionStorage), evitando duplicar la exposición al actualizar la página.
 * Los clics se registran cada vez que ocurren.
 *
 * Nota: esta primera versión almacena datos localmente; no los envía a un
 * servidor ni permite todavía consultar métricas agregadas entre dispositivos.
 */
export function registrarEvento(nombre, opciones = {}) {
  if (typeof nombre !== "string" || !nombre.trim()) return false;

  const localDisponible = storageDisponible(localStorage);
  if (!localDisponible) return false;

  const deduplicarPorSesion = opciones.deduplicarPorSesion ?? nombre === "session_view";
  const claveDeduplicacion = `passflow_event_once_${nombre}`;

  if (deduplicarPorSesion && storageDisponible(sessionStorage)) {
    if (sessionStorage.getItem(claveDeduplicacion) === "1") {
      return false;
    }
  }

  const evento = {
    event_id: crearId(),
    event_name: nombre.trim(),
    occurred_at: new Date().toISOString(),
    visitor_id: obtenerId(localStorage, VISITOR_KEY),
    session_id: obtenerId(sessionStorage, SESSION_KEY),
    page_path: window.location.pathname
  };

  let eventos = [];

  try {
    eventos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(eventos)) eventos = [];
  } catch {
    eventos = [];
  }

  eventos.push(evento);

  if (eventos.length > MAX_EVENTS) {
    eventos = eventos.slice(-MAX_EVENTS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));

    if (deduplicarPorSesion && storageDisponible(sessionStorage)) {
      sessionStorage.setItem(claveDeduplicacion, "1");
    }

    return true;
  } catch (error) {
    console.warn("[Interaccionómetro] No se pudo guardar el evento:", error);
    return false;
  }
}

/** Devuelve una copia de los eventos guardados en este navegador. */
export function obtenerEventos() {
  if (!storageDisponible(localStorage)) return [];

  try {
    const eventos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(eventos) ? eventos : [];
  } catch {
    return [];
  }
}

/** Devuelve un resumen local por nombre de evento. */
export function obtenerResumen() {
  const resumen = {};

  for (const evento of obtenerEventos()) {
    resumen[evento.event_name] = (resumen[evento.event_name] || 0) + 1;
  }

  return resumen;
}

/** Borra los registros de analítica de este navegador; útil durante pruebas. */
export function limpiarEventos() {
  if (storageDisponible(localStorage)) {
    localStorage.removeItem(STORAGE_KEY);
  }

  if (storageDisponible(sessionStorage)) {
    for (const clave of Object.keys(sessionStorage)) {
      if (clave.startsWith("passflow_event_once_")) {
        sessionStorage.removeItem(clave);
      }
    }
  }
}
