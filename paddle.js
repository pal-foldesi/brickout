import {
    CONTEXT,
    BRICK_WIDTH,
    BRICK_HEIGHT,
    PADDLE_HEIGHT,
} from './constants.js';
import Shape from './shape.js';

class Paddle extends Shape {
    constructor(x, y) {
        super(x, y);
        this.oldX = x;
        this.acc = 0;
    }

    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, PADDLE_HEIGHT);
    }

    clear() {
        CONTEXT.fillStyle = 'white';
        // Width and length are offset to get rid of artifacts
        CONTEXT.fillRect(this.x - 1, this.y - 1, BRICK_WIDTH + 1, BRICK_HEIGHT + 1);
    }
}

export default Paddle;
