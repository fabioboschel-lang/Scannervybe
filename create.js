import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export function Create(app) {

  app.innerHTML = `

    <div class="create-view">

      <h1 class="create-title">
        Crear evento
      </h1>

      <input
        id="eventName"
        class="create-input"
        type="text"
        placeholder="Nombre del evento"
      >

      <input
        id="eventImage"
        class="create-input"
        type="url"
        placeholder="Imagen (URL)"
      >

      <textarea
        id="eventDescription"
        class="create-textarea"
        placeholder="Descripción"
      ></textarea>

      <input
        id="eventSocials"
        class="create-input"
        type="text"
        placeholder="Redes sociales"
      >

      <input
        id="eventLocation"
        class="create-input"
        type="text"
        placeholder="Ubicación"
      >

      <input
        id="eventDate"
        class="create-input"
        type="datetime-local"
      >

      <input
        id="eventPrice"
        class="create-input"
        type="number"
        min="0"
        placeholder="Valor de entrada"
      >

      <button
        id="createBtn"
        class="create-btn"
      >
        Crear evento
      </button>

    </div>

  `;

  document
    .getElementById("createBtn")
    .addEventListener(
      "click",
      async () => {

        const nombre =
          document
            .getElementById("eventName")
            .value
            .trim();

        const imagen =
          document
            .getElementById("eventImage")
            .value
            .trim();

        const descripcion =
          document
            .getElementById("eventDescription")
            .value
            .trim();

        const redes =
          document
            .getElementById("eventSocials")
            .value
            .trim();

        const ubicacion =
          document
            .getElementById("eventLocation")
            .value
            .trim();

        const fecha =
          document
            .getElementById("eventDate")
            .value;

        const valor =
          document
            .getElementById("eventPrice")
            .value
            .trim();

        if (!nombre) {
          alert("Ingresá el nombre del evento.");
          return;
        }

        if (!imagen) {
          alert("Ingresá la imagen.");
          return;
        }

        if (!descripcion) {
          alert("Ingresá la descripción.");
          return;
        }

        if (!redes) {
          alert("Ingresá las redes sociales.");
          return;
        }

        if (!ubicacion) {
          alert("Ingresá la ubicación.");
          return;
        }

        if (!fecha) {
          alert("Seleccioná la fecha.");
          return;
        }

        if (!valor) {
          alert("Ingresá el valor de la entrada.");
          return;
        }

        const {
          data: sessionData
        } =
          await supabase.auth.getSession();

        const user =
          sessionData.session?.user;

        if (!user) {

          alert(
            "No hay ninguna sesión iniciada."
          );

          return;

        }

        try {

          const { error } =
            await supabase
              .from("Eventos")
              .insert({

                nombre: nombre,

                imagen: imagen,

                descripcion: descripcion,

                redes: redes,

                ubicacion: ubicacion,

                fecha: fecha,

                valor: Number(valor),

                "ID usuario": user.id

              });

          if (error) {
            throw error;
          }

          navigate("home");

        } catch (err) {

          console.error(err);

          alert(
            "No se pudo crear el evento."
          );

        }

      }

    );

}