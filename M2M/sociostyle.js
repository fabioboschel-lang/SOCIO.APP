import {obtenerUsuarioLocal} from "../usuarioID.js";

import { supabase } from "../supabase.js";

import { planillas }
  from "./planillas/index.js";







/*
 * ============================================================
 * APLICAR COLOR DE FONDO
 * ============================================================
 */

function aplicarColorFondo(color) {

  document.body.style.backgroundColor =
    color;

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

  const funcionPlanilla =
    planillas[
      Number(numero)
    ];


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



/*
 * ============================================================
 * CARGAR SOCIOSTYLE
 * ============================================================
 */



export async function cargarSocioStyle() {

  
const socioId = obtenerUsuarioLocal()


  /*
   * ==========================================================
   * CONSULTAR CONFIGURACIÓN
   * ==========================================================
   */

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
      .eq(
        "socioid",
        socioId
      )
      .maybeSingle();



  /*
   * ERROR
   */

  if (error) {

    console.error(
      "Error obteniendo sociostyle:",
      error
    );

    return;

  }



  /*
   * ==========================================================
   * CONFIGURACIÓN NO ENCONTRADA
   * ==========================================================
   */

  if (!estilo) {

    console.error(
      "No existe configuración sociostyle para el evento:",
      socioId
    );

    return;

  }



  /*
   * ==========================================================
   * EXTRAER VALORES
   * ==========================================================
   */

  const colorFondo =
    estilo["color de fondo"];


  const tipografia =
    estilo.tipografia;


  const numeroPlanilla =
    estilo.planilla;



  /*
   * ==========================================================
   * APLICAR COLOR
   * ==========================================================
   */

  aplicarColorFondo(
    colorFondo
  );



  /*
   * ==========================================================
   * APLICAR TIPOGRAFÍA
   * ==========================================================
   */

  aplicarTipografia(
    tipografia
  );



  /*
   * ==========================================================
   * APLICAR PLANILLA
   * ==========================================================
   */

  ejecutarPlanilla(
    numeroPlanilla
  );

}



