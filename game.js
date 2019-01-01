import Ball from './ball.js';

import { CANVAS, CONTEXT, BRICK_HEIGHT, BRICK_WIDTH, BALL_RADIUS } from './constants.js';

class Game {
    constructor() {
        Game.setCanvasWidth();
        Game.setCanvasHeight();
        Game.showGameStartText();
        this.ball = new Ball();
        const self = this;
        CANVAS.addEventListener('click', () => self.start());
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
        this.ball.dx = -5;
        this.ball.dy = -5;
        const self = this;
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

    detectCollisions() {
        //Ball and top
        if (this.ball.y - BALL_RADIUS <= 0) {
            this.ball.dy *= -1;
        }

        //Ball and sides
        if (this.ball.x - BALL_RADIUS <= 0 || this.ball.x + BALL_RADIUS >= CANVAS.width) {
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

    end() {
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
}

new Game(); // eslint-disable-line no-new