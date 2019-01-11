import {
    CONTEXT,
} from './constants.js';
import Ball from './ball.js';
import Shape from './shape.js';

class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw() {
        CONTEXT.fillStyle = this.fillStyle;
        CONTEXT.fillRect(this.x, this.y, this.width, this.height);
    }

    intersectsWith(ball) {
        Rectangle.typeCheck(ball);

        const nearestX = Rectangle.clamp(ball.x, this.x, this.x + this.width);
        const nearestY = Rectangle.clamp(ball.y, this.y, this.y + this.height);

        const deltaX = ball.x - nearestX;
        const deltaY = ball.y - nearestY;

        if ((deltaX * deltaX + deltaY * deltaY) < (ball.radius * ball.radius)) {
            return true;
        }

        return false;
    }

    intersectsAtTop(ball) {
        Rectangle.typeCheck(ball);
        return ball.x >= this.x && ball.x <= this.x + this.width
            && ball.y <= this.y;
    }

    intersectsAtTopLeft(ball) {
        Rectangle.typeCheck(ball);
        return ball.x <= this.x && ball.y <= this.y;
    }

    intersectsAtTopRight(ball) {
        Rectangle.typeCheck(ball);
        return ball.x >= this.x + this.width && ball.y <= this.y;
    }

    intersectsAtMiddleLeft(ball) {
        Rectangle.typeCheck(ball);
        return ball.x <= this.x && ball.y >= this.y && ball.y <= this.y + this.height;
    }

    intersectsAtMiddleRight(ball) {
        Rectangle.typeCheck(ball);
        return ball.x >= this.x + this.width && ball.y >= this.y && ball.y <= this.y + this.height;
    }

    intersectsAtBottomLeft(ball) {
        Rectangle.typeCheck(ball);
        return ball.x < this.x && ball.y > this.y + this.height;
    }

    intersectsAtBottom(ball) {
        Rectangle.typeCheck(ball);
        return ball.x > this.x && ball.x < this.x + this.width && ball.y > this.y + this.height;
    }

    intersectsAtBottomRight(ball) {
        Rectangle.typeCheck(ball);
        return ball.x > this.x + this.width && ball.y > this.y + this.height;
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

    static typeCheck(ball) {
        if (!(ball instanceof Ball)) {
            throw new Error('Not a Ball');
        }
    }
}

export default Rectangle;
