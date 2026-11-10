import { supabase } from "../supabase.js";

export async function obtenerEvento(socioId) {

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

    console.error(
      "Error obteniendo evento:",
      error
    );

    return null;

  }

  return evento;

}
