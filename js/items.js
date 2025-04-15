
/**
 *
 * @param {import('./main.js').Game} game
 * @param {number} x
 * @param {number} y
 * @returns
 */
export function randomItem(game, x, y) {
  let rd = Math.random();
  if (0.1 >= rd) return new Shoes(game, x, y);
  else if (0.2 >= rd) return new Potion(game, x, y);
  else if (0.3 >= rd) return new AddBoom(game, x, y);
  else return null;
}

export class Stone {
  /**
   *
   * @param {import('./main.js')Game} game
   * @param {number} x
   * @param {number} y
   */
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.stoneImage = document.getElementById('stone');
    this.makedelete = false;
  }
  update() {

  }
  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.drawImage(this.stoneImage, this.x * this.game.boxgame, this.y * this.game.boxgame, this.game.boxgame, this.game.boxgame);
  }
}

export class WoodBox {
  /**
   *
   * @param {import('./main.js').Game} game
   * @param {number} x
   * @param {number} y
   */
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.woodboxImage = document.getElementById("woodbox");
    this.makedelete = false;
    // this.item = randomItem(game, x, y);
    this.item = null;
  }
  update() {

  }


  addItem() {
    this.game.map[this.x][this.y] = this.item;
  }
  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.drawImage(this.woodboxImage, this.x * this.game.boxgame, this.y * this.game.boxgame, this.game.boxgame, this.game.boxgame);
    if (this.game.debug && this.item != null)
      context.drawImage(this.item.image, this.x * this.game.boxgame, this.y * this.game.boxgame, this.game.boxgame, this.game.boxgame);

  }
}


export class Item {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.image = null;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.drawImage(this.image, this.x * this.game.boxgame, this.y * this.game.boxgame, this.game.boxgame, this.game.boxgame);
  }
}


export class Shoes extends Item {
  constructor(game, x, y) {
    super(game, x, y);
    this.image = document.getElementById('shoes');
  }
}

export class Potion extends Item {
  constructor(game, x, y) {
    super(game, x, y);
    this.image = document.getElementById('potion');
  }
}

export class AddBoom extends Item {
  constructor(game, x, y) {
    super(game, x, y);
    this.image = document.getElementById('extraboom');
  }
}