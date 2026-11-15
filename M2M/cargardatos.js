/*

==========================================================

CARGAR DATOS DEL EVENTO

==========================================================
*/

export function cargarDatos(evento) {
  try {
    if (!evento || typeof evento !== "object") {
      throw new TypeError("No se pueden cargar los datos: el objeto evento es nulo o inválido.");
    }

    const imagen = document.getElementById("eventoImagen");
    const nombre = document.getElementById("eventoNombre");
    const descripcion = document.getElementById("eventoDescripcion");
    const fechaElemento = document.getElementById("eventoFecha");
    const valor = document.getElementById("eventoValor");

    const elementosFaltantes = [
      ["eventoImagen", imagen],
      ["eventoNombre", nombre],
      ["eventoDescripcion", descripcion],
      ["eventoFecha", fechaElemento],
      ["eventoValor", valor]
    ].filter(([, elemento]) => !elemento).map(([id]) => id);

    if (elementosFaltantes.length > 0) {
      throw new Error(`Faltan elementos HTML necesarios para mostrar el evento: ${elementosFaltantes.join(", ")}.`);
    }

    imagen.src = evento.imagen;
    nombre.textContent = evento.nombre;
    descripcion.textContent = evento.descripcion;

    const fecha = new Date(evento.fecha);

    fechaElemento.textContent =
      `📅 ${fecha.toLocaleString(
        "es-AR",
        {
          dateStyle: "full",
          timeStyle: "short"
        }
      )}`;

    valor.textContent =
      `$${Number(
        evento.valor
      ).toLocaleString(
        "es-AR"
      )}`;

  } catch (error) {
    console.error("Error renderizando los datos del evento:", error, { evento });
    throw error;
  }
}
