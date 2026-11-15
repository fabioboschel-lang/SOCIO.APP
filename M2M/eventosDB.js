import { supabase } from "../supabase.js";

export async function obtenerEvento(socioId) {
  try {
    const {
      data: evento,
      error
    } =
      await supabase
        .from("Eventos")
        .select(`
          id,
          nombre,
          imagen,
          descripcion,
          fecha,
          "ID usuario"
        `)
        .eq(
          "ID usuario",
          socioId
        )
        .maybeSingle();

    if (error) {
      console.error("Error de Supabase al obtener evento:", { socioId, error });
      return null;
    }

    if (!evento) {
      console.warn("La consulta de Eventos no devolvió registros para el socioId:", socioId);
      return null;
    }

    return evento;

  } catch (error) {
    console.error("Excepción inesperada consultando Eventos:", { socioId, error });
    return null;
  }
}
