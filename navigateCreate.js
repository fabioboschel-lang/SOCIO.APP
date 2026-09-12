export function NavigateCreate(navigate) {

  const create =
    document.createElement("div");


  create.className =
    "navigate-ux-item";


  create.textContent =
    "Crear";


  create.addEventListener(
    "click",
    () => {

      navigate("create");

    }
  );


  return create;

}