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

          alert(
            "Ingresá el nombre del evento."
          );

          return;

        }

        if (!fecha) {

          alert(
            "Seleccioná la próxima fecha."
          );

          return;

        }

        if (!valor) {

          alert(
            "Ingresá el valor de la entrada."
          );

          return;

        }

        try {

          const { error } =
            await supabase
              .from("Eventos")
              .insert({
                nombre: nombre,
                fecha: fecha,
                valor: Number(valor)
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