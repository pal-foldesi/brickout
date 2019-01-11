import {
    CONTEXT,
} from './constants.js';
import Rectangle from './rectangle.js';

class Brick extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.draw();
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
