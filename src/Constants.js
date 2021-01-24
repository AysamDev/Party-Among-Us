module.exports = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  SYNC_TIME: 'SYNC_TIME',
  NEW_VIDEO: 'NEW_VIDEO',
  ASK_FOR_VIDEO_URL: 'ASK_FOR_VIDEO_URL',
  SYNC_VIDEO_INFORMATION: 'SYNC_VIDEO_INFORMATION',
  ASK_FOR_VIDEO_INFORMATION: 'ASK_FOR_VIDEO_INFORMATION',
  JOIN_ROOM: 'JOIN_ROOM',
  PLAYER_MOVED: 'PLAYER_MOVED',
  ADD_PLAYER: 'ADD_PLAYER',
  SEND_MESSAGE: 'SEND_MESSAGE',
  MOVE_PLAYER: 'MOVE_PLAYER',
  RECEIVED_MESSAGE: 'RECEIVED_MESSAGE',
  LEAVE_ROOM: 'LEAVE_ROOM',
  API_PATH: '/api',
  SUGGEST_SONG: 'SUGGEST_SONG',
  NEW_SONG: 'NEW_SONG',
  VOTE_SONG: 'VOTE_SONG',
  REMOVE_PLAYER: 'REMOVE_PLAYER',
  NEW_PLAYER_HOST: 'NEW_PLAYER_HOST',
  SERVER_PATH: process.env.SERVER_URI ? `${process.env.SERVER_URI}:${process.env.PORT}` : 'http://localhost:4200',
  CHANGE_THEME: 'CHANGE_THEME',
  DEFAULT_PLAYER_POS: { x: 815, y: 487}
}