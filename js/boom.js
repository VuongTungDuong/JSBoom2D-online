import { WoodBox, Stone } from './items.js';

export class Boom {
  /**
   * @param {import('./game.js').Game} game
   * @param {import ('./player.js').Player} player
   */
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.boxgame = this.game.boxgame;

    if (this.player.direction == null) {
      this.x = this.player.x;
      this.y = this.player.y;
    } else {
      // tinh toan vi tri dat qua boom
      this.x = this.player.xBackup;
      this.y = this.player.yBackup;

    }
    // img
    this.image = document.getElementById('boom');
    this.imageWidth = 60;
    this.imageHeight = 60;
    // frame and timn
    this.frameX = 0;
    this.frameY = 0;
    this.maxTimeFrame = 400;
    this.timeInterval = 0;
    // time no
    this.maxTimeBoom = 3000;
    this.timeBoom = 0;
    //leng boom
    this.lengBoom = this.player.lengBoom;
    // danh dau da no
    this.makedelete = false;
  }

  update(deltaTime) {
    if (this.timeInterval > this.maxTimeFrame) {
      this.timeInterval = 0;
      this.frameX = (this.frameX + 1) % 2;
      this.imageWidth = 60 + this.frameX * 5;
      this.imageHeight = 60 + this.frameX * 5;
    } else this.timeInterval += deltaTime;

    if (!this.makedelete && this.timeBoom >= this.maxTimeBoom) {
      this.makedelete = true;
      this.game.explodes.push(new Explode(this.game, this));
      this.game.map[this.x / this.boxgame][this.y / this.boxgame] = null;
      if (this.player.useBoom < this.player.limitBoom)
        this.player.useBoom++;

    } else this.timeBoom += deltaTime;
  }



  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    if (this.game.debug) context.strokeRect(this.x, this.y, this.boxgame, this.boxgame);

    if (!this.makedelete) context.drawImage(this.image,
      0, 0,
      this.imageWidth, this.imageHeight,
      this.x + 2, this.y + 2, this.boxgame, this.boxgame);


  }
}

export class Explode {
  /**
   *
   * @param {import('./game.js').Game} game
   * @param {Boom} boom

   */
  constructor(game, boom) {
    this.game = game;
    this.x = boom.x;
    this.y = boom.y;
    this.boxgame = boom.boxgame;
    this.lengBoom = boom.lengBoom;

    // 4 huong no cua qua boom
    this.direction = {
      UP: 0,
      DOWN: 0,
      LEFT: 0,
      RIGHT: 0,
    };

    // img
    // this.imageVertaical = document.getElementById('explode_vertical');  // chieu doc
    this.imageHorizotal = document.getElementById('explode_horizontal'); // chieu nga

    this.imageLeft = document.getElementById('explode_left');
    this.imageUp = document.getElementById('explode_up');
    this.imageWidth = 49;
    this.imageHeight = 49;
    this.frameX = 1;

    // time biet mat
    this.timeExplode = 0;
    this.maxTimeExplode = 500;
    // make delete
    this.makedelete = false;
    // is check one explode
    this.isCheckOneExplode = true;

    this.arrayExplode = [];
  }

  updateDirectionExplode() {

    let w = [-1, 1, 0, 0],
      h = [0, 0, -1, 1],
      checkDirection = [true, true, true, true],
      direction = [0, 0, 0, 0];

    this.checkExplodePlayer(this.x / this.boxgame, this.y / this.boxgame);

    for (let i = 1; i <= this.lengBoom; i++) {
      // duyet 4 huong
      for (let k = 0; k < 4; k++) {
        if (checkDirection[k]) {
          let x = this.x / this.boxgame + (i * w[k]);
          let y = this.y / this.boxgame + (i * h[k]);
          if (x >= 0 && x < this.game.maxMapX && y >= 0 && y < this.game.maxMapY) {
            let valmap = this.game.map[x][y];

            // check voi cac player
            this.checkExplodePlayer(x, y);

            if (valmap instanceof WoodBox) {
              this.game.map[x][y].makedelete = true;
              checkDirection[k] = false;
              direction[k] = i;
            } else if (valmap instanceof Stone) {
              checkDirection[k] = false;
              direction[k] = i - 1;
            } else direction[k] = i;
            if (valmap instanceof Boom) {
              direction[k] = i;
              valmap.makedelete = true;

              if (valmap.player.useBoom < valmap.player.limitBoom)
                valmap.player.useBoom++;

              // this.game.explodes.push(new Explode(this.game, valmap));
              let explode = new Explode(this.game, valmap);
              this.arrayExplode.push(explode);
              this.game.map[x][y] = null;
              explode.update();

            }
          }
        }
      }
    }

    this.direction.LEFT = direction[0];
    this.direction.RIGHT = direction[1];
    this.direction.UP = direction[2];
    this.direction.DOWN = direction[3];

  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  checkExplodePlayer(x, y) {
    // return false;
    for (const key in this.game.players) {
      if (Object.hasOwnProperty.call(this.game.players, key)) {
        let player = this.game.players[key];
        if ((player.xNew / this.boxgame == x && player.yNew / this.boxgame == y) ||
          (player.xBackup / this.boxgame == x && player.yBackup / this.boxgame == y))
          player.makedelete = true;
      }
    }


    let player = this.game.player;
    if ((player.xNew / this.boxgame == x && player.yNew / this.boxgame == y) ||
      (player.xBackup / this.boxgame == x && player.yBackup / this.boxgame == y))
      player.makedelete = true;
  }

  /**
   *
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // ve hieu ung
    if (this.timeExplode > this.maxTimeExplode) {
      this.makedelete = true;
    } else
      this.timeExplode += deltaTime;

    // check cac huong xem co qua boom nao trong pham vi hay tuong da hay khong
    if (this.isCheckOneExplode) {
      this.updateDirectionExplode();
      this.isCheckOneExplode = false;
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {

    context.drawImage(this.imageLeft,
      this.x - this.direction.LEFT * this.boxgame, this.y,
      this.boxgame * (this.direction.LEFT + this.direction.RIGHT) + this.boxgame, this.boxgame,
    );

    context.drawImage(this.imageUp,
      this.x, this.y - this.direction.UP * this.boxgame,
      this.boxgame, this.boxgame * (this.direction.UP + this.direction.DOWN) + this.boxgame
    );

    context.drawImage(this.imageHorizotal,
      this.imageWidth * this.frameX, 0,
      this.imageWidth, this.imageHeight,
      this.x, this.y,
      this.boxgame, this.boxgame
    );
    this.arrayExplode.forEach(e => e.draw(context));

  }
}