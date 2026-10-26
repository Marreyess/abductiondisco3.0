
import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);

game.start();

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  const x =
    (event.clientX - rect.left) * (canvas.width / rect.width);

  const y =
    (event.clientY - rect.top) * (canvas.height / rect.height);

  game.handleClick(x, y);
});
