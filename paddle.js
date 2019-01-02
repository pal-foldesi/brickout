import {
  CONTEXT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  PADDLE_HEIGHT
} from './constants.js';

class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.acc = 0;
    this.hue = Math.random() * 360;
    this.saturation = Math.random() * 100;
    this.luminosity = 20 + Math.random() * 60;
    this.fillStyle = `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,1.0)`;
    this.draw();
  }

  draw() {
    CONTEXT.fillStyle = this.fillStyle;
    CONTEXT.fillRect(this.x, this.y, BRICK_WIDTH, PADDLE_HEIGHT);
  }

  clear() {
    CONTEXT.fillStyle = 'white';
    CONTEXT.fillRect(this.x - 1, this.y - 1, BRICK_WIDTH + 1, BRICK_HEIGHT + 1); //Width and length are offset to get rid of artifacts
  }
}

export default Paddle;