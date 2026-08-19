export function KiteEditor({
  initialColor = "#ffffff",
  onChange = () => {}
} = {}) {

  let colorActual =
    initialColor;

  const container =
    document.createElement("div");

  container.className =
    "kite-editor";

  const button =
    document.createElement("button");

  button.type =
    "button";

  button.className =
    "kite-color-button";

  button.style.backgroundColor =
    colorActual;

  button.setAttribute(
    "aria-label",
    "Elegir color de fondo"
  );


  const input =
    document.createElement("input");

  input.type =
    "color";

  input.value =
    colorActual;

  input.className =
    "kite-color-input";


  input.addEventListener(
    "input",
    () => {

      colorActual =
        input.value;

      button.style.backgroundColor =
        colorActual;

      onChange(colorActual);

    }
  );


  button.addEventListener(
    "click",
    () => {

      input.click();

    }
  );


  container.appendChild(
    button
  );

  container.appendChild(
    input
  );


  return {

    element:
      container,

    getColor() {

      return colorActual;

    }

  };

}