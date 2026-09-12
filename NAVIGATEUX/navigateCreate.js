export function NavigateCreate(navigate) {


  const create =
    document.createElement("div");


  create.className =
    "navigate-ux-item";


  create.innerHTML = `

    <svg
      class="navigate-ux-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />

      <path
        d="M12 8v8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />

      <path
        d="M8 12h8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />

    </svg>

    <span>
      Crear
    </span>

  `;


  create.addEventListener(
    "click",
    () => {

      navigate("create");

    }
  );


  return create;

}