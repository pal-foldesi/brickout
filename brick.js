import {
    CONTEXT,
    BRICK_WIDTH,
    BRICK_HEIGHT,
} from './constants.js';
import Shape from './shape.js';

class Brick extends Shape {
    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
    }

    clear() {
        CONTEXT.fillStyle = 'white';
        CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
    }

    equals(otherBrick) {
        return otherBrick instanceof Brick && this.x === otherBrick.x && this.y === otherBrick.y;
    }
}

export default Brick;
