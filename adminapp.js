import { Sesion } from "./sesion.js";
import { Rueda } from "./rueda.js";
import { Home } from "./home.js";
import { Scanner } from "./scanner.js";
import { supabase } from "./supabase.js";


const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  rueda: Rueda,

  home: Home,

  scanner: Scanner

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


    await navigate(
      "rueda"
    );


  } else {


    navigate(
      "sesion"
    );


  }

}



iniciarApp();