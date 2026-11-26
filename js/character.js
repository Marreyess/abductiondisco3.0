export class Character {
  constructor({ name, maxHp = 100, baseX = 0, baseY = 0, width = 120, height = 160, spriteSrc, isPlayer = false }) {
    this.name = name;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.displayedHp = maxHp;
    this.baseX = baseX;
    this.baseY = baseY;
    this.x = baseX;
    this.y = baseY;
    this.width = width;
    this.height = height;
    this.isPlayer = isPlayer;

    this.image = new Image();
    this.imageLoaded = false;

    if (spriteSrc) {
      this.image.onload = () => {
        this.imageLoaded = true;
      };
      this.image.onerror = () => {
        this.imageLoaded = false;
      };
      this.image.src = spriteSrc;
    }

    this.scaleX = 1;
    this.scaleY = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.shakeTimer = 0;
    this.shakeDuration = 0.35;
    this.shakeMagnitude = 14;
    this.shakeX = 0;
    this.shakeY = 0;

    this.tintTimer = 0;
    this.tintDuration = 0.25;

    this.attackProgress = -1;
    this.attackDuration = 0.55;
    this.attackDistance = 70;
    this.attackOffset = 0;

    this.idleTimer = Math.random() * Math.PI * 2;
    this.pullDirection = null;
    this.pullAmount = 0;
    this.pullTarget = 0;
    this.pullStrength = 1;

    this.hitstopTimer = 0;
    this.hitstopDuration = 0.065;
  }

  setPullDirection(direction) {
    if (!["left", "right", "up", "down"].includes(direction)) return;
    this.pullDirection = direction;
    this.pullTarget = 1;
  }

  releasePull() {
    this.pullDirection = null;
    this.pullTarget = 0;
  }

  takeDamage(amount, flags = { squashShake: true, tint: true }) {
    this.currentHp = Math.max(0, this.currentHp - amount);

    if (flags.squashShake !== false) {
      this.scaleX = 1.35;
      this.scaleY = 0.75;
      this.shakeTimer = this.shakeDuration;
      this.shakeX = 0;
      this.shakeY = 0;
    }

    if (flags.tint !== false) {
      this.tintTimer = this.tintDuration;
    }

    this.hitstopTimer = this.hitstopDuration;
  }

  startAttackAnimation() {
    this.attackProgress = 0;
    this.attackOffset = 0;
  }

  update(dt, flags = {}) {
    const allowIdle = flags.idle !== false;
    const allowPull = flags.pull !== false;
    const allowAttack = flags.attack !== false;
    const allowShake = flags.shake !== false;
    const allowTint = flags.tint !== false;

    this.displayedHp += (this.currentHp - this.displayedHp) * Math.min(1, dt * 8);

    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - dt);
      return;
    }

    if (allowIdle) this.idleTimer += dt;

    const idleWave = allowIdle && !this.pullTarget && this.attackProgress < 0
      ? Math.sin(this.idleTimer * 3.5) * 0.035
      : 0;

    let targetScaleX = 1 - idleWave * 0.5;
    let targetScaleY = 1 + idleWave;
    let targetOffsetX = 0;
    let targetOffsetY = 0;

    if (allowPull) {
      this.pullAmount += (this.pullTarget - this.pullAmount) * Math.min(1, dt * 9);

      if (this.pullAmount > 0.001 && this.pullDirection) {
        const amount = this.pullAmount * this.pullStrength;

        if (this.pullDirection === "left" || this.pullDirection === "right") {
          targetScaleX = 1 + 0.35 * amount;
          targetScaleY = 1 - 0.25 * amount;
          targetOffsetX = (this.pullDirection === "left" ? -1 : 1) * 18 * amount;
        } else {
          targetScaleX = 1 - 0.25 * amount;
          targetScaleY = 1 + 0.35 * amount;
          targetOffsetY = (this.pullDirection === "up" ? -1 : 1) * 18 * amount;
        }
      }

      if (this.pullAmount <= 0.001 && this.pullTarget === 0) {
        this.pullAmount = 0;
      }
    }

    if (allowAttack && this.attackProgress >= 0) {
      this.attackProgress = Math.min(1, this.attackProgress + dt / this.attackDuration);
      const p = this.attackProgress;

      if (p < 0.25) {
        const anticipation = p / 0.25;
        this.attackOffset = -18 * anticipation;
        targetScaleX *= 1 - 0.08 * anticipation;
        targetScaleY *= 1 + 0.08 * anticipation;
      } else if (p < 0.65) {
        const lunge = (p - 0.25) / 0.4;
        this.attackOffset = -18 + 88 * lunge;
        targetScaleX *= 1 + 0.12 * lunge;
        targetScaleY *= 1 - 0.08 * lunge;
      } else {
        const recovery = (p - 0.65) / 0.35;
        this.attackOffset = 70 * (1 - recovery);
      }

      if (this.attackProgress >= 1) {
        this.attackProgress = -1;
        this.attackOffset = 0;
      }
    }

    if (allowShake && this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      const intensity = this.shakeTimer / this.shakeDuration;
      this.shakeX = (Math.random() * 2 - 1) * this.shakeMagnitude * intensity;
      this.shakeY = (Math.random() * 2 - 1) * this.shakeMagnitude * intensity;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }

    if (allowTint && this.tintTimer > 0) {
      this.tintTimer = Math.max(0, this.tintTimer - dt);
    }

    this.scaleX += (targetScaleX - this.scaleX) * Math.min(1, dt * 12);
    this.scaleY += (targetScaleY - this.scaleY) * Math.min(1, dt * 12);
    this.offsetX += (targetOffsetX - this.offsetX) * Math.min(1, dt * 12);
    this.offsetY += (targetOffsetY - this.offsetY) * Math.min(1, dt * 12);

    this.x = this.baseX + this.offsetX + this.attackOffset + this.shakeX;
    this.y = this.baseY + this.offsetY + this.shakeY;
  }

  draw(ctx, flags = {}) {
    if (!this.imageLoaded || !this.image.complete || this.image.naturalWidth === 0) return;

    const showShadow = flags.shadow !== false;
    const showTint = flags.tint !== false;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);

    if (showShadow) {
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width * 0.3, this.height * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (showTint && this.tintTimer > 0) {
      ctx.filter = "brightness(1.8) sepia(1) saturate(6) hue-rotate(-50deg)";
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.image, -this.width / 2, -this.height, this.width, this.height);
    ctx.restore();
  }
}