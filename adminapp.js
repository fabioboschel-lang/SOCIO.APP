import { supabase, authInicializada } from "./supabase.js";
import { navigate } from "./navigate.js";


/* =========================
   OBTENER USUARIO LOCAL
   ========================= */

function obtenerUsuarioLocal() {

  const key =
    "sb-qexgbswdbwlpydolpcll-auth-token";


  const storedSession =
    localStorage.getItem(key);


  if (!storedSession) {

    return null;

  }


  try {

    const session =
      JSON.parse(storedSession);


    return (
      session?.user?.id ??
      null
    );

  } catch (error) {

    console.error(
      "Sesión local inválida:",
      error
    );

    return null;

  }

}


/* =========================
   INICIAR APLICACIÓN
   ========================= */

async function iniciarApp() {

  await authInicializada;


  const userId =
    obtenerUsuarioLocal();


  /* =========================
     NO HAY USUARIO
     ========================= */

  if (!userId) {

    navigate("sesion");

    return;

  }


  /* =========================
     COMPROBAR EVENTO
     ========================= */

  const {
    data: evento,
    error: eventoError
  } =
    await supabase
      .from("Eventos")
      .select("nombre")
      .eq(
        "ID usuario",
        userId
      )
      .limit(1);


  if (eventoError) {

    console.error(
      "Error comprobando evento:",
      eventoError
    );

    return;

  }


  /* =========================
     NO TIENE EVENTO
     ========================= */

  if (
    !evento ||
    evento.length === 0
  ) {

    navigate("create");

    return;

  }


  /* =========================
     TIENE EVENTO
     ========================= */

  navigate("home");

}


/* =========================
   INICIAR APLICACIÓN
   ========================= */

async function arrancarAplicacion() {

  await iniciarApp();

}


/* =========================
   ARRANCAR
   ========================= */

arrancarAplicacion();