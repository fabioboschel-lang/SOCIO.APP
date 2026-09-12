


export function NavigateHome() {

  const home =
    document.createElement("div");


  home.className =
    "navigate-ux-item";


  home.textContent =
    "Inicio";


  home.addEventListener(
    "click",
    () => {

      navigate("home");

    }
  );


  return home;

}