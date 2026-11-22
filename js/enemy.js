export class Enemy {
  constructor(x, y, name = "Freddie") {
    this.x = x;
    this.y = y;
    this.width = 220;
    this.height = 260;
    this.name = name;

    this.idleFrame = this.loadImage(
      "./assets/Alien/alien_idleEastFreddie.png"
    );

    this.danceFrames = [];

    for (let i = 1; i <= 6; i++) {
      const number = String(i).padStart(2, "0");

      this.danceFrames.push(
        this.loadImage(
          `./assets/Alien/dance_Freddie${number}.png`
        )
      );
    }

    this.isDancing = false;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.15;
  }

  loadImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  startDance() {
    this.isDancing = true;
    this.frameIndex = 0;
    this.frameTimer = 0;
  }

  stopDance() {
    this.isDancing = false;
    this.frameIndex = 0;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    if (!this.isDancing) return;

    this.frameTimer += deltaTime;

    while (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;

      this.frameIndex =
        (this.frameIndex + 1) %
        this.danceFrames.length;
    }
  }

  draw(context) {
    let image = this.idleFrame;

    if (this.isDancing) {
      image = this.danceFrames[this.frameIndex];

      if (
        !image.complete ||
        image.naturalWidth === 0
      ) {
        image = this.idleFrame;
      }
    }

    if (
      !image ||
      !image.complete ||
      image.naturalWidth === 0
    ) {
      return;
    }

    context.save();
    context.imageSmoothingEnabled = false;

    context.drawImage(
      image,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.restore();
  }
}