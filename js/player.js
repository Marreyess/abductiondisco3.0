export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 48;
    this.speed = 220;
    this.keys = new Set();
    this.moving = false;

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "e"].includes(key)) {
        event.preventDefault();
      }

      this.keys.add(key);
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.key.toLowerCase());
    });

    window.addEventListener("blur", () => {
      this.keys.clear();
    });
  }

  update(deltaTime, canvas) {
    let dx = 0;
    let dy = 0;

    if (this.keys.has("a") || this.keys.has("arrowleft")) dx -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) dx += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) dy -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) dy += 1;

    this.moving = dx !== 0 || dy !== 0;

    if (dx !== 0 && dy !== 0) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }

    this.x += dx * this.speed * deltaTime;
    this.y += dy * this.speed * deltaTime;

    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
  }

  wantsToInteract() {
    return this.keys.has("e");
  }

  draw(context) {
    context.save();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();
  }
}