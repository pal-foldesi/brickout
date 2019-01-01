import Ball from './ball.js';

import { CANVAS, CONTEXT, BRICK_HEIGHT, BRICK_WIDTH, BALL_RADIUS, PADDLE_HEIGHT, PADDLE_WIDTH } from './constants.js';
import Brick from './brick.js';
import Paddle from './paddle.js';

class Game {
    constructor() {
        Game.setCanvasWidth();
        Game.setCanvasHeight();
        this.bricks = [];
        this.generateBricks();
        Game.showGameStartText();
        this.ball = new Ball();
        const self = this;
        this.mouseMoved = ((event) => {
            this.handleMouseMove(event);
        });
        this.mouseMovedHandler = this.mouseMoved.bind(this);
        CANVAS.addEventListener('click', () => self.start());
        this.generatePaddle();
    }

    static setCanvasWidth() {
        const desiredWidth = 8 * BRICK_WIDTH;

        if (desiredWidth < window.screen.availWidth) {
            CANVAS.width = desiredWidth;
        }
    }

    static setCanvasHeight() {
        let desiredHeight = window.screen.availHeight;

        if (desiredHeight % 100 !== 0) {
            desiredHeight -= desiredHeight % 100;
        }

        desiredHeight -= 100; // To leave room for browser/OS UI toolbars

        if (desiredHeight > 20 * BRICK_HEIGHT) {
            desiredHeight = 20 * BRICK_HEIGHT;
        }

        CANVAS.height = desiredHeight;
    }

    tick() {
        if (this.detectGameOver()) {
            this.over();
            return;
        }

        if (this.bricks.length === 0) {
            this.end();
            return;
        }

        this.ball.clear();
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        this.detectCollisions();
        this.ball.draw();

        const self = this;
        window.requestAnimationFrame(() => self.tick());
    }

    start() {
        Game.hideGameStartText();
        document.body.style.cursor = 'none'; 
        this.bricks.forEach(brick => brick.draw());
        const self = this;
        CANVAS.addEventListener('mousemove', this.mouseMovedHandler);
        this.ball.dx = -5;
        this.ball.dy = -5;
        window.requestAnimationFrame(() => self.tick());
    }

    static hideGameStartText() {
        CONTEXT.fillStyle = 'white';
        CONTEXT.font = 'bold 144px serif';
        CONTEXT.lineWidth = 6; //Having the same line width here as previously doesn't completely clear away the text.
        CONTEXT.strokeStyle = 'white';
        CONTEXT.textAlign = 'center';
        CONTEXT.fillText('Click inside the', CANVAS.width / 2, CANVAS.height / 2 - 140);
        CONTEXT.strokeText('Click inside the', CANVAS.width / 2, CANVAS.height / 2 - 140);
        CONTEXT.fillText('game area to', CANVAS.width / 2, CANVAS.height / 2);
        CONTEXT.strokeText('game area to', CANVAS.width / 2, CANVAS.height / 2);
        CONTEXT.fillText('start the game!', CANVAS.width / 2, CANVAS.height / 2 + 140);
        CONTEXT.strokeText('start the game!', CANVAS.width / 2, CANVAS.height / 2 + 140);
    }

    static showGameStartText() {
        CONTEXT.fillStyle = 'khaki';
        CONTEXT.font = 'bold 144px serif';
        CONTEXT.lineWidth = 5;
        CONTEXT.strokeStyle = 'tomato';
        CONTEXT.textAlign = 'center';
        CONTEXT.fillText('Click inside the', CANVAS.width / 2, CANVAS.height / 2 - 140);
        CONTEXT.strokeText('Click inside the', CANVAS.width / 2, CANVAS.height / 2 - 140);
        CONTEXT.fillText('game area to', CANVAS.width / 2, CANVAS.height / 2);
        CONTEXT.strokeText('game area to', CANVAS.width / 2, CANVAS.height / 2);
        CONTEXT.fillText('start the game!', CANVAS.width / 2, CANVAS.height / 2 + 140);
        CONTEXT.strokeText('start the game!', CANVAS.width / 2, CANVAS.height / 2 + 140);
    }

    generateBricks() {
        for (let i = 0; i < CANVAS.width; i+= BRICK_WIDTH) {
            for (let j = 0; j < CANVAS.height / 2; j+= BRICK_HEIGHT) {
                this.bricks.push(new Brick(i, j));
            }
        }
    }

    generatePaddle() {
        this.paddle = new Paddle(CANVAS.width / 2 - BRICK_WIDTH/2, CANVAS.height - PADDLE_HEIGHT);
    }

    detectCollisions() {

        //Note: Rudimentary collision detection only, will need to be improved later.

        //Ball and top
        if (this.ball.y - BALL_RADIUS <= 0) {
            this.ball.dy *= -1;
        }

        //Ball and sides
        if (this.ball.x - BALL_RADIUS <= 0 || this.ball.x + BALL_RADIUS >= CANVAS.width) {
            this.ball.dx *= -1;
        }

        const bricksToRemove = [];

        //Ball and bricks
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];

            //Ball and bottom of brick
            if (this.ball.x + BALL_RADIUS >= brick.x && this.ball.x + BALL_RADIUS <= brick.x + BRICK_WIDTH &&
                this.ball.y - BALL_RADIUS === brick.y + BRICK_HEIGHT) {
                bricksToRemove.push(i);
                this.ball.dy *= -1;
            }

            //Ball and top of brick
            if (this.ball.x + BALL_RADIUS >= brick.x && this.ball.x + BALL_RADIUS <= brick.x + BRICK_WIDTH &&
                this.ball.y + BALL_RADIUS === brick.y) {
                bricksToRemove.push(i);
                this.ball.dy *= -1;
            }

            //Ball and left of brick
            if (this.ball.x + BALL_RADIUS === brick.x &&
                this.ball.y >= brick.y && this.ball.y <= brick.y + BRICK_HEIGHT) {
                bricksToRemove.push(i);
                this.ball.dx *= -1;
            }

            //Ball and right of brick
            if (this.ball.x + BALL_RADIUS === brick.x + BRICK_WIDTH &&
                this.ball.y >= brick.y && this.ball.y <= brick.y + BRICK_HEIGHT) {
                bricksToRemove.push(i);
                this.ball.dx *= -1;
            }
        }

        //Remove colliding bricks
        for (let index of bricksToRemove) {
            this.bricks[index].clear();
            this.bricks.splice(index, 1);
        }

        //Ball and paddle
        //Ball and bottom of paddle
        if (this.ball.x + BALL_RADIUS >= this.paddle.x && this.ball.x + BALL_RADIUS <= this.paddle.x + PADDLE_WIDTH &&
            this.ball.y - BALL_RADIUS === this.paddle.y + PADDLE_HEIGHT) {
            this.ball.dy *= -1;
        }

        //Ball and top of paddle
        if (this.ball.x + BALL_RADIUS >= this.paddle.x && this.ball.x + BALL_RADIUS <= this.paddle.x + PADDLE_WIDTH &&
            this.ball.y + BALL_RADIUS >= this.paddle.y) {
            this.ball.dy *= -1;
        }

        //Ball and left of paddle
        if (this.ball.x + BALL_RADIUS === this.paddle.x &&
            this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + PADDLE_HEIGHT) {
            this.ball.dx *= -1;
        }

        //Ball and right of paddle
        if (this.ball.x + BALL_RADIUS === this.paddle.x + PADDLE_WIDTH &&
            this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + PADDLE_HEIGHT) {
            this.ball.dx *= -1;
        }
    }

    detectGameOver() {
        //Ball and bottom
        if (this.ball.y >= CANVAS.height) {
            this.end();
            return true;
        }
        return false;
    }

    over() {
        document.body.style.cursor = 'default'; 
        CANVAS.removeEventListener('mousemove', this.mouseMovedHandler);
        CONTEXT.fillStyle = 'khaki';
        CONTEXT.font = 'bold 144px serif';
        CONTEXT.lineWidth = 5;
        CONTEXT.strokeStyle = 'tomato';
        CONTEXT.textAlign = 'center';
        CONTEXT.fillText('Game', CANVAS.width / 2, CANVAS.height / 2 - 80);
        CONTEXT.strokeText('Game', CANVAS.width / 2, CANVAS.height / 2 - 80);
        CONTEXT.fillText('over!', CANVAS.width / 2, CANVAS.height / 2 + 80);
        CONTEXT.strokeText('over!', CANVAS.width / 2, CANVAS.height / 2 + 80);
    }

    end() {
        document.body.style.cursor = 'default'; 
        CANVAS.removeEventListener('mousemove', this.mouseMovedHandler);
        CONTEXT.fillStyle = 'khaki';
        CONTEXT.font = 'bold 144px serif';
        CONTEXT.lineWidth = 5;
        CONTEXT.strokeStyle = 'tomato';
        CONTEXT.textAlign = 'center';
        CONTEXT.fillText('Well', CANVAS.width / 2, CANVAS.height / 2 - 80);
        CONTEXT.strokeText('Well', CANVAS.width / 2, CANVAS.height / 2 - 80);
        CONTEXT.fillText('done!', CANVAS.width / 2, CANVAS.height / 2 + 80);
        CONTEXT.strokeText('done!', CANVAS.width / 2, CANVAS.height / 2 + 80);
    }

    handleMouseMove(event) {
        //console.log(`clientX: ${event.clientX}, screenX: ${event.screenX}, windowX: ${window.screenX}`);
        this.paddle.clear();
        const offset = window.screen.availWidth - CANVAS.width;
        let moveTo = event.clientX - offset;
        if (moveTo < 0) {
            moveTo = 0;
        } else if (moveTo > CANVAS.width - PADDLE_WIDTH) {
            moveTo = CANVAS.width - PADDLE_WIDTH;
        }
        this.paddle.x = moveTo;
        this.paddle.draw();
    }
}

new Game(); // eslint-disable-line no-new