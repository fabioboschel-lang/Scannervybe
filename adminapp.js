import { Create } from "./create.js";
import { Home } from "./home.js";
import { Scanner } from "./scanner.js";

const app = document.getElementById("app");

const routes = {
  create: Create,
  home: Home,
  scanner: Scanner
};

export function navigate(route) {

  const screen = routes[route];

  if (!screen) {

    console.error("Ruta inexistente:", route);

    return;

  }

  screen(app);

}

navigate("create");