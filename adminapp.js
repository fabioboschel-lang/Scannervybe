
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

  mercadopago: MercadoPago,

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


  const {
    data,
    error
  } =
    await supabase.auth.getSession();


  if (error) {

    console.error(error);

    return true;

  }


  const user =
    data.session?.user;


  if (!user) {

    console.error(
      "No hay una sesión de Supabase."
    );

    return true;

  }


  if (state !== user.id) {

    console.error(
      "El state no coincide con el usuario."
    );

    return true;

  }


  try {

    const {
      data: functionData,
      error: functionError
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


    if (functionError) {

      throw functionError;

    }


    console.log(
      "Respuesta de Mercado Pago:",
      functionData
    );


    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );


    return true;

  } catch (error) {

    console.error(
      "Error procesando OAuth:",
      error
    );

    return true;

  }

}


async function iniciarApp() {

  const oauthProcesado =
    await procesarMercadoPago();


  if (oauthProcesado) {

    return;

  }


  const {
    data
  } =
  await supabase.auth.getSession();


  if (!data.session) {

    navigate("sesion");

    return;

  }


  const user =
    data.session.user;





  const {
    data: evento,
    error: eventoError
  } =
  await supabase
    .from("Eventos")
    .select("nombre")
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


  if (!evento || evento.length === 0) {

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

