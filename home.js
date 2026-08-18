import { supabase } from "./supabase.js";


export function Home(app) {

  app.innerHTML = `

    <main class="home-view">

      <!-- =========================
           ENLACE DE COMPRA
           ========================= -->

      <section class="event-link-container">

        <h1 class="event-link-title">
          Enlace de compra
        </h1>

        <p
          id="purchaseLinkStatus"
          class="event-link-status"
        >
          Generando enlace...
        </p>

        <a
          id="purchaseLink"
          class="event-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          style="display: none;"
        ></a>

      </section>


      <!-- =========================
           ENLACE DE ESCANEO
           ========================= -->

      <section class="event-link-container">

        <h1 class="event-link-title">
          Enlace de escaneo
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
          rel="noopener noreferrer"
          style="display: none;"
        ></a>

      </section>

    </main>

  `;


  cargarHome();

}


async function cargarHome() {

  const purchaseLinkStatus =
    document.getElementById(
      "purchaseLinkStatus"
    );

  const purchaseLink =
    document.getElementById(
      "purchaseLink"
    );


  const scanLinkStatus =
    document.getElementById(
      "scanLinkStatus"
    );

  const scanLink =
    document.getElementById(
      "scanLink"
    );


  /*
   * =========================
   * OBTENER SESIÓN LOCAL
   * =========================
   */

  const storedSession =
    localStorage.getItem(
      "sb-qexgbswdbwlpydolpcll-auth-token"
    );


  if (!storedSession) {

    purchaseLinkStatus.textContent =
      "No hay una sesión local.";

    scanLinkStatus.textContent =
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

    console.error(
      "Sesión local inválida:",
      error
    );

    purchaseLinkStatus.textContent =
      "Sesión local inválida.";

    scanLinkStatus.textContent =
      "Sesión local inválida.";

    return;

  }


  const userId =
    session?.user?.id;


  if (!userId) {

    purchaseLinkStatus.textContent =
      "No se encontró el ID de usuario.";

    scanLinkStatus.textContent =
      "No se encontró el ID de usuario.";

    return;

  }


  /*
   * =========================
   * OBTENER EVENTO
   * =========================
   */

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

    purchaseLinkStatus.textContent =
      "No se pudo obtener el evento.";

    scanLinkStatus.textContent =
      "No se pudo obtener el evento.";

    return;

  }


  if (!evento) {

    purchaseLinkStatus.textContent =
      "No existe un evento creado.";

    scanLinkStatus.textContent =
      "No existe un evento creado.";

    return;

  }


  /*
   * =========================
   * ID DEL EVENTO
   * =========================
   */

  const eventoId =
    evento.id;


  /*
   * =========================
   * ENLACE DE COMPRA
   * =========================
   */

  const purchaseUrl =
  "https://fabioboschel-lang.github.io/eventos/" +
  "#/evento/" +
  encodeURIComponent(
    eventoId
  );


  purchaseLink.href =
    purchaseUrl;

  purchaseLink.textContent =
    purchaseUrl;

  purchaseLink.style.display =
    "block";

  purchaseLinkStatus.textContent =
    "Compartí este enlace con las personas que quieran comprar entradas.";


  /*
   * =========================
   * ENLACE DE ESCANEO
   * =========================
   */

  const scanUrl =
    "https://fabioboschel-lang.github.io/ValidarTickets/" +
    "?evento=" +
    encodeURIComponent(
      eventoId
    );


  scanLink.href =
    scanUrl;

  scanLink.textContent =
    scanUrl;

  scanLink.style.display =
    "block";

  scanLinkStatus.textContent =
    "Compartí este enlace con tu staff para que puedan escanear los tickets.";

}