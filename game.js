import {
    CANVAS,
    CONTEXT,
} from './constants.js';
import Ball from './ball.js';
import Brick from './brick.js';
import Paddle from './paddle.js';

class Game {
    constructor() {
        Game.setCanvasWidth();
        Game.setCanvasHeight();
        this.setUiElementSizes();
        this.bricks = [];
        this.generateBricks();
        Game.showGameStartText();
        this.ball = new Ball(CANVAS.width / 2, (CANVAS.height / 5) * 4, this.ballRadius);
        const self = this;
        this.mouseMoved = ((event) => {
            this.handleMouseMove(event);
        });
        this.mouseMovedHandler = this.mouseMoved.bind(this);
        CANVAS.addEventListener('click', () => self.start());
        this.generatePaddle();
    }

    static setCanvasWidth() {
        // Chromium needs some extra room...
        CANVAS.width = window.innerWidth - 40;
    }

    static setCanvasHeight() {
        // Chromium needs some extra room...
        CANVAS.height = window.innerHeight - 20;
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
        this.ball.dx = -Math.round((CANVAS.width / 320));
        this.ball.dy = -Math.round((CANVAS.width / 320));
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
        const numberOfColumns = Math.round(CANVAS.width / this.brickWidth) - 1;
        const numberOfRows = Math.round(Math.round(CANVAS.height / this.brickHeight) * 2 / 3) - 1;
        for (let i = 0; i < numberOfColumns; i += 1) {
            for (let j = 0; j < numberOfRows; j += 1) {
                const brickX = i * (this.brickWidth + this.brickHorizontalPadding)
                + this.brickOffsetLeft;
                const brickY = j * (this.brickHeight + this.brickVerticalPadding)
                + this.brickOffsetTop;
                this.bricks.push(new Brick(brickX, brickY, this.brickWidth, this.brickHeight));
            }
        }
    }

    generatePaddle() {
        this.paddle = new Paddle(CANVAS.width / 2 - this.paddleWidth / 2,
            CANVAS.height - this.paddleHeight,
            this.paddleWidth, this.paddleHeight);
    }

    detectCollisions() {
        // BALL AND WALLS

        // Ball and top
        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.dy *= -1;
        }

        // Ball and sides
        if (this.ball.x - this.ball.radius <= 0 || this.ball.x + this.ball.radius >= CANVAS.width) {
            this.ball.dx *= -1;
        }

        // BALL AND BRICKS

        const bricksToRemove = [];

        this.bricks.forEach((brick) => {
            if (this.ballIsCollidingWithBrick(brick)) {
                // top
                if (this.ball.x >= brick.x && this.ball.x <= brick.x + brick.width
                    && this.ball.y <= brick.y) {
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // top left
                } else if (this.ball.x <= brick.x && this.ball.y <= brick.y) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // top right
                } else if (this.ball.x >= brick.x + brick.width && this.ball.y <= brick.y) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // middle left
                } else if (this.ball.x <= brick.x
                    && this.ball.y >= brick.y && this.ball.y <= brick.y + brick.height) {
                    this.ball.dx *= -1;
                    bricksToRemove.push(brick);
                    // middle right
                } else if (this.ball.x >= brick.x + brick.width
                    && this.ball.y >= brick.y && this.ball.y <= brick.y + brick.height) {
                    this.ball.dx *= -1;
                    bricksToRemove.push(brick);
                    // bottom left
                } else if (this.ball.x < brick.x && this.ball.y > brick.y + brick.height) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // bottom
                } else if (this.ball.x > brick.x && this.ball.x < brick.x + brick.width
                    && this.ball.y > brick.y + brick.height) {
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                    // bottom right
                } else if (this.ball.x > brick.x + brick.width
                    && this.ball.y > brick.y + brick.height) {
                    this.ball.dx *= -1;
                    this.ball.dy *= -1;
                    bricksToRemove.push(brick);
                }
            }
        });

        bricksToRemove.forEach(brick => this.removeBrick(brick));

        // BALL AND PADDLE
        if (this.ballIsCollidingWithPaddle()) {
            // top
            if (this.ball.x >= this.paddle.x && this.ball.x <= this.paddle.x + this.paddle.width
                && this.ball.y <= this.paddle.y) {
                this.ball.dy *= -1;
                // top left
            } else if (this.ball.x <= this.paddle.x && this.ball.y <= this.paddle.y) {
                this.ball.dx *= -1;
                this.ball.dy *= -1;
                // top right
            } else if (this.ball.x >= this.paddle.x + this.paddle.width
                && this.ball.y <= this.paddle.y) {
                this.ball.dx *= -1;
                this.ball.dy *= -1;
                // middle left
            } else if (this.ball.x <= this.paddle.x
                && this.ball.y >= this.paddle.y && this.ball.y
                <= this.paddle.y + this.paddle.height) {
                if (Math.sign(this.ball.dx) === -1 && Math.sign(this.paddle.acc) === -1) {
                    this.ball.dx += this.paddle.acc;
                } else {
                    this.ball.dx *= -1;
                }
                // middle right
            } else if (this.ball.x >= this.paddle.x + this.paddle.width
                && this.ball.y >= this.paddle.y && this.ball.y
                <= this.paddle.y + this.paddle.height) {
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
        const offset = window.innerWidth - CANVAS.width;
        this.paddle.x = Game.clamp(event.clientX - offset, 0, CANVAS.width - this.paddle.width);
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

    setUiElementSizes() {
        this.ballRadius = CANVAS.width / 80;
        this.brickWidth = CANVAS.width / 8;
        // Needed to round here to get rid of artefacts when clearing
        this.brickHeight = Math.round(CANVAS.width / 16);
        this.brickHorizontalPadding = Math.round(CANVAS.width / 200 * 3);
        this.brickOffsetLeft = Math.round(CANVAS.width / 160 * 3);
        this.brickVerticalPadding = Math.round(CANVAS.height / 50);
        this.brickOffsetTop = Math.round(CANVAS.height / 100 * 3);
        this.paddleWidth = Math.round(CANVAS.width / 7);
        this.paddleHeight = Math.round(CANVAS.height / 24);
    }

    ballIsCollidingWithPaddle() {
        const nearestX = Game.clamp(this.ball.x, this.paddle.x, this.paddle.x + this.paddle.width);
        const nearestY = Game.clamp(this.ball.y, this.paddle.y, this.paddle.y + this.paddle.height);

        const deltaX = this.ball.x - nearestX;
        const deltaY = this.ball.y - nearestY;

        if ((deltaX * deltaX + deltaY * deltaY) < (this.ball.radius * this.ball.radius)) {
            return true;
        }

        return false;
    }

    ballIsCollidingWithBrick(brick) {
        const nearestX = Game.clamp(this.ball.x, brick.x, brick.x + brick.width);
        const nearestY = Game.clamp(this.ball.y, brick.y, brick.y + brick.height);

        const deltaX = this.ball.x - nearestX;
        const deltaY = this.ball.y - nearestY;

        if ((deltaX * deltaX + deltaY * deltaY) < (this.ball.radius * this.ball.radius)) {
            return true;
        }

        return false;
    }

    removeBrick(brick) {
        brick.clear();
        this.bricks = this.bricks.filter(elem => !elem.equals(brick));
    }
}

new Game(); // eslint-disable-line no-new
