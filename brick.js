import {
    CONTEXT,
} from './constants.js';
import Shape from './shape.js';

class Brick extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.draw();
    }

    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.fillRect(this.x, this.y, this.width, this.height);
    }

    clear() {
        CONTEXT.fillStyle = 'white';
        CONTEXT.fillRect(this.x, this.y, this.width, this.height);
    }

    equals(otherBrick) {
        return otherBrick instanceof Brick && this.x === otherBrick.x && this.y === otherBrick.y
        && this.width === otherBrick.width && this.height === otherBrick.height;
    }
}

export default Brick;
