import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export async function Sesion(app) {

  app.innerHTML = `

    <div class="session-view">

      <button
        id="googleBtn"
        class="google-btn"
      >
        Continuar con Google
      </button>

    </div>

  `;


  const {
    data
  } = await supabase.auth.getSession();


  if (data.session) {

    await guardarSocio(
      data.session.user
    );

    navigate("rueda");

    return;

  }


  document
    .getElementById("googleBtn")
    .addEventListener(
      "click",
      async () => {

        const {
          error
        } =
        await supabase.auth.signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              window.location.origin

          }

        });


        if (error) {

          console.error(error);

          alert(
            "Error al iniciar sesión con Google."
          );

        }

      }
    );


}



async function guardarSocio(user) {


  const {
    error
  } =
  await supabase
    .from("Socios")
    .upsert(
      {
        "ID usuario":
          user.id,

        Gmail:
          user.email
      },
      {
        onConflict:
          "ID usuario"
      }
    );


  if (error) {

    console.error(
      "Error guardando socio:",
      error
    );

    throw error;

  }

}