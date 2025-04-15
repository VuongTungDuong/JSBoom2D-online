import { Boom } from './boom.js';
import { DIRECTION } from "./define.js";
import { WoodBox, Stone, Shoes, Potion, AddBoom, Item } from './items.js';

export class Player {
  /**
   *
   * @param {import ('./game.js').Game} game
   * @param {number} x
   * @param {number} y
   * @param {HTMLImageElement} image
   * @param {string} name
   */
  constructor(game, x, y, image, name, isClient = false) {
    this.game = game;
    this.name = name;
    this.boxgame = this.game.boxgame;

    this.isClient = isClient;

    this.x = x;
    this.y = y;
    // vi tri cu khi chua den noi
    this.xBackup = this.x;
    this.yBackup = this.y;
    // xac dinh dung vi tri den moi nhat
    this.xNew = this.x;
    this.yNew = this.y;

    // clear vi tri dung cua player tranh dam khong co loi di
    this.clearAroundPlayer();

    this.direction = null;
    this.isRunBlock = false;
    this.speed = 3;
    this.maxSpeed = 6;
    this.speedUp = 0.25;

    this.image = image;
    this.imageGhost = document.getElementById('ghost');
    this.frameGosht = 0;
    //img width height
    this.imageWith = 40;
    this.imageHeight = 50;
    // frame
    this.frameX = 0;
    this.frameY = 1;
    this.maxFrameX = 4;
    this.maxFrameY = 4;
    this.maxTimeFrame = 50;
    this.timeInterval = 0;

    this.spaceFrameX = 15;
    this.spaceFrameY = 7;

    // Item nhan duoc them . do dai cua boom
    // so luong boom nhan duoc
    this.maxBoom = 10;
    this.limitBoom = 1;
    this.useBoom = this.limitBoom;

    this.maxLengBoom = 7;
    this.lengBoom = 1;
    this.makedelete = false;

    this.playerDirection = [];
  }

  clearAroundPlayer() {
    let up = [1, -1, 0, 0, 0], down = [0, 0, 1, -1, 0];
    for (let i = 0; i <= 4; i++) {
      let x = this.x / this.boxgame + up[i];
      let y = this.y / this.boxgame + down[i];

      if (x >= 0 && y >= 0 && x < this.game.maxMapX && y < this.game.maxMapY) {
        this.game.map[x][y] = null;

      }

    }
  }

  updateSpeed() {
    this.speed = this.speed + this.speedUp < this.maxSpeed ? this.speed + this.speedUp : this.maxSpeed;
  }

  updateBoom() {
    if (this.limitBoom + 1 <= this.maxBoom) {
      this.limitBoom++;
      this.useBoom++;
    }
  }
  updateLengBoom() {
    if (this.lengBoom + 1 <= this.maxBoom) {
      this.lengBoom++;
    }
  }

  putBoom() {
    if (this.useBoom > 0) {
      let val = this.game.map[this.xBackup / this.boxgame][this.yBackup / this.boxgame];
      if (!(val instanceof Boom)) {
        var boom = new Boom(this.game, this);
        this.game.booms.push(boom);
        this.useBoom--;
        this.game.map[this.xBackup / this.boxgame][this.yBackup / this.boxgame] = boom;
      }
    }
  }

  getInfo() {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      xNew: this.xNew,
      yNew: this.yNew,
      xBackup: this.xBackup,
      yBackup: this.yBackup,
      direction: this.direction,
      playerDirection: this.playerDirection,
      isRunBlock: this.isRunBlock,
      speed: this.speed,
      useBoom: this.useBoom,
      lengBoom: this.lengBoom,
    };

  }

  /**
   *
   * @param {number} speedX
   * @param {number} speedY
   * @param {number} deltaTime
   *
   */
  move(speedX, speedY, deltaTime) {

    if (this.timeInterval > this.maxTimeFrame) {
      this.timeInterval = 0;
      if (0 < speedX) this.frameY = 2;       // right
      else if (0 > speedX) this.frameY = 1;  // lefp
      else if (0 < speedY) this.frameY = 0;  // down
      else if (0 > speedY) this.frameY = 3;  // up
      this.frameX = (this.frameX + 1) % this.maxFrameX;
    }
    else this.timeInterval += deltaTime;


    if (!this.isClient) {

      if (this.makedelete) {
        return;
      }
      let x = this.xNew / this.boxgame;
      let y = this.yNew / this.boxgame;

      let valMap = this.game.map[x][y];
      if (valMap instanceof Item) {

        this.game.map[x][y] = null;
      }

      return;
    }

    if (!this.isRunBlock && this.x + speedX >= 0 && this.x + speedX < this.game.width &&
      this.x + speedX + this.boxgame >= 0 && this.x + speedX + this.boxgame <= this.game.width &&
      this.y + speedY >= 0 && this.y + speedY <= this.game.height &&
      this.y + speedY + this.boxgame >= 0 && this.y + speedY + this.boxgame <= this.game.height) {

      // Update vi tri ke tie , p
      let x = 0, y = 0,
        tempXNew = this.xNew, tempYNew = this.yNew;
      if (speedX < 0) {
        x = this.xNew - this.boxgame;
        if (this.x <= this.xNew) this.xNew = x;
      }

      else if (speedX > 0) {
        x = this.xNew + this.boxgame;
        if (this.x >= this.xNew) this.xNew = x;  // neu
      }
      else if (speedY < 0) {
        y = this.yNew - this.boxgame;
        if (this.y <= this.yNew) this.yNew = y;
      }

      else if (speedY > 0) {
        y = this.yNew + this.boxgame;
        if (this.y >= this.yNew) this.yNew = y;
      }
      if (this.makedelete == false) {
        // kiem tra vi tri ke tiep xem di duoc khong
        x = this.xNew / this.boxgame;
        y = this.yNew / this.boxgame;

        let valMap = this.game.map[x][y];
        if (valMap instanceof Stone || valMap instanceof WoodBox || valMap instanceof Boom) {
          this.xNew = tempXNew;
          this.yNew = tempYNew;
          this.xBackup = tempXNew;
          this.yBackup = tempYNew;
          return false;
        }
        if (valMap instanceof Shoes) {
          this.updateSpeed();
          this.game.map[x][y] = null;
        }
        else if (valMap instanceof Potion) {
          this.updateLengBoom();
          this.game.map[x][y] = null;
        } else if (valMap instanceof AddBoom) {
          this.updateBoom();
          this.game.map[x][y] = null;
        }

      }

      if (this.xNew != tempXNew || this.yNew != tempYNew) {
        this.xBackup = tempXNew;
        this.yBackup = tempYNew;
      }

      this.x += speedX;
      this.y += speedY;

      this.game.ws.sendMove();
    } else if (this.isRunBlock) {
      // this.x = this.xNew;
      // this.y = this.yNew;
      const speed = 1.2;
      if (speedX < 0) {
        this.x = this.x + speedX * speed > this.xNew ? this.x + speedX * speed : this.xNew;
      }

      else if (speedX > 0) {
        this.x = this.x + speedX * speed < this.xNew ? this.x + speedX * speed : this.xNew;
      }
      else if (speedY < 0) {
        this.y = this.y + speedY * speed > this.yNew ? this.y + speedY * speed : this.yNew;
      }

      else if (speedY > 0) {
        this.y = this.y + speedY * speed < this.yNew ? this.y + speedY * speed : this.yNew;
      }
      if (this.x === this.xNew && this.y === this.yNew) {
        this.xBackup = this.x;
        this.yBackup = this.y;
        this.isRunBlock = false;
        this.direction = null;
      }
      this.game.ws.sendMove();
    }

  }


  /**
   *  @param {number} deltaTime
   *  @param {string} direction
   *
   */
  update(deltaTime, direction = 0) {

    if (this.makedelete) {
      this.maxFrameX = 3;
      this.maxBoom = 0;
      this.limitBoom = 0;
      this.speed = 5;
      this.useBoom = 0;
    }
    if (this.isClient) {
      if (direction === 0) {
        if (this.x != this.xNew && this.y != this.yNew) {
          this.isRunBlock = true;
        }
      }
      if (direction != this.direction && this.direction != null) {
        direction = this.direction;
        this.isRunBlock = true;
      } else if (direction != 0) {
        this.direction = direction;
      }
    } else {

      if (this.isRunBlock) {
        direction = this.direction;
      }
    }



    switch (direction) {
      case DIRECTION.LEFT: // left
        this.move(-this.speed, 0, deltaTime);
        break;

      case DIRECTION.UP: // up
        this.move(0, -this.speed, deltaTime);
        break;

      case DIRECTION.RIGHT: // right
        this.move(this.speed, 0, deltaTime);
        break;

      case DIRECTION.DOWN: // down
        this.move(0, this.speed, deltaTime);
        break;
      default:
        break;
    }
  }
  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {

    if (this.game.debug) context.strokeRect(this.x, this.y, this.boxgame, this.boxgame);
    context.font = "bold 14px serif";
    context.fillText(this.name, this.x, this.y);
    if (this.makedelete == false) context.drawImage(this.image,
      this.imageWith * this.frameX + (this.frameX * this.spaceFrameX),
      this.imageHeight * this.frameY + (this.frameY * this.spaceFrameY),
      this.imageWith,
      this.imageHeight,
      this.x + 4,
      this.y - 5,
      this.imageWith + 4,
      this.imageHeight + 5);
    else {
      context.drawImage(this.imageGhost, 32 * this.frameX, 32 * this.frameY, 32, 32, this.x, this.y, this.boxgame, this.boxgame);
    }
  }


}