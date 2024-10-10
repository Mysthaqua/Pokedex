export default class Engine {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.animationId = requestAnimationFrame(this.loop.bind(this));

    document.body.appendChild(this.canvas);
    document.addEventListener("click", this.onClick.bind(this));
  }

  update() {}

  draw() {}

  loop() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop.bind(this));
  }

  onClick() {}
}
