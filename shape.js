class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.hue = Math.random() * 360;
        this.saturation = Math.random() * 100;
        this.luminosity = 20 + Math.random() * 60;
        this.fillStyle = `hsla(${this.hue},${this.saturation}%,${this.luminosity}%,1.0)`;

        this.draw();
    }

    // eslint-disable-next-line class-methods-use-this
    draw() {
        throw new Error('Subclasses must implement this method.');
    }
}

export default Shape;
