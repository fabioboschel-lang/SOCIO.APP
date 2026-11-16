import {obtenerUsuarioLocal} from "../socioID.js";

import { supabase } from "../supabase.js";

import { planillas }
  from "./planillas/index.js";








/*
 * ============================================================
 * APLICAR COLOR DE FONDO
 * ============================================================
 */

function aplicarColorFondo(color) {

  const visualizacion =
    document.getElementById("visualizacionContainer");

  if (visualizacion) {
    visualizacion.style.backgroundColor = color;
  }

}



/*
 * ============================================================
 * APLICAR TIPOGRAFÍA
 * ============================================================
 */

function aplicarTipografia(tipografia) {

  document.body.style.fontFamily =
    tipografia;


  document.documentElement.style
    .fontFamily =
      tipografia;


  document
    .querySelectorAll("*")
    .forEach(
      (elemento) => {

        elemento.style.fontFamily =
          tipografia;

      }
    );

}



/*
 * ============================================================
 * EJECUTAR PLANILLA
 * ============================================================
 */

function ejecutarPlanilla(numero) {

  const equivalencias = {
    clasica: 1,
    simple: 2,
    moderna: 3
  };

  const numeroPlanilla =
    equivalencias[numero] ?? Number(numero);

  const funcionPlanilla =
    planillas[numeroPlanilla];


  if (
    typeof funcionPlanilla !==
    "function"
  ) {

    console.error(
      "No existe la planilla:",
      numero
    );

    return;

  }


  funcionPlanilla();

}



export function previsualizarColorFondo(color) {
  aplicarColorFondo(color);
}

export function previsualizarTipografia(tipografia) {
  aplicarTipografia(tipografia);
}

export function previsualizarPlanilla(numero) {
  ejecutarPlanilla(numero);
}


/*
 * ============================================================
 * CARGAR SOCIOSTYLE
 * ============================================================
 */



export async function cargarSocioStyle() {
  let socioId = null;

  try {
    socioId = obtenerUsuarioLocal();

    const {
      data: estilo,
      error
    } =
      await supabase
        .from("sociostyle")
        .select(`
          socioid,
          "color de fondo",
          planilla,
          tipografia
        `)
        .eq("socioid", socioId)
        .maybeSingle();

    if (error) {
      console.error("Error obteniendo sociostyle:", { socioId, error });
      return;
    }

    if (!estilo) {
      console.error("No existe configuración sociostyle para el evento:", socioId);
      return;
    }

    const colorFondo = estilo["color de fondo"];
    const tipografia = estilo.tipografia;
    const numeroPlanilla = estilo.planilla;

    aplicarColorFondo(colorFondo);
    aplicarTipografia(tipografia);
    ejecutarPlanilla(numeroPlanilla);

  } catch (error) {
    console.error("Excepción inesperada cargando o aplicando sociostyle:", { socioId, error });
    throw error;
  }
}
