import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export function Home(app) {

  app.innerHTML = `

    <div class="home-view">

      <div class="event-link-container">

        <h2 class="event-link-title">
          Tu evento
        </h2>

        <p
          id="eventLinkStatus"
          class="event-link-status"
        >
          Cargando enlace...
        </p>

        <a
          id="eventLink"
          class="event-link"
          href="#"
          target="_blank"
          style="display: none;"
        ></a>

      </div>


      <button
        id="scanBtn"
        class="scan-btn"
      >
        Escanear
      </button>

    </div>

  `;


  /*
   * ESCANEAR
   */

  document
    .getElementById("scanBtn")
    .addEventListener(
      "click",
      () => navigate("scanner")
    );


  /*
   * OBTENER EVENTO DEL USUARIO
   */

  cargarEnlaceEvento();

}


async function cargarEnlaceEvento() {

  const status =
    document.getElementById(
      "eventLinkStatus"
    );

  const link =
    document.getElementById(
      "eventLink"
    );


  /*
   * OBTENER SESIÓN
   */

  const {
    data: sessionData,
    error: sessionError
  } =
    await supabase.auth.getSession();


  if (sessionError) {

    console.error(sessionError);

    status.textContent =
      "No se pudo obtener la sesión.";

    return;

  }


  const user =
    sessionData.session?.user;


  if (!user) {

    status.textContent =
      "No hay ninguna sesión iniciada.";

    return;

  }


  /*
   * BUSCAR EL EVENTO DEL USUARIO
   */

  const {
    data: evento,
    error: eventoError
  } =
    await supabase
      .from("Eventos")
      .select("id")
      .eq(
        "ID usuario",
        user.id
      )
      .maybeSingle();


  if (eventoError) {

    console.error(eventoError);

    status.textContent =
      "No se pudo obtener el evento.";

    return;

  }


  if (!evento) {

    status.textContent =
      "Todavía no publicaste ningún evento.";

    return;

  }


  /*
   * CREAR URL PÚBLICA
   */

  const url =
    `https://fabioboschel-lang.github.io/eventos/#/evento/${evento.id}`;


  /*
   * MOSTRAR URL
   */

  status.textContent =
    "Compartí este enlace con tus clientes:";

  link.href = url;

  link.textContent = url;

  link.style.display = "block";

}
