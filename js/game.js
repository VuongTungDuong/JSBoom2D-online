import { Player } from "./player.js";
import { InputHandler, KeyPressPlayer } from "./Inputhandler.js";
import { MapGame } from "./mapgame.js";
import { randomItem } from "./items.js";


// game
export class Game {

  constructor() {
    this.isInit = true;
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   * @param {[{}]} map
   * @param {boolean} isplayerone
   */
  init(width, height, map) {

    // console.log(map);
    // define witdh height player - boom -
    this.boxgame = 50;

    this.width = width * this.boxgame;
    this.height = height * this.boxgame;


    // debug
    this.debug = false;

    this.maxMapX = Math.floor(this.width / this.boxgame);
    this.maxMapY = Math.floor(this.height / this.boxgame);

    this.map = new Array();
    for (let i = 0; i < this.maxMapX; i++) {
      this.map[i] = new Array(this.maxMapY);
    }

    this.mapgame = new MapGame(this, map);

    let x = Math.floor(Math.random() * this.maxMapX) * this.boxgame;
    let y = Math.floor(Math.random() * this.maxMapY) * this.boxgame;

    let name = Math.floor(Math.random() * 1000000);

    let p1 = new Player(this, x, y, document.getElementById('player_2'), name, true);

    this.player = p1;


    this.players = {};


    this.input = new InputHandler(this);
    // array new boom
    this.booms = [];
    // array vu no
    this.explodes = [];
    // map tinh toan vi tri

    this.isInit = false;
  }

  setSocket(ws) {
    this.ws = ws;
  }

  /**
   *
   * @param {number} deltaTime
   */
  update(deltaTime) {

    if (this.isInit) return;
    this.player.update(deltaTime, this.player.playerDirection[0]);
    for (const key in this.players) {
      if (Object.hasOwnProperty.call(this.players, key)) {
        const element = this.players[key];
        element.update(deltaTime, element.playerDirection[0]);
      }
    }
    this.booms.forEach(b => b.update(deltaTime));
    this.explodes.forEach(e => e.update(deltaTime));
    this.booms = this.booms.filter(b => !b.makedelete);
    this.explodes = this.explodes.filter(e => !e.makedelete);
    this.mapgame.update(deltaTime);

  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    if (this.isInit) return;
    this.mapgame.draw(context);
    this.explodes.forEach(e => e.draw(context));
    this.booms.forEach(b => b.draw(context));
    for (const key in this.players) {
      if (Object.hasOwnProperty.call(this.players, key)) {
        const element = this.players[key];
        element.draw(context);
      }
    }
    this.player.draw(context);

  }
}
