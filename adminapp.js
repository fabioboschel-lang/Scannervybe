import {
  procesarAutorizacionMercadoPago
} from "./mpoauthvalidate.js";

import { Sesion } from "./sesion.js";
import { Home } from "./home.js";
import { Create } from "./create.js";
import { supabase } from "./supabase.js";
import {MercadoPago } from "./mercadopago.js";

const app =
  document.getElementById("app");


const routes = {

  sesion: Sesion,

  home: Home,

  create: Create,

  mercadopago: mercadopago
  

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

    navigate("mercadopago");

    return;

  }


  /*
   * TIENE EVENTO
   */

  navigate("mercadopago");

}


/* =========================
   INICIAR APLICACIÓN
   ========================= */

async function arrancarAplicacion() {

  /*
   * Primero comprobamos si
   * estamos regresando de
   * Mercado Pago.
   */

  const mercadoPagoProcesado =
    await procesarAutorizacionMercadoPago();


  /*
   * Si procesamos correctamente
   * una autorización, ya podemos
   * continuar con la aplicación.
   */

  if (mercadoPagoProcesado) {

    console.log(
      "Autorización de Mercado Pago procesada."
    );

  }


  /*
   * Después iniciamos el
   * funcionamiento normal.
   */

  await iniciarApp();

}


/* =========================
   ARRANCAR
   ========================= */

arrancarAplicacion();