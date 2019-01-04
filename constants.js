const CANVAS = document.getElementById('myCanvas');
const CONTEXT = CANVAS.getContext('2d');

const BALL_RADIUS = 20;
const BRICK_HEIGHT = 100;
const BRICK_WIDTH = 200;
const PADDLE_HEIGHT = BRICK_HEIGHT / 3;
const PADDLE_WIDTH = BRICK_WIDTH;

export {
    CANVAS,
    CONTEXT,
    BALL_RADIUS,
    BRICK_HEIGHT,
    BRICK_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
};
