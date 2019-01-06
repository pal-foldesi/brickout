import {
    CONTEXT,
    BALL_RADIUS,
} from './constants.js';
import Shape from './shape.js';

class Ball extends Shape {
    constructor(x, y) {
        super(x, y);
        this.dx = 0;
        this.dy = 0;
        this.draw();
    }

    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
        CONTEXT.fill();
    }

    clear() {
        /* We can't use clearRect() here because we would end up with
        artefacts when passing by bricks */
        CONTEXT.fillStyle = 'white';
        CONTEXT.beginPath();
        // Needed a bigger radius here to get rid of artefacts
        CONTEXT.arc(this.x, this.y, BALL_RADIUS + 1, 0, 2 * Math.PI);
        CONTEXT.fill();
    }
}

export default Ball;
