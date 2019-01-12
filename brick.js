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

        // Added some offset to get rid of artefacts
        CONTEXT.fillRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    }

    equals(otherBrick) {
        return otherBrick instanceof Brick && this.x === otherBrick.x && this.y === otherBrick.y
        && this.width === otherBrick.width && this.height === otherBrick.height;
    }
}

export default Brick;
