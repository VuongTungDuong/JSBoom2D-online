
import { WebSockets } from "./websocket.js";
import { Game } from './game.js';
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvasid");
const ctx = canvas.getContext('2d');
canvas.width = 0;
canvas.height = 0;




/*
int game
*/


const game = new Game();

const ws = new WebSockets(game, canvas);

game.setSocket(ws);

window.game = game;
let lastTime = 0;


/**
 *
 * @param {number} timeStamp
 */
function animate(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(animate);
}
animate(0);