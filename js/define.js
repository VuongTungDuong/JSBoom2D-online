export const STONE = 'STONE';
export const BOOM = 'BOOM';
export const WOODBOX = 'WOODBOX';
export const OBJECT = 'object';
export const PLAYER = 'PLAYER';
export const DIRECTION = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  PUTBOOM: " ",
};

const send = 'client_', listener = 'server_';


export const SEND_SOCKET = {
  MAP: send + "map",
  INFO: send + "info_player",
  MOVE: send + "player_move",
  PUTBOOM: send + "player_putboom",
};

export const LISTENER_SOCKET = {
  MAP: listener + "map",
  GETINFO: listener + 'get_player',
  ADDPLAYER: listener + 'add_player',
  UPDATEPLAYER: listener + 'update_player',
};