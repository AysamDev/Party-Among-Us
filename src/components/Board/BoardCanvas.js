import SpeechBubble from './SpeechBubble.js';
import Player from './Player.js';

export default class BoardCanvas {
    static DEFAULT_PLAYER_POS = { x: 815, y: 487};

    constructor(canvas, context, theme) {
        this.IS_RUNNING = false;
        this.THEME = parseInt(theme);
        this.CANVAS = canvas;
        this.CONTEXT = context;
        this.CONTEXT.textBaseline = "hanging";
        this.PLAYERS = [];
        this.IMGS = [];
        this.drawingLoop = this.drawingLoop.bind(this);
        this.loadImages();
    }

    loadImages() {
        for (let i = 0; i < 10; i++) {
            const img = new Image();
            img.src = `./img/spritePlayer${i}.png`;
            this.IMGS.push(img);
        }

        for (let i = 10; i < 24; i++) {
            const img = new Image();
            img.src = `./img/theme${i-10}.jpg`;
            this.IMGS.push(img);
        }
    }

    newPlayer(playerProps) {
        const player = new Player(playerProps, this.CONTEXT, this.IMGS[playerProps.avatar]);
        player.targetPos = BoardCanvas.DEFAULT_PLAYER_POS;
        this.PLAYERS.push(player);
    }

    changeTheme(theme) {
        this.THEME = parseInt(theme);
    }

    stop() {
        this.IS_RUNNING = false;
    }

    start() {
        this.IS_RUNNING = true;
        this.drawingLoop();
    }

    drawBubbleChat(player) {
        if (player.message) {
            this.speechBubble = new SpeechBubble(this.CONTEXT, player.y - 34, player.x - 56);
            this.speechBubble.setTargetPos(player.x, player.y);
            this.speechBubble.text = player.message;
            this.speechBubble.draw();
            player.timerMessage--;

            if (player.timerMessage === 0) {
                player.timerMessage = 500;
                player.message = null;
            }
        }
    }

    validateNMovePlayer(player) {
        player.movePlayer(player.targetPos.x, player.targetPos.y);
    }

    showPlayerName(player) {
        this.CONTEXT.font = "bold 17px monospace";
        this.CONTEXT.fillStyle = "rgba(51, 51, 255, 0.9)";
        this.CONTEXT.textAlign = "center";
        this.CONTEXT.fillText(player.userName, player.x + 25, player.y + 90);
    }

    drawingLoop() {
        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        this.CONTEXT.drawImage(this.IMGS[this.THEME + 10], 0, 0);
        for (const player of this.PLAYERS) {
            this.showPlayerName(player);
            this.validateNMovePlayer(player);
            this.drawBubbleChat(player);
            player.render();
            player.update();
        }

        if (this.IS_RUNNING) {
            requestAnimationFrame(this.drawingLoop);
        }
    }
}