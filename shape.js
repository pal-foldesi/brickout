class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
        this.fillStyle = `rgb(${this.red},${this.green},${this.blue})`;

        this.draw();
    }

    // eslint-disable-next-line class-methods-use-this
    draw() {
        throw new Error('Subclasses must implement this method.');
    }
}

export default Shape;
