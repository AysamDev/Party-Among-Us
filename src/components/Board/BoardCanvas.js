import SpeechBubble from './SpeechBubble.js';
import Player from './Player.js';

export default class BoardCanvas {
    static DEFAULT_PLAYER_POS = { x: 350, y: 350 };

    constructor(canvas, context, theme) {
        this.IS_RUNNING = true;
        this.THEME = theme;
        this.CANVAS = canvas;
        this.CONTEXT = context;
        this.PLAYERS = [];
        this.drawingLoop = this.drawingLoop.bind(this);
    }

    newPlayer(playerProps, pos) {
        const player = new Player(playerProps, this.CONTEXT, this.getImg(playerProps.avatar+'.png'));
        player.targetPos = pos ? pos : BoardCanvas.DEFAULT_PLAYER_POS;
        this.PLAYERS.push(player);
    }

    changeTheme(theme) {
        this.THEME = theme;
    }

    stop() {
        this.IS_RUNNING = false;
    }

    async start() {
        const imagesArray = () => {
            const arr = [];
            for (let i = 1; i <= 14; i++)
                arr.push(`./img/theme${i}.jpg`);
            for (let i = 0; i < 10; i++)
                arr.push(`./img/spritePlayer${i}.png`);
            return arr;
        }

        const preloadImage = src =>
            new Promise(r => {
                const image = new Image();
                image.onload = r;
                image.onerror = r;
                image.src = src;
            }
            );

        await Promise.all(imagesArray().map(m => preloadImage(m)));

        //start loop
        this.drawingLoop();
    }

    getImg(img) {
        const image = new Image();
        image.src = `./img/${img}`;
        image.onload = () => { this.CONTEXT.drawImage(image, 0, 0); };
        return image;
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

    drawingLoop() {
        this.CONTEXT.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        this.CONTEXT.drawImage(this.getImg(this.THEME + '.jpg'), 0, 0);
        for (const player of this.PLAYERS) {
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