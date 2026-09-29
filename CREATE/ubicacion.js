// CREATE/ubicacion.js


/* ========================================
   CONFIGURACIÓN GOOGLE MAPS
======================================== */

const GOOGLE_MAPS_API_KEY =
  "AIzaSyAyiS-WJgSQtke9EnnZat9iW-fsCbilXiE";


/* ========================================
   HTML
======================================== */

export const ubicacionhtml = `

<div
  id="create-ubicacion-step"
  class="create-step"
  style="display: none;"
>

  <div class="create-field">

    <label>
      ¿Dónde se realiza?
    </label>

    <p class="create-field-hint">
      Buscá tu discoteca o ingresá su dirección.
    </p>

    <div
      id="create-ubicacion-autocomplete"
      class="create-ubicacion-autocomplete"
    ></div>


    <!-- Dirección seleccionada -->

    <input
      type="hidden"
      id="create-ubicacion"
      name="ubicacion"
    >


    <!-- Place ID -->

    <input
      type="hidden"
      id="create-ubicacion-place-id"
      name="ubicacion_place_id"
    >


    <!-- Coordenadas -->

    <input
      type="hidden"
      id="create-ubicacion-lat"
      name="ubicacion_lat"
    >

    <input
      type="hidden"
      id="create-ubicacion-lng"
      name="ubicacion_lng"
    >

  </div>

</div>

`;


/* ========================================
   CARGAR GOOGLE MAPS
======================================== */

let googleMapsPromise = null;


function loadGoogleMaps() {

  if (googleMapsPromise) {
    return googleMapsPromise;
  }


  googleMapsPromise =
    new Promise((resolve, reject) => {

      if (
        window.google &&
        window.google.maps &&
        window.google.maps.importLibrary
      ) {

        resolve();

        return;
      }


      const existingScript =
        document.querySelector(
          'script[data-google-maps="passflow"]'
        );


      if (existingScript) {

        existingScript.addEventListener(
          "load",
          () => resolve()
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "No se pudo cargar Google Maps."
              )
            )
        );

        return;
      }


      const script =
        document.createElement("script");


      script.src =
  `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
    GOOGLE_MAPS_API_KEY
  )}&v=weekly`;


      script.async = true;
      script.defer = true;

      script.dataset.googleMaps =
        "passflow";


      script.onload =
        () => resolve();


      script.onerror =
        () =>
          reject(
            new Error(
              "No se pudo cargar Google Maps."
            )
          );


      document.head.appendChild(script);

    });


  return googleMapsPromise;
}


/* ========================================
   INICIALIZAR UBICACIÓN
======================================== */

let autocompleteInitialized = false;


export async function initUbicacion() {

  if (autocompleteInitialized) {
    return;
  }


  const container =
    document.querySelector(
      "#create-ubicacion-autocomplete"
    );


  if (!container) {
    return;
  }


  try {

    /* ==============================
       CARGAR GOOGLE
    ============================== */

    await loadGoogleMaps();


    /* ==============================
       IMPORTAR PLACES
    ============================== */

    const {
      PlaceAutocompleteElement
    } =
      await google.maps.importLibrary(
        "places"
      );


    /* ==============================
       CREAR AUTOCOMPLETE
    ============================== */

    const autocomplete =
      new PlaceAutocompleteElement();


    /* ==============================
       ARGENTINA
    ============================== */

    autocomplete.includedRegionCodes =
      ["ar"];


    /* ==============================
       PLACEHOLDER
    ============================== */

    autocomplete.placeholder =
      "Buscá una discoteca o dirección";


    /* ==============================
       INSERTAR
    ============================== */

    container.appendChild(
      autocomplete
    );


    /* ==============================
       SELECCIÓN
    ============================== */

    autocomplete.addEventListener(
      "gmp-select",
      async ({
        placePrediction
      }) => {

        try {

          const place =
            placePrediction.toPlace();


          /* ==========================
             OBTENER DATOS
          ========================== */

          await place.fetchFields({
            fields: [
              "displayName",
              "formattedAddress",
              "location"
            ]
          });


          /* ==========================
             REFERENCIAS
          ========================== */

          const addressInput =
            document.querySelector(
              "#create-ubicacion"
            );


          const placeIdInput =
            document.querySelector(
              "#create-ubicacion-place-id"
            );


          const latInput =
            document.querySelector(
              "#create-ubicacion-lat"
            );


          const lngInput =
            document.querySelector(
              "#create-ubicacion-lng"
            );


          /* ==========================
             DIRECCIÓN
          ========================== */

          addressInput.value =
            place.formattedAddress ||
            place.displayName ||
            "";


          /* ==========================
             PLACE ID
          ========================== */

          placeIdInput.value =
            place.id ||
            "";


          /* ==========================
             COORDENADAS
          ========================== */

          if (place.location) {

            latInput.value =
              place.location.lat();

            lngInput.value =
              place.location.lng();

          } else {

            latInput.value =
              "";

            lngInput.value =
              "";
          }


          /* ==========================
             EVENTO PERSONALIZADO
          ========================== */

          container.dispatchEvent(
            new CustomEvent(
              "ubicacion-selected",
              {
                bubbles: true,
                detail: {
                  place
                }
              }
            )
          );

        } catch (error) {

          console.error(
            "Error obteniendo el lugar:",
            error
          );

        }

      }
    );


    autocompleteInitialized =
      true;


  } catch (error) {

    console.error(
      "Error inicializando Google Places:",
      error
    );

  }

}