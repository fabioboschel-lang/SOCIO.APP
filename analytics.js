import { supabase } from "./supabase.js";

/*
 * Versión activa por interfaz.
 * Para comparar variantes, cambiar este valor (por ejemplo, "v2")
 * antes de publicar la nueva versión de la interfaz.
 */
export const VERSIONES_ANALYTICS = {
  session: "v19"
};

const EVENTOS_PERMITIDOS = new Set([
  "session_view",
  "session_start_click"
]);

const EVENTOS_UNICOS_POR_SESION = new Set([
  "session_view"
]);

function obtenerStorageSesion() {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Incrementa en Supabase el contador de una interacción.
 *
 * @param {string} nombre Nombre del evento admitido por la función SQL.
 * @param {{ interfaz?: string, deduplicarPorSesion?: boolean }} opciones
 * @returns {Promise<boolean>} true si Supabase confirmó el incremento.
 */
export async function registrarEvento(nombre, opciones = {}) {
  const interfaz = opciones.interfaz ?? "session";
  const version = VERSIONES_ANALYTICS[interfaz];

  if (!version) {
    console.warn("[Analytics] Interfaz sin versión configurada:", interfaz);
    return false;
  }

  if (!EVENTOS_PERMITIDOS.has(nombre)) {
    console.warn("[Analytics] Evento no permitido:", nombre);
    return false;
  }

  const deduplicarPorSesion =
    opciones.deduplicarPorSesion ??
    EVENTOS_UNICOS_POR_SESION.has(nombre);

  const storage = obtenerStorageSesion();
  const claveDeduplicacion =
    `passflow_analytics_once_${interfaz}_${version}_${nombre}`;

  if (deduplicarPorSesion && storage) {
    try {
      if (storage.getItem(claveDeduplicacion) === "1") {
        return false;
      }
    } catch {
      // Si el navegador bloquea sessionStorage, se intenta registrar igualmente.
    }
  }

  try {
    const { error } = await supabase.rpc("increment_analytics_counter", {
      p_interface_name: interfaz,
      p_interface_version: version,
      p_event_name: nombre,
      p_amount: 1
    });

    if (error) {
      console.error("[Analytics] Supabase no pudo registrar el evento:", error);
      return false;
    }

    if (deduplicarPorSesion && storage) {
      try {
        storage.setItem(claveDeduplicacion, "1");
      } catch {
        // El evento ya fue registrado en Supabase; la deduplicación local no es crítica.
      }
    }

    return true;
  } catch (error) {
    console.error("[Analytics] Error de conexión al registrar el evento:", error);
    return false;
  }
}
