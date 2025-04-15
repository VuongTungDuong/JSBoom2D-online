

import { WoodBox, Stone, Shoes, Item, randomItem, AddBoom, Potion } from './items.js';
import { Player } from './player.js';
import { STONE, WOODBOX } from "./define.js";
export class MapGame {
  /**
   *
   * @param {import('./main.js').Game} game
   * @param {[{}]} map
   */
  constructor(game, map) {
    this.game = game;
    this.bockImage = document.getElementById('block');
    this.bockImageWidth = 52;
    this.bockImageHeight = 52;

    // time add new item
    this.timeInterval = 0;
    this.maxTimeAddItem = 15000;
    this.isAddItem = false;


    for (let i = 0; i < map.length; i++) {
      // console.log(map[i]);
      const value = map[i];
      let x = value.x, y = value.y;
      if (value.type === WOODBOX) {

        let woodbox = new WoodBox(this.game, value.x, value.y);
        // item la so 0 1 2

        switch (value.item) {
          case 0:
            woodbox.item = new AddBoom(this.game, x, y);
            break;
          case 1:
            woodbox.item = new Shoes(this.game, x, y);
            break;
          case 2:
            woodbox.item = new Potion(this.game, x, y);
            break;

          default:
            break;
        }
        this.game.map[x][y] = woodbox;
      }
      else if (value.type === STONE) {
        this.game.map[x][y] = new Stone(this.game, x, y);
      }

    }
    // for (let x = 0; x < this.game.maxMapX; x++) {
    //   for (let y = 0; y < this.game.maxMapY; y++) {
    //     if (0.1 >= Math.random()) {
    //       this.game.map[x][y] = new Stone(this.game, x, y);
    //     } else if (0.5 <= Math.random()) {
    //       this.game.map[x][y] = new WoodBox(this.game, x, y);
    //     }
    //   }
    // }
  }
  update(deltaTime) {
    // if (this.isAddItem == false) {
    //   if (this.timeInterval >= this.maxTimeAddItem) {
    //     this.timeInterval = 0;
    //     this.isAddItem = true;
    //   } else this.timeInterval += deltaTime;

    // }

    for (let x = 0; x < this.game.maxMapX; x++) {
      for (let y = 0; y < this.game.maxMapY; y++) {
        let valmap = this.game.map[x][y];
        if (valmap instanceof WoodBox || valmap instanceof Stone) {
          if (valmap.makedelete == true) {
            if (valmap instanceof WoodBox) {
              valmap.addItem();
            }
          }
        } else if (this.isAddItem && !(valmap instanceof Item)) {
          if (Math.random() >= 0.01) {
            continue;
          }
          let item = randomItem(this.game, x, y);
          if (item != null) {
            this.game.map[x][y] = item;
            this.isAddItem = false;
          }
        }
      }
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    // console.log(this.game.maxMapX);
    for (let x = 0; x < this.game.maxMapX; x++) {
      for (let y = 0; y < this.game.maxMapY; y++) {
        context.drawImage(this.bockImage, this.bockImageWidth * 0, this.bockImageHeight, this.bockImageWidth, this.bockImageHeight, x * this.game.boxgame, y * this.game.boxgame, this.game.boxgame, this.game.boxgame);
        let valmap = this.game.map[x][y];
        if (valmap instanceof WoodBox || valmap instanceof Stone || valmap instanceof Item) {
          valmap.draw(context);
        }
      }
    }
  }
}