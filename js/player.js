
export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 200;
    this.speed = 220;

    this.keys = new Set();
    this.moving = false;
    this.direction = "south";

    this.idleFrames = {};
    this.walkFrames = {};

    this.loadIdleFrames();
    this.loadWalkFrames();

    this.currentFrames = this.idleFrames.south;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.2;

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (
        ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "e"].includes(key)
      ) {
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

  loadImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  loadIdleFrames() {
    const directions = [
      "south",
      "north",
      "east",
      "west",
      "south-east",
      "south-west",
      "north-east",
      "north-west"
    ];

    for (const direction of directions) {
      this.idleFrames[direction] = [
        this.loadImage(`./assets/Player/idle_${direction}.png`)
      ];
    }
  }

  loadWalkFrames() {
    const animations = {
      front: "./assets/Player/walking_front",
      back: "./assets/Player/walking_back",
      left: "./assets/Player/walking_left",
      right: "./assets/Player/walking-right"
    };

    for (const [direction, path] of Object.entries(animations)) {
      this.walkFrames[direction] = [];

      for (let i = 1; i <= 8; i++) {
        this.walkFrames[direction].push(
          this.loadImage(`${path}${String(i).padStart(2, "0")}.png`)
        );
      }
    }
  }

  update(deltaTime, canvas, isPositionAllowed) {
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

    const nextX = this.x + dx * this.speed * deltaTime;
    const nextY = this.y + dy * this.speed * deltaTime;

    if (dx !== 0) {
      const boundedX = Math.max(0, Math.min(canvas.width - this.width, nextX));

      if (isPositionAllowed(boundedX, this.y)) {
        this.x = boundedX;
      }
    }

    if (dy !== 0) {
      const boundedY = Math.max(0, Math.min(canvas.height - this.height, nextY));

      if (isPositionAllowed(this.x, boundedY)) {
        this.y = boundedY;
      }
    }

    if (this.moving) {
      if (dx < 0 && dy < 0) {
        this.direction = "north-west";
      } else if (dx > 0 && dy < 0) {
        this.direction = "north-east";
      } else if (dx < 0 && dy > 0) {
        this.direction = "south-west";
      } else if (dx > 0 && dy > 0) {
        this.direction = "south-east";
      } else if (dx < 0) {
        this.direction = "west";
      } else if (dx > 0) {
        this.direction = "east";
      } else if (dy < 0) {
        this.direction = "north";
      } else if (dy > 0) {
        this.direction = "south";
      }
    }

    this.selectAnimation(dx, dy);
    this.animate(deltaTime);
  }

  selectAnimation(dx, dy) {
    let nextFrames;

    if (!this.moving) {
      nextFrames = this.idleFrames[this.direction];
      this.frameDuration = 0.2;
    } else if (Math.abs(dx) > Math.abs(dy)) {
      nextFrames = dx < 0 ? this.walkFrames.left : this.walkFrames.right;
      this.frameDuration = 0.12;
    } else if (dy < 0) {
      nextFrames = this.walkFrames.back;
      this.frameDuration = 0.12;
    } else {
      nextFrames = this.walkFrames.front;
      this.frameDuration = 0.12;
    }

    if (this.currentFrames !== nextFrames) {
      this.currentFrames = nextFrames;
      this.frameIndex = 0;
      this.frameTimer = 0;
    }
  }

  animate(deltaTime) {
    if (!this.currentFrames || this.currentFrames.length === 0) return;

    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.currentFrames.length;
    }
  }

  wantsToInteract() {
    return this.keys.has("e");
  }

  getFootPosition(x = this.x, y = this.y) {
    return {
      x: x + this.width / 2,
      y: y + this.height * 0.9
    };
  }

  draw(context) {
    const frame = this.currentFrames[this.frameIndex];

    if (!frame || !frame.complete || frame.naturalWidth === 0) return;

    context.drawImage(frame, this.x, this.y, this.width, this.height);
  }
}
