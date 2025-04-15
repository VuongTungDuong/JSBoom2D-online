
import { DIRECTION } from './define.js';

export class InputHandler {
  /**
   *
   * @param {import('./game.js').Game} game
   */
  constructor(game) {
    this.game = game;
    window.addEventListener('keydown', e => {

      switch (e.key) {
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.LEFT:
        case DIRECTION.RIGHT:
          if (-1 === this.game.player.playerDirection.indexOf(e.key)) {
            this.game.player.playerDirection.push(e.key);
            this.game.ws.sendMove();
          }

          break;
        default:
          break;
      }
    });



    window.addEventListener('keyup', e => {

      switch (e.key) {
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.LEFT:
        case DIRECTION.RIGHT:
          if (-1 < this.game.player.playerDirection.indexOf(e.key)) {
            this.game.player.playerDirection.splice(this.game.player.playerDirection.indexOf(e.key), 1);
            this.game.ws.sendMove();
          }
          break;
        case DIRECTION.PUTBOOM:
          this.game.player.putBoom();
          this.game.ws.sendPutBoom();
          break;
      }
    });
  }

}

export class KeyPressPlayer {
  /**
   *
   * @param {string} UP
   * @param {string} DOWN
   * @param {string} LEFT
   * @param {string} RIGHT
   * @param {string} PUTBOOM
   */

  constructor(UP, DOWN, LEFT, RIGHT, PUTBOOM) {
    this.UP = UP;
    this.DOWN = DOWN;
    this.LEFT = LEFT;
    this.RIGHT = RIGHT;
    this.PUTBOOM = PUTBOOM;
  }

}