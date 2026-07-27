import { navigate } from "./adminapp.js";

export function Home(app) {

  app.innerHTML = `

    <div class="home-view">

      <button
        id="scanBtn"
        class="scan-btn"
      >
        Escanear
      </button>

    </div>

  `;

  document
    .getElementById("scanBtn")
    .addEventListener(
      "click",
      () => navigate("scanner")
    );

}