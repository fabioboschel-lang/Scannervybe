import { supabase } from "./supabase.js";

const result =
  document.getElementById("result");

const scanner =
  new Html5Qrcode("reader");

async function procesarQR(qrToken) {

  try {

    await scanner.stop();

    const {
      data,
      error
    } = await supabase
      .from("Tickets")
      .select("*")
      .eq("qr_token", qrToken)
      .single();

    if (error || !data) {

      result.innerHTML =
        "❌ QR inválido";

      return;

    }

    if (data.Estado !== "usable") {

      result.innerHTML =
        "❌ Ticket ya utilizado";

      return;

    }

    const { error: updateError } =
      await supabase
        .from("Tickets")
        .update({
          Estado: "used"
        })
        .eq(
          "qr_token",
          qrToken
        );

    if (updateError) {

      result.innerHTML =
        "❌ Error al actualizar el ticket";

      return;

    }

    result.innerHTML =
      "✅ Acceso permitido";

  } catch (err) {

    console.error(err);

    result.innerHTML =
      "❌ Error inesperado";

  }

}

Html5Qrcode
  .getCameras()
  .then((devices) => {

    if (!devices.length) {

      result.innerHTML =
        "No se encontró ninguna cámara.";

      return;

    }

    scanner.start(

      {
        facingMode: "environment"
      },

      {
        fps: 10,
        qrbox: 250
      },

      (decodedText) => {

        procesarQR(decodedText);

      }

    );

  })

  .catch((err) => {

    console.error(err);

    result.innerHTML =
      "No se pudo acceder a la cámara.";

  });