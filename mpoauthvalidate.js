export async function procesarAutorizacionMercadoPago() {

  const url =
    new URL(window.location.href);

  const code =
    url.searchParams.get("code");

  const state =
    url.searchParams.get("state");


  // No hay parámetros de Mercado Pago
  if (!code && !state) {

    return false;

  }


  // Faltan parámetros
  if (!code || !state) {

    console.error(
      "Respuesta de Mercado Pago incompleta."
    );

    console.error({
      code,
      state
    });

    return false;

  }


  console.log(
    "Código de autorización recibido:",
    code
  );

  console.log(
    "State recibido:",
    state
  );


  try {

    const response =
      await fetch(
        "https://qexgbswdbwlpydolpcll.supabase.co/functions/v1/mercadopago-oauth",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            code:
              code,

            state:
              state

          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      console.error(
        "Error en mercadopago-oauth:",
        data
      );

      return false;

    }


    console.log(
      "Mercado Pago conectado correctamente:",
      data
    );


    /*
     * El código de autorización ya fue utilizado.
     * Eliminamos code y state de la URL.
     */

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname +
      window.location.hash
    );


    return true;


  } catch (error) {

    console.error(
      "Error enviando autorización de Mercado Pago:",
      error
    );

    return false;

  }

}