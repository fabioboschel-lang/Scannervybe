import { navigate } from "./adminapp.js";

export function Home(app) {

  app.innerHTML = `

  <div class="home-view">

    <button
      id="createEventBtn"
      class="create-event-btn"
    >
      Publicar evento
    </button>

    <button
      id="scanBtn"
      class="scan-btn"
    >
      Escanear
    </button>

  </div>

`;
  document
  .getElementById("createEventBtn")
  .addEventListener(
    "click",
    () => navigate("create")
  );

  document
    .getElementById("scanBtn")
    .addEventListener(
      "click",
      () => navigate("scanner")
    );

}