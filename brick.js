import {
  CANVAS,
  CONTEXT,
  BRICK_WIDTH,
  BRICK_HEIGHT
} from './constants.js';

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hue = Math.random() * 360;
    this.saturation = Math.random() * 100;
    this.luminosity = 20 + Math.random() * 60;
    this.fillStyle = `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,1.0)`;
    this.draw();
  }

  draw() {
    CONTEXT.fillStyle = this.fillStyle;
    CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
  }

  clear() {
    CONTEXT.fillStyle = 'white';
    CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
  }
}

export default Brick;