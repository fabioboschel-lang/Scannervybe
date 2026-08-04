```javascript
import { navigate } from "./adminapp.js";
import { supabase } from "./supabase.js";

export function Create(app) {

  app.innerHTML = `

    <div class="create-view">

      <h1 class="create-title">
        Crear evento
      </h1>

      <label
        for="eventImage"
        class="image-selector"
      >

        <span id="imageText">
          Seleccionar imagen
        </span>

        <img
          id="imagePreview"
          class="image-preview"
          style="display: none;"
        >

      </label>

      <input
        id="eventImage"
        type="file"
        accept="image/*"
        hidden
      >

      <input
        id="eventName"
        class="create-input"
        type="text"
        placeholder="Nombre del evento"
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
        type="button"
      >
        Publicar evento
      </button>

    </div>

  `;


  const imageInput =
    document.getElementById("eventImage");

  const imagePreview =
    document.getElementById("imagePreview");

  const imageText =
    document.getElementById("imageText");


  /*
   * PREVISUALIZACIÓN
   *
   * Esto NO sube nada a Supabase.
   */

  imageInput.addEventListener(
    "change",
    () => {

      const imagen =
        imageInput.files[0];

      if (!imagen) return;

      imagePreview.src =
        URL.createObjectURL(imagen);

      imagePreview.style.display =
        "block";

      imageText.style.display =
        "none";

    }
  );


  /*
   * PUBLICAR EVENTO
   */

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
          imageInput.files[0];

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

          alert(
            "Ingresá el nombre del evento."
          );

          return;

        }


        if (!imagen) {

          alert(
            "Seleccioná una imagen."
          );

          return;

        }


        if (!descripcion) {

          alert(
            "Ingresá la descripción."
          );

          return;

        }


        if (!redes) {

          alert(
            "Ingresá las redes sociales."
          );

          return;

        }


        if (!ubicacion) {

          alert(
            "Ingresá la ubicación."
          );

          return;

        }


        if (!fecha) {

          alert(
            "Seleccioná la fecha."
          );

          return;

        }


        if (!valor) {

          alert(
            "Ingresá el valor de entrada."
          );

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

          /*
           * RECIÉN ACÁ SE SUBE LA IMAGEN
           */

          const extension =
            imagen.name
              .split(".")
              .pop();

          const nombreArchivo =
            `${crypto.randomUUID()}.${extension}`;

          const ruta =
            `${user.id}/${nombreArchivo}`;


          const {
            error: uploadError
          } =
            await supabase
              .storage
              .from("eventos")
              .upload(
                ruta,
                imagen
              );


          if (uploadError) {

            throw uploadError;

          }


          /*
           * URL DE LA IMAGEN
           */

          const {
            data: urlData
          } =
            supabase
              .storage
              .from("eventos")
              .getPublicUrl(ruta);


          const imagenUrl =
            urlData.publicUrl;


          /*
           * INSERT DEL EVENTO
           */

          const {
            error
          } =
            await supabase
              .from("Eventos")
              .insert({

                nombre: nombre,

                imagen: imagenUrl,

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
            "No se pudo publicar el evento."
          );

        }

      }
    );

}
```
