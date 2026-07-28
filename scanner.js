import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export function Scanner(app) {

  app.innerHTML = `

    <div class="scanner-view">

      <button
        id="backBtn"
        class="back-btn"
      >
        ←
      </button>

      <div id="reader"></div>

      <div
        id="result"
        class="result"
      >
        Apuntá la cámara al código QR
      </div>

    </div>

  `;

  const result =
    document.getElementById("result");

  const scanner =
    new Html5Qrcode("reader");

  let procesando = false;

  document
    .getElementById("backBtn")
    .addEventListener(
      "click",
      async () => {

        try {

          await scanner.stop();

        } catch (err) {

          console.warn(err);

        }

        navigate("home");

      }
    );

  async function procesarQR(qrToken) {

    if (procesando) return;

    procesando = true;

    try {

      const {
        data,
        error
      } = await supabase
        .from("Tickets")
        .select("*")
        .eq("qr_token", qrToken)
        .single();

      if (error || !data) {

        result.textContent =
          "❌ QR inválido";

      } else if (
        data.Estado !== "usable"
      ) {

        result.textContent =
          "❌ Ticket ya utilizado";

      } else {

        const {
          error: updateError
        } = await supabase
          .from("Tickets")
          .update({
            Estado: "used"
          })
          .eq(
            "qr_token",
            qrToken
          );

        if (updateError) {

          result.textContent =
            "❌ Error al actualizar el ticket";

        } else {

          result.textContent =
            "✅ Acceso permitido";

        }

      }

    } catch (err) {

      console.error(err);

      result.textContent =
        "❌ Error inesperado";

    }

    setTimeout(() => {

      result.textContent =
        "Apuntá la cámara al código QR";

      procesando = false;

    }, 2000);

  }

  Html5Qrcode
    .getCameras()
    .then((devices) => {

      if (!devices.length) {

        result.textContent =
          "No se encontró ninguna cámara.";

        return;

      }

      scanner.start(

        {
          facingMode: "environment"
        },

        {
          fps: 10,
          
        },

        (decodedText) => {

          procesarQR(decodedText);

        },

        () => {}

      );

    })

    .catch((err) => {

      console.error(err);

      result.textContent =
        "No se pudo acceder a la cámara.";

    });

}