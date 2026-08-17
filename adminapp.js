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

    return session?.user?.id ?? null;

  } catch (error) {

    console.error(
      "Sesión local inválida:",
      error
    );

    return null;

  }

}


async function iniciarApp() {

  const userId =
    obtenerUsuarioLocal();


  if (!userId) {

    navigate("sesion");

    return;

  }


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
      eventoError
    );

    return;

  }


  if (
    !evento ||
    evento.length === 0
  ) {

    navigate("create");

    return;

  }


  navigate("home");

}


iniciarApp();
