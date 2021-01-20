import Sprite from './Sprite.js';

export default class Player extends Sprite {
    static ANIMATION_TYPE = {IDLE: 0, WALK: 1, DANCE: 4};
    static DIRECTION = {RIGHT: 0, LEFT: 2};

    constructor(x, y, context, image) {
        super({
            x: x,
            y: y,
            context: context,
            image: image,
        });

        this.width = 85;
        this.height = 85;
        this.dir = Player.DIRECTION.RIGHT;
        this.message = null;
        this.timerMessage = 500;
        this.frameIndex = 0;
        this.row = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 12;
        this.frames = 1;
    }

    sendMessage (message) {
        if (message) {
            if (message === '/dance') {
                message = null;
                this.movePlayer(null);
            }
            else {
                this.message = message;
                this.timerMessage = 500;
            }
        }
    }

    movePlayer(targetX, targetY) {
        if (targetX === null) {
            if (this.getAnimationType() !== Player.ANIMATION_TYPE.DANCE) {
                this.animateDance();
            }

            return;
        }

        if (this.getAnimationType() === Player.ANIMATION_TYPE.DANCE && targetX === this.x)
            return;

        if (this.x > targetX) {
            if (this.dir !== Player.DIRECTION.LEFT) {
                if (this.getAnimationType() !== (Player.ANIMATION_TYPE.WALK + Player.DIRECTION.LEFT)) {
                    this.dir = Player.DIRECTION.LEFT;
                    this.animateWalk();
                }
            }
            else if (this.getAnimationType() === (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.RIGHT) || this.getAnimationType() === (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.LEFT))
                this.animateWalk();

            this.x--;
        }
        else if (this.x < targetX) {
            if (this.dir !== Player.DIRECTION.RIGHT) {
                if (this.getAnimationType() !== (Player.ANIMATION_TYPE.WALK + Player.DIRECTION.RIGHT)) {
                    this.dir = Player.DIRECTION.RIGHT;
                    this.animateWalk();
                }
            }
            else if (this.getAnimationType() === (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.RIGHT) || this.getAnimationType() === (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.LEFT))
                this.animateWalk();

            this.x++;
        }
        else if (this.x === targetX && this.y === targetY) {
            if (this.getAnimationType() !== (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.RIGHT) && this.getAnimationType() !== (Player.ANIMATION_TYPE.IDLE + Player.DIRECTION.LEFT))
                this.animateIdle();
        }

        if (this.y > targetY)
            this.y--;
        else if (this.y < targetY)
            this.y++;
    }

    animateWalk() {
        this.frames = 12;
        this.frameIndex = 0;
        this.row = 1 + this.dir;
        this.ticksPerFrame = 12;
    }

    animateDance() {
        this.frames = 25;
        this.frameIndex = 0;
        this.row = 4;
        this.ticksPerFrame = 12;
    }

    animateIdle() {
        this.frames = 1;
        this.frameIndex = 0;
        this.row = 0 + this.dir;
        this.ticksPerFrame = 12;
    }

    getAnimationType() {
        return this.row;
    }
}
