import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export function Home(app) {

  app.innerHTML = `

    <main class="home-view">

      <section class="event-link-container">

        <h1 class="event-link-title">
          Enlace para escanear tickets
        </h1>

        <p
          id="scanLinkStatus"
          class="event-link-status"
        >
          Generando enlace...
        </p>

        <a
          id="scanLink"
          class="event-link"
          href="#"
          target="_blank"
          style="display: none;"
        ></a>

      </section>


      <button
        id="createEventBtn"
        class="create-event-btn"
      >
        Publicar evento
      </button>

    </main>

  `;


  cargarHome();


  document
    .getElementById("createEventBtn")
    .addEventListener(
      "click",
      () => {

        navigate("create");

      }
    );

}


async function cargarHome() {

  const status =
    document.getElementById(
      "scanLinkStatus"
    );

  const link =
    document.getElementById(
      "scanLink"
    );


  const storedSession =
    localStorage.getItem(
      "sb-qexgbswdbwlpydolpcll-auth-token"
    );


  if (!storedSession) {

    status.textContent =
      "No hay una sesión local.";

    return;

  }


  let session;


  try {

    session =
      JSON.parse(
        storedSession
      );

  } catch (error) {

    console.error(error);

    status.textContent =
      "Sesión local inválida.";

    return;

  }


  const userId =
    session?.user?.id;


  if (!userId) {

    status.textContent =
      "No se encontró el ID de usuario.";

    return;

  }


  const {
    data: evento,
    error
  } =
    await supabase
      .from("Eventos")
      .select("id")
      .eq(
        "ID usuario",
        userId
      )
      .limit(1)
      .maybeSingle();


  if (error) {

    console.error(
      "Error obteniendo evento:",
      error
    );

    status.textContent =
      "No se pudo obtener el evento.";

    return;

  }


  if (!evento) {

    status.textContent =
      "No existe un evento creado.";

    return;

  }


  const scanUrl =
    "https://fabioboschel-lang.github.io/ValidarTickets/" +
    "?evento=" +
    encodeURIComponent(
      evento.id
    );


  link.href =
    scanUrl;

  link.textContent =
    scanUrl;

  link.style.display =
    "block";

  status.textContent =
    "Compartí este enlace con tu staff para que puedan escanear los tickets.";

}