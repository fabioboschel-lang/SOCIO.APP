export function NavigateHome(navigate) {


  const home =
    document.createElement("div");


  home.className =
    "navigate-ux-item";


  home.innerHTML = `

    <svg
      class="navigate-ux-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />

    </svg>

    <span>
      Inicio
    </span>

  `;


  home.addEventListener(
    "click",
    () => {

      navigate("home");

    }
  );


  return home;

}