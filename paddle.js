import {
    CONTEXT,
} from './constants.js';
import Shape from './shape.js';

class Paddle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.oldX = x;
        this.acc = 0;
        this.draw();
    }

    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.fillRect(this.x, this.y, this.width, this.height);
    }

    clear() {
        CONTEXT.fillStyle = 'white';
        // Width and length are offset to get rid of artifacts
        CONTEXT.fillRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);
    }
}

export default Paddle;
