import {
    CONTEXT,
} from './constants.js';
import Rectangle from './rectangle.js';

class Paddle extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.oldX = x;
        this.acc = 0;
        this.draw();
    }

    clear() {
        CONTEXT.fillStyle = 'white';
        // Width and length are offset to get rid of artifacts
        CONTEXT.fillRect(this.x - 1, this.y - 1, this.width + 1, this.height + 1);
    }
}

export default Paddle;
