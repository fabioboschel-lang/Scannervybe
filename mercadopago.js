import { supabase } from "./supabase.js";

export function MercadoPago(app) {

app.innerHTML = `

```
<div class="mercadopago-view">

  <h1 class="mercadopago-title">
    Conectá tu cuenta de Mercado Pago
  </h1>

  <p class="mercadopago-description">
    Conectá tu cuenta para poder recibir los pagos de tus eventos.
  </p>

  <button
    id="mercadopagoBtn"
    class="mercadopago-btn"
  >
    Conectar Mercado Pago
  </button>

</div>
```

`;

document
.getElementById("mercadopagoBtn")
.addEventListener(
"click",
async () => {

```
    const {
      data,
      error
    } =
      await supabase.auth.getSession();

    if (error) {

      console.error(error);

      alert(
        "No se pudo comprobar la sesión."
      );

      return;

    }

    const user =
      data.session?.user;

    if (!user) {

      alert(
        "Primero tenés que iniciar sesión."
      );

      return;

    }

    /*
     * Identificador único para este intento
     * de autorización.
     *
     * NO contiene información sensible.
     */

    const state =
      crypto.randomUUID();

    /*
     * Guardamos temporalmente el state
     * junto con el usuario que inició
     * la autorización.
     *
     * Esto nos permitirá comprobar
     * posteriormente que el código recibido
     * corresponde al usuario correcto.
     */

    sessionStorage.setItem(
      "mercadopago_oauth_state",
      state
    );

    sessionStorage.setItem(
      "mercadopago_oauth_user",
      user.id
    );

    /*
     * ID de la aplicación de Mercado Pago.
     *
     * IMPORTANTE:
     * reemplazar este valor por el APP_ID
     * real de tu aplicación.
     */

    const clientId =
      "3944581132326328";

    /*
     * Esta URL debe ser EXACTAMENTE
     * la misma que configuraste en
     * Mercado Pago.
     */

    const redirectUri =
      "https://fabioboschel-lang.github.io/Scannervybe/";

    const authorizationUrl =
      new URL(
        "https://auth.mercadopago.com.ar/authorization"
      );

    authorizationUrl.searchParams.set(
      "client_id",
      clientId
    );

    authorizationUrl.searchParams.set(
      "response_type",
      "code"
    );

    authorizationUrl.searchParams.set(
      "platform_id",
      "mp"
    );

    authorizationUrl.searchParams.set(
      "redirect_uri",
      redirectUri
    );

    authorizationUrl.searchParams.set(
      "state",
      state
    );

    window.location.href =
      authorizationUrl.toString();

  }
);
```

}
