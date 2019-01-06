const CANVAS = document.getElementById('myCanvas');
const CONTEXT = CANVAS.getContext('2d');

const BALL_RADIUS = 20;
const BRICK_HEIGHT = 100;
const BRICK_WIDTH = 200;
const BRICK_HORIZONTAL_PADDING = 24;
const BRICK_VERTICAL_PADDING = 16;
const BRICK_OFFSET_LEFT = 30;
const BRICK_OFFSET_TOP = 24;
const PADDLE_HEIGHT = BRICK_HEIGHT / 3;
const PADDLE_WIDTH = BRICK_WIDTH;

export {
    CANVAS,
    CONTEXT,
    BALL_RADIUS,
    BRICK_WIDTH,
    BRICK_HORIZONTAL_PADDING,
    BRICK_VERTICAL_PADDING,
    BRICK_OFFSET_LEFT,
    BRICK_OFFSET_TOP,
    BRICK_HEIGHT,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
};
