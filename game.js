import {
    CANVAS,
    CONTEXT,
    BRICK_HEIGHT,
    BRICK_WIDTH,
    BALL_RADIUS,
    BRICK_HORIZONTAL_PADDING,
    BRICK_VERTICAL_PADDING,
    BRICK_OFFSET_LEFT,
    BRICK_OFFSET_TOP,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
} from './constants.js';
import Ball from './ball.js';
import Brick from './brick.js';
import Paddle from './paddle.js';

class Game {
    constructor() {
        Game.setCanvasWidth();
        Game.setCanvasHeight();
        this.bricks = [];
        this.generateBricks();
        Game.showGameStartText();
        this.ball = new Ball(CANVAS.width / 2, (CANVAS.height / 5) * 4);
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

        const acc = this.paddle.x - this.paddle.oldX;
        this.paddle.acc = acc;
        this.paddle.oldX = this.paddle.x;

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
        // Having the same line width here as previously doesn't completely clear away the text.
        CONTEXT.lineWidth = 6;
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
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 5; j++) {
                const brickX = i * (BRICK_WIDTH + BRICK_HORIZONTAL_PADDING) + BRICK_OFFSET_LEFT;
                const brickY = j * (BRICK_HEIGHT + BRICK_VERTICAL_PADDING) + BRICK_OFFSET_TOP;
                this.bricks.push(new Brick(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT));
            }
        }
    }

    generatePaddle() {
        this.paddle = new Paddle(CANVAS.width / 2 - BRICK_WIDTH / 2, CANVAS.height - PADDLE_HEIGHT,
            PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    detectCollisions() {
        // BALL AND WALLS

        // Ball and top
        if (this.ball.y - BALL_RADIUS <= 0) {
            this.ball.dy *= -1;
        }

        // Ball and sides
        if (this.ball.x - BALL_RADIUS <= 0 || this.ball.x + BALL_RADIUS >= CANVAS.width) {
            this.ball.dx *= -1;
        }

        // BALL AND BRICKS

        const bricksToRemove = [];

        this.bricks.forEach((brick) => {
            if (this.ballIsCollidingWithBrick(brick)) {
                // top
                if (this.ball.x >= brick.x && this.ball.x <= brick.x + BRICK_WIDTH
                    && this.ball.y <= brick.y) {
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // top left
                } else if (this.ball.x <= brick.x && this.ball.y <= brick.y) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // top right
                } else if (this.ball.x >= brick.x + BRICK_WIDTH && this.ball.y <= brick.y) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // middle left
                } else if (this.ball.x <= brick.x
                    && this.ball.y >= brick.y && this.ball.y <= brick.y + BRICK_HEIGHT) {
                    this.ball.dx *= -1;
                    bricksToRemove.push(brick);
                    // middle right
                } else if (this.ball.x >= brick.x + BRICK_WIDTH
                    && this.ball.y >= brick.y && this.ball.y <= brick.y + BRICK_HEIGHT) {
                    this.ball.dx *= -1;
                    bricksToRemove.push(brick);
                    // bottom left
                } else if (this.ball.x < brick.x && this.ball.y > brick.y + BRICK_HEIGHT) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // bottom
                } else if (this.ball.x > brick.x && this.ball.x < brick.x + BRICK_WIDTH
                    && this.ball.y > brick.y + BRICK_HEIGHT) {
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // bottom right
                } else if (this.ball.x > brick.x + BRICK_WIDTH
                    && this.ball.y > brick.y + BRICK_HEIGHT) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                }
            }
        });

        bricksToRemove.forEach((brick) => {
            brick.clear();
            this.bricks = this.bricks.filter(elem => !elem.equals(brick));
        });

        // BALL AND PADDLE
        if (this.ballIsCollidingWithPaddle()) {
            // top
            if (this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x + PADDLE_WIDTH
                && this.ball.y <= this.paddle.y) {
                this.ball.dy *= -1;
                // top left
            } else if (this.ball.x <= this.paddle.x && this.ball.y <= this.paddle.y) {
                this.ball.dx *= -1;
                this.ball.dy *= -1;
                // top right
            } else if (this.ball.x >= this.paddle.x + PADDLE_WIDTH
                && this.ball.y <= this.paddle.y) {
                this.ball.dx *= -1;
                this.ball.dy *= -1;
                // middle left
            } else if (this.ball.x <= this.paddle.x
                && this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + PADDLE_HEIGHT) {
                if (Math.sign(this.ball.dx) === -1 && Math.sign(this.paddle.acc) === -1) {
                    this.ball.dx += this.paddle.acc;
                } else {
                    this.ball.dx *= -1;
                }
                // middle right
            } else if (this.ball.x >= this.paddle.x + PADDLE_WIDTH
                && this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + PADDLE_HEIGHT) {
                if (Math.sign(this.ball.dx) === 1 && Math.sign(this.paddle.acc) === 1) {
                    this.ball.dx += this.paddle.acc;
                } else {
                    this.ball.dx *= -1;
                }
            }
        }
    }

    detectGameOver() {
        return this.ball.y >= CANVAS.height;
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

    static clamp(val, min, max) {
        let clampedVal = val;
        if (val >= max) {
            clampedVal = max;
        } else if (val <= min) {
            clampedVal = min;
        }
        return clampedVal;
    }

    ballIsCollidingWithPaddle() {
        const nearestX = Game.clamp(this.ball.x, this.paddle.x, this.paddle.x + PADDLE_WIDTH);
        const nearestY = Game.clamp(this.ball.y, this.paddle.y, this.paddle.y + PADDLE_HEIGHT);

        const deltaX = this.ball.x - nearestX;
        const deltaY = this.ball.y - nearestY;

        if ((deltaX * deltaX + deltaY * deltaY) < (BALL_RADIUS * BALL_RADIUS)) {
            return true;
        }

        return false;
    }

    ballIsCollidingWithBrick(brick) {
        const nearestX = Game.clamp(this.ball.x, brick.x, brick.x + BRICK_WIDTH);
        const nearestY = Game.clamp(this.ball.y, brick.y, brick.y + BRICK_HEIGHT);

        const deltaX = this.ball.x - nearestX;
        const deltaY = this.ball.y - nearestY;

        if ((deltaX * deltaX + deltaY * deltaY) < (BALL_RADIUS * BALL_RADIUS)) {
            return true;
        }

        return false;
    }

    removeBrick(index) {
        this.bricks = this.bricks.splice(index, 1);
    }
}

new Game(); // eslint-disable-line no-new
