import { Sesion } from "./sesion.js";
import { Home } from "./home.js";
import { Scanner } from "./scanner.js";
import { supabase } from "./supabase.js";
import { Create } from "./create.js";
import { MercadoPago } from "./mercadopago.js";


const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  scanner: Scanner,

  create: Create,

  mercadopago: MercadoPago

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


async function procesarMercadoPago() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const code =
    params.get("code");

  const state =
    params.get("state");


  if (!code && !state) {

    return false;

  }


  if (!code || !state) {

    console.error(
      "Respuesta OAuth incompleta."
    );

    return true;

  }


  try {

    const {
      data,
      error
    } =
    await supabase.functions.invoke(
      "mercadopago-oauth",
      {
        body: {
          code: code,
          state: state
        }
      }
    );


    if (error) {

      throw error;

    }


    console.log(
      "Respuesta de Mercado Pago:",
      data
    );


    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );


  } catch (error) {

    console.error(
      "Error procesando OAuth:",
      error
    );

  }


  return true;

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


    return session?.user ?? null;

  } catch (error) {

    console.error(
      "Sesión local inválida:",
      error
    );

    return null;

  }

}


async function iniciarApp() {

  const oauthProcesado =
    await procesarMercadoPago();


  if (oauthProcesado) {

    return;

  }


  const user =
    obtenerUsuarioLocal();


  if (!user) {

    navigate("sesion");

    return;

  }


  const {
    data: evento,
    error: eventoError
  } =
  await supabase
    .from("Eventos")
    .select("*")
    .eq(
      "ID usuario",
      user.id
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


  const {
    data: mercadoPago,
    error: mercadoPagoError
  } =
  await supabase
    .from("MercadoPago")
    .select("*")
    .eq(
      "ID usuario",
      user.id
    )
    .limit(1);


  if (mercadoPagoError) {

    console.error(
      mercadoPagoError
    );

    return;

  }


  if (
    !mercadoPago ||
    mercadoPago.length === 0
  ) {

    navigate("mercadopago");

    return;

  }


  navigate("home");

}


iniciarApp();
