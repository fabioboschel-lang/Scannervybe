import { supabase } from "./supabase.js";

export function Sesion(app) {

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

  document
  .getElementById("googleBtn")
  .addEventListener(
    "click",
    async () => {

      alert(
        "Redirect: https://fabioboschel-lang.github.io/Scannervybe/"
      );

      const { data, error } =
        await supabase.auth.signInWithOAuth({

          provider: "google",

          options: {
            redirectTo:
              "https://fabioboschel-lang.github.io/Scannervybe/"
          }

        });

      console.log(data);

      if (error) {
        console.error(error);
      }

    }
  );

          });

        if (error) {

          console.error(error);

          alert(
            "No se pudo iniciar sesión."
          );

        }

      }

    );

}