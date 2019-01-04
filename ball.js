import {
  CANVAS,
  CONTEXT,
  BALL_RADIUS,
} from './constants.js'; // eslint-disable-line import/extensions

class Ball {
  constructor() {
    this.x = CANVAS.width / 2;
    this.y = (CANVAS.height / 5) * 4;
    this.dx = 0;
    this.dy = 0;
    this.hue = Math.random() * 360;
    this.saturation = Math.random() * 100;
    this.luminosity = 20 + Math.random() * 60;
    this.fillStyle = `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,1.0)`;
    this.draw();
  }

  draw() {
    CONTEXT.fillStyle = this.fillStyle;
    CONTEXT.beginPath();
    CONTEXT.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
    CONTEXT.fill();
  }

  clear() {
    // We can't use clearRect() here because we would end up with artifacts when passing by bricks
    CONTEXT.fillStyle = 'white';
    CONTEXT.beginPath();
    CONTEXT.arc(this.x, this.y, BALL_RADIUS + 1, 0, 2 * Math.PI); //Needed a bigger radius here to get rid of artefacts
    CONTEXT.fill();
  }
}

export default Ball;
