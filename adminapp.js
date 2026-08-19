import { Sesion } from "./sesion.js";
import { Home } from "./home.js";
import { Create } from "./create.js";
import { supabase } from "./supabase.js";


const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  create: Create

};


export function navigate(route) {

  const screen =
    routes[route];

  if (!screen) {

    console.error(
      "Ruta inexistente:",
      route
    );

    return;

  }

  screen(app);

}


/* =========================
   OBTENER USUARIO LOCAL
   ========================= */

function obtenerUsuarioLocal() {

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


/* =========================
   INICIAR APLICACIÓN
   ========================= */

async function iniciarApp() {

  const userId =
    obtenerUsuarioLocal();


  /*
   * PRIMER SÍ:
   *
   * ¿Existe un ID de usuario
   * en Local Storage?
   */

  if (!userId) {

    navigate("sesion");

    return;

  }


  /*
   * SEGUNDO SÍ:
   *
   * ¿Existe un evento creado
   * por este usuario?
   */

  const {
    data: evento,
    error: eventoError
  } =
    await supabase
      .from("Eventos")
      .select("nombre")
      .eq(
        "ID usuario",
        userId
      )
      .limit(1);


  if (eventoError) {

    console.error(
      "Error comprobando evento:",
      eventoError
    );

    return;

  }


  /*
   * NO TIENE EVENTO
   */

  if (
    !evento ||
    evento.length === 0
  ) {

    navigate("create");

    return;

  }


  /*
   * TIENE EVENTO
   */

  navigate("home");

}


/* =========================
   ESPERAR A SUPABASE
   ========================= */

let aplicacionIniciada =
  false;


const {
  data: authListener
} =
  supabase.auth.onAuthStateChange(
    (event, session) => {

      /*
       * INITIAL_SESSION ocurre
       * cuando Supabase terminó
       * de cargar/procesar la sesión
       * inicial.
       */

      if (
        event ===
        "INITIAL_SESSION"
      ) {

        if (
          aplicacionIniciada
        ) {

          return;

        }

        aplicacionIniciada =
          true;


        iniciarApp();

      }

    }
  );
