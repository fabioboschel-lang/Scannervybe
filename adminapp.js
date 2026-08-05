import { Sesion } from "./sesion.js";
import { Home } from "./home.js";
import { Scanner } from "./scanner.js";
import { supabase } from "./supabase.js";
import { Create } from "./create.js";
import { MercadoPago } from "./mercadopago.js";
const app =
  document.getElementById("app");


const routes = {
  sesion: Sesion,
  home: Home,
  scanner: Scanner,
  create: Create,
  mercadopago: MercadoPago,
};

export function navigate(route) {

  const screen =
    routes[route];

  if (!screen) {

    console.error(
      "Ruta inexistente:",
      route
    );

    return;

  }

  screen(app);

}


async function iniciarApp() {

  const {
    data
  } =
  await supabase.auth.getSession();


if (data.session) {

  const user =
    data.session.user;

  const { error } =
    await supabase
      .from("Socios")
      .upsert(
        {
          "ID usuario": user.id,
          Gmail: user.email
        },
        {
          onConflict: "ID usuario"
        }
      );

  if (error) {

    console.error(error);

    return;

  }

  const {
  data: evento,
  error: eventoError
} =
  await supabase
    .from("Eventos")
    .select("nombre")
    .eq(
      "ID usuario",
      user.id
    )
    .maybeSingle();

if (eventoError) {

  console.error(eventoError);

  return;

}

  if (evento) {

    navigate("home");

  } else {

    navigate("home");

  }

} else {

  navigate("sesion");

}

}


iniciarApp();
