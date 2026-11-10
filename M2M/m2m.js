import { obtenerUsuarioLocal } from "../usuarioID.js"; 

import { cargarDatos } from "./cargardatos.js";

import { inicializarCompra } from "./BDC/LOGICbdc.js";

import { supabase } from "../supabase.js";

import { HTMLbdc } from "./BDC/HTMLbdc.js";

import { obtenerEvento } from "./eventosDB.js";

import { cargarSocioStyle } from "./sociostyle.js";

import {
  obtenerTickets,
  obtenerCantidadesSeleccionadas
} from "./BDC/ticketsDB.js";

/*

============================================================

VISTA DEL EVENTO

============================================================
*/


export async function m2m(app) {

const userId = obtenerUsuarioLocal();
  
app.innerHTML = `

<main>  

  <div  
    id="eventoLoading"  
    class="evento-loading"  
  >  
    Cargando X...  
  </div>  


  <section  
    id="eventoContainer"  
    class="evento-container"  
    style="display: none;"  
  >  

    <div  
      class="evento-image-container"  
    >  

      <img  
        id="eventoImagen"  
        class="evento-image"  
        alt="Imagen del evento"  
      >  

    </div>  


    <h1  
      id="eventoNombre"  
      class="evento-name"  
    ></h1>  


    <p  
      id="eventoDescripcion"  
      class="evento-description"  
    ></p>  


    <div  
      id="eventoFecha"  
      class="evento-data"  
    ></div>  


    <div  
      id="eventoValor"  
      class="evento-price"  
    ></div>  


    ${HTMLbdc}</section>  


  <div  
    id="eventoError"  
    class="evento-error"  
    style="display: none;"  
  >  
    No se pudo encontrar este evento.  
  </div>  

</main>

`;






/*

==========================================================

CARGAR ESTILO Y EVENTO

==========================================================

Primero se obtiene y aplica sociostyle.

Después se carga y presenta el evento.

De esta manera la interfaz no se muestra antes

de que su configuración visual haya sido aplicada.
*/


try {

await cargarSocioStyle();  

await cargarEvento(userId);

} catch (error) {

console.error(  
  "Error inicializando evento:",  
  error  
);  

mostrarError();

}

}

/*

============================================================

CARGAR EVENTO

============================================================
*/


async function cargarEvento(userId) {

const loading =
document.getElementById(
"eventoLoading"
);

const container =
document.getElementById(
"eventoContainer"
);


const evento =
await obtenerEvento(userId);
  
const tickets =
  await obtenerTickets(userId);

  
cargarDatos(evento);

inicializarCompra(  evento, eventId, userId );

/*

==========================================================

MOSTRAR EVENTO

==========================================================

El estilo de sociostyle ya fue aplicado antes de llegar

a este punto.
*/


loading.style.display =
"none";

container.style.display =
"block";

}

/*

============================================================

MOSTRAR ERROR

============================================================
*/


function mostrarError() {

const loading =
document.getElementById(
"eventoLoading"
);

const errorElement =
document.getElementById(
"eventoError"
);

if (loading) {

loading.style.display =  
  "none";

}

if (errorElement) {

errorElement.style.display =  
  "block";

}

}
