export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 96;
    this.height = 144;
    this.speed = 220;
    this.keys = new Set();
    this.moving = false;

    this.idleFrames = [];
    this.walkFrames = [];
    this.danceFrames = [];

    this.loadFrames("./assets/Player/idle_", 4, this.idleFrames);
    this.loadFrames("./assets/Player/walk_", 6, this.walkFrames);
    this.loadFrames("./assets/Player/dance_", 6, this.danceFrames);

    this.currentFrames = this.idleFrames;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.16;

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

  loadFrames(path, total, frames) {
    for (let i = 1; i <= total; i++) {
      const image = new Image();
      image.src = `${path}${String(i).padStart(2, "0")}.png`;
      frames.push(image);
    }
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

    this.currentFrames = this.moving ? this.walkFrames : this.idleFrames;
    this.frameDuration = this.moving ? 0.12 : 0.2;

    this.animate(deltaTime);
  }

  animate(deltaTime) {
    if (this.currentFrames.length === 0) return;

    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentFrames.length;
    }
  }

  wantsToInteract() {
    return this.keys.has("e");
  }

  draw(context) {
    const frame = this.currentFrames[this.frameIndex];

    if (!frame || !frame.complete || frame.naturalWidth === 0) return;

    context.drawImage(frame, this.x, this.y, this.width, this.height);
  }
}