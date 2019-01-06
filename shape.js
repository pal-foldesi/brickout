class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
        this.fillStyle = `rgb(${this.red},${this.green},${this.blue})`;
    }
}

export default Shape;
