
import { SEND_SOCKET, LISTENER_SOCKET } from "./define.js";
import { Player } from "./player.js";



export class WebSockets {
  /**
   *
   * @param {import('./game.js').Game} game
   * @param {HTMLCanvasElement} canvas
   */
  constructor(game, canvas) {
    this.game = game;

    this.canvas = canvas;
    this.ws = new WebSocket('ws://107.98.25.88:8013/feed');

    this.ws.addEventListener('open', e => {
      // get map hien tai ve
      // tren server co map hien tai roi thi lay ve con khong co server se khoi tao lai tu dau
      this.getMapSever();

    });

    this.ws.addEventListener('error', e => {
      console.log("connect socket fail");
    });

    this.ws.addEventListener('message', e => {
      const obj = JSON.parse(e.data);
      this.listener_server(obj);
    });

  }

  listener_server(obj) {
    // console.log(obj);
    switch (obj['cmd']) {
      case LISTENER_SOCKET.MAP:
        // tao map
        this.updateMap(obj);
        // send lai server info player
        this.sendInfoPlayer();
        break;


      case LISTENER_SOCKET.ADDPLAYER:
        this.addPlayers(obj);
        break;
      case LISTENER_SOCKET.UPDATEPLAYER:
        this.updatePlayers(obj);
        break;

      default:
        break;
    }
  }

  getMapSever() {
    let cmd = { cmd: SEND_SOCKET.MAP };
    this.ws.send(JSON.stringify(cmd));
  }

  updateMap(obj) {
    this.canvas.width = obj['mx'] * 50;
    this.canvas.height = obj['my'] * 50;
    this.game.init(obj['mx'], obj['my'], obj['map']);
  }

  sendInfoPlayer() {

    let data = {
      cmd: SEND_SOCKET.INFO,
      player: this.game.player.getInfo(),
    };
    this.ws.send(JSON.stringify(data));
  }


  sendMove() {
    let data = {
      'cmd': SEND_SOCKET.MOVE,
      'player': this.game.player.getInfo(),
    };
    this.ws.send(JSON.stringify(data));

  }

  sendPutBoom() {
    let data = {
      'cmd': SEND_SOCKET.PUTBOOM,
      'player': this.game.player.getInfo(),
    };
    this.ws.send(JSON.stringify(data));
  }


  addPlayers(obj) {
    let players = obj['players'];
    this.game.players = {};

    for (const key in players) {
      if (Object.hasOwnProperty.call(players, key)) {
        const player = players[key];
        if (player['name'] !== this.game.player.name) {
          this.game.players[player['name']] = new Player(this.game, player.x, player.y, document.getElementById('player_1'), player.name);
        }
      }
    }
  }

  updatePlayers(obj) {
    // console.log(obj);
    let players = obj['players'];

    for (const key in players) {
      if (Object.hasOwnProperty.call(players, key)) {

        if (key != this.game.player.name) {
          this.game.players[key].playerDirection = players[key].playerDirection;
          this.game.players[key].x = players[key].x;
          this.game.players[key].y = players[key].y;

          this.game.players[key].xNew = players[key].xNew;
          this.game.players[key].yNew = players[key].yNew;

          this.game.players[key].xBackup = players[key].xBackup;
          this.game.players[key].yBackup = players[key].yBackup;


          this.game.players[key].speed = players[key].speed;
          this.game.players[key].lengBoom = players[key].lengBoom;
          this.game.players[key].useBoom = players[key].useBoom;

          this.game.players[key].isRunBlock = players[key].isRunBlock;
          this.game.players[key].direction = players[key].direction;

          if (players[key].putBoom) {
            this.game.players[key].putBoom();
          }
        }
      }
    }
  }
}