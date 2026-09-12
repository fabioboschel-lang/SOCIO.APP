export function obtenerUsuarioLocal() {

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