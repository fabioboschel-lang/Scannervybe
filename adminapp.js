import { Sesion } from "./sesion.js";
import { Home } from "./home.js";
import { Scanner } from "./scanner.js";
import { supabase } from "./supabase.js";
import { Create } from "./create.js";

const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  scanner: Scanner,

  create: Create,
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


async function iniciarApp() {

  const {
    data
  } =
  await supabase.auth.getSession();


if (data.session) {

  const user =
    data.session.user;

  const { error } =
    await supabase
      .from("Socios")
      .upsert(
        {
          "ID usuario": user.id,
          Gmail: user.email
        },
        {
          onConflict: "ID usuario"
        }
      );

  if (error) {

    console.error(error);

    return;

  }

  navigate("create");

} else {

  navigate("sesion");

}

}


iniciarApp();