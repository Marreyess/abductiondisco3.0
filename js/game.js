import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.canvas.width = 1280;
    this.canvas.height = 720;

    this.logo = this.loadImage("./assets/logo-abduccion.png");
    this.playImage = this.loadImage("./assets/play.png");
    this.creditsImage = this.loadImage("./assets/credits.png");
    this.studioLogo = this.loadImage("./assets/double-m-studio.jpeg");
    this.duelRoom = this.loadImage("./assets/sala-duelo.jpeg");
    this.pauseImage = this.loadImage("./assets/pause.png");

    this.normalSprite = this.loadImage("./assets/Notas/normal01.png");
    this.doubleSprite = this.loadImage("./assets/Notas/dobleClic01.png");
    this.starSprite = this.loadImage("./assets/Notas/star01.png");
    this.crossoutSprite = this.loadImage("./assets/Notas/crossout01.png");

    this.player = new Player(390, 430);
    this.alien = new Enemy(260, 410, "Alien");

    this.state = "menu";
    this.previousState = null;
    this.lastTime = 0;
    this.started = false;
    this.wasInteracting = false;

    this.videoWasPlaying = false;
    this.musicWasPlaying = false;

    this.backgroundVideo = document.createElement("video");
    this.backgroundVideo.src = "./assets/space-background.mp4";
    this.backgroundVideo.loop = true;
    this.backgroundVideo.muted = true;
    this.backgroundVideo.playsInline = true;
    this.backgroundVideo.preload = "auto";
    this.backgroundVideo.load();
    this.backgroundVideo.play().catch(() => {});

    this.walkableArea = [
      { x: 0, y: 625 },
      { x: 370, y: 470 },
      { x: 1070, y: 470 },
      { x: 1280, y: 550 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.blockedAreas = [
      { x: 350, y: 440, width: 230, height: 120 },
      { x: 1030, y: 390, width: 250, height: 220 }
    ];

    this.buttons = {
      play: { x: 490, y: 450, width: 300, height: 100 },
      credits: { x: 490, y: 560, width: 300, height: 75 },
      back: { x: 35, y: 28, width: 115, height: 42 },
      begin: { x: 475, y: 615, width: 330, height: 65 },
      restart: { x: 470, y: 495, width: 340, height: 75 },
      pauseContinue: { x: 340, y: 405, width: 600, height: 140 },
      pauseExit: { x: 340, y: 555, width: 600, height: 135 }
    };

    this.music = new Audio("./assets/Music_Renew.wav");
    this.music.preload = "auto";
    this.music.volume = 0.7;
    this.music.loop = false;

    this.musicError = false;
    this.audioStarted = false;
    this.musicAttempt = 0;

    this.music.addEventListener("error", () => {
      this.musicError = true;
    });

    this.music.addEventListener("ended", () => {
      if (this.state === "rhythm") {
        this.finishRemainingNotes();
      }
    });

    this.trackLeft = 370;
    this.trackRight = 910;
    this.hitY = 565;

    this.noteSpeed = 240;
    this.hitWindow = 0.20;
    this.perfectWindow = 0.075;

    this.notePositions = [440, 560, 680, 800];

    this.maxErrors = 3;
    this.notes = [];
    this.effects = [];

    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalMisses = 0;
    this.avoidedTraps = 0;

    this.rhythmTime = 0;
    this.fallbackTime = 0;

    this.feedback = "";
    this.feedbackColor = "#ffffff";
    this.feedbackTimer = 0;

    this.speedEffectUntil = 0;
    this.result = "";

    this.rhythm = {
      slider: null
    };

    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();

        if (event.repeat) return;

        if (this.state === "paused") {
          this.resumeGame();
        } else if (
          this.state === "playing" ||
          this.state === "rhythmIntro" ||
          this.state === "rhythm" ||
          this.state === "rhythmEnd"
        ) {
          this.pauseGame();
        }

        return;
      }

      if (
        this.state === "rhythmIntro" &&
        (event.key === "Enter" || event.code === "Space")
      ) {
        event.preventDefault();
        this.beginRhythm();
      }
    });
  }

  loadImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  start() {
    if (this.started) return;

    this.started = true;
    this.lastTime = performance.now();

    requestAnimationFrame(this.loop);
  }

  loop = time => {
    const deltaTime = Math.min(
      Math.max((time - this.lastTime) / 1000, 0),
      0.05
    );

    this.lastTime = time;

    if (this.state === "playing") {
      this.update(deltaTime);
    }

    if (this.state === "rhythm") {
      this.updateRhythm(deltaTime);
    }

    this.draw();
    requestAnimationFrame(this.loop);
  };

  isInside(x, y, button) {
    return (
      x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height
    );
  }

  handleClick(x, y, detail = 1) {
    if (this.state === "paused") {
      if (this.isInside(x, y, this.buttons.pauseContinue)) {
        this.resumeGame();
      } else if (this.isInside(x, y, this.buttons.pauseExit)) {
        this.exitPause();
      }

      return;
    }

    if (this.state === "menu") {
      if (this.isInside(x, y, this.buttons.play)) {
        this.state = "playing";
      } else if (this.isInside(x, y, this.buttons.credits)) {
        this.state = "credits";
      }

      return;
    }

    if (this.state === "credits") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.state = "menu";
      }

      return;
    }

    if (this.state === "rhythmIntro") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
      } else if (this.isInside(x, y, this.buttons.begin)) {
        this.beginRhythm();
      }

      return;
    }

    if (this.state === "rhythmEnd") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
      } else if (this.isInside(x, y, this.buttons.restart)) {
        this.startRhythm();
      }

      return;
    }

    if (this.state === "rhythm") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
      } else {
        this.hitNote(x, y, detail);
      }
    }
  }

  update(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isPositionAllowed(x, y)
    );

    const interacting = this.player.wantsToInteract();
    const nearAlien = this.isNear(this.player, this.alien);

    if (interacting && !this.wasInteracting && nearAlien) {
      this.startRhythm();
    }

    this.wasInteracting = interacting;
  }

  isPositionAllowed(x, y) {
    const feet = this.player.getFootPosition(x, y);

    if (!this.isPointInsidePolygon(feet, this.walkableArea)) {
      return false;
    }

    for (const area of this.blockedAreas) {
      if (
        feet.x >= area.x &&
        feet.x <= area.x + area.width &&
        feet.y >= area.y &&
        feet.y <= area.y + area.height
      ) {
        return false;
      }
    }

    return true;
  }

  isPointInsidePolygon(point, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i];
      const b = polygon[j];

      const intersects =
        (a.y > point.y) !== (b.y > point.y) &&
        point.x <
          ((b.x - a.x) * (point.y - a.y)) /
          (b.y - a.y) + a.x;

      if (intersects) inside = !inside;
    }

    return inside;
  }

  isNear(player, target) {
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const tx = target.x + target.width / 2;
    const ty = target.y + target.height / 2;

    return Math.hypot(px - tx, py - ty) < 120;
  }

  pauseGame() {
    if (this.state === "paused") return;

    this.previousState = this.state;

    this.videoWasPlaying = !this.backgroundVideo.paused;
    this.musicWasPlaying = !this.music.paused;

    this.backgroundVideo.pause();
    this.music.pause();

    this.state = "paused";
  }

  resumeGame() {
    if (this.state !== "paused") return;

    this.state = this.previousState || "playing";
    this.previousState = null;

    if (this.videoWasPlaying) {
      this.backgroundVideo.play().catch(() => {});
    }

    if (this.musicWasPlaying && this.state === "rhythm") {
      this.music.play().catch(error => {
        console.warn(error);
        this.musicError = true;
      });
    }

    this.videoWasPlaying = false;
    this.musicWasPlaying = false;

    this.lastTime = performance.now();
    this.wasInteracting = true;
  }

  exitPause() {
    if (this.state !== "paused") return;

    this.musicAttempt++;
    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    this.previousState = null;
    this.videoWasPlaying = false;
    this.musicWasPlaying = false;

    this.backgroundVideo.play().catch(() => {});

    this.state = "menu";
    this.wasInteracting = false;
  }

  randomType() {
    const number = Math.random();

    if (number < 0.58) return "circle";
    if (number < 0.80) return "double";

    return "crossout";
  }

  buildChart() {
    const duration = this.music.duration;

    let total = 24;
    let interval = 0.85;
    let first = 3;

    if (Number.isFinite(duration) && duration > 0) {
      first = Math.min(3, Math.max(0.5, duration * 0.15));

      interval = Math.min(
        1.1,
        Math.max(0.38, (duration - first - 0.8) / 25)
      );

      total = Math.max(
        1,
        Math.min(
          24,
          Math.floor((duration - first - 0.4) / interval)
        )
      );
    }

    const starIndex = total >= 8
      ? Math.floor(total * (0.35 + Math.random() * 0.3))
      : -1;

    this.notes = [];

    let previousLane = -1;

    for (let i = 0; i < total; i++) {
      let lane = Math.floor(
        Math.random() * this.notePositions.length
      );

      if (lane === previousLane) {
        lane = (lane + 1 + Math.floor(Math.random() * 3)) %
          this.notePositions.length;
      }

      previousLane = lane;

      const type = i === starIndex
        ? "star"
        : this.randomType();

      this.notes.push({
        id: i,
        x: this.notePositions[lane],
        type,
        time: first + i * interval,
        status: "pending",
        firstClickTime: null
      });
    }
  }

  startRhythm() {
    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    this.state = "rhythmIntro";
  }

  beginRhythm() {
    if (this.state !== "rhythmIntro") return;

    this.musicAttempt++;
    const attemptId = this.musicAttempt;

    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalMisses = 0;
    this.avoidedTraps = 0;

    this.rhythmTime = 0;
    this.fallbackTime = 0;
    this.effects = [];

    this.feedback = "¡PREPÁRATE!";
    this.feedbackColor = "#a6ff00";
    this.feedbackTimer = 1.5;

    this.speedEffectUntil = 0;
    this.result = "";

    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    this.musicError = false;
    this.audioStarted = false;

    this.buildChart();

    this.state = "rhythm";

    this.music.play().then(() => {
      if (attemptId !== this.musicAttempt) return;

      this.audioStarted = true;

      if (this.state === "paused") {
        this.music.pause();
        this.musicWasPlaying = true;
      }
    }).catch(error => {
      if (attemptId !== this.musicAttempt) return;

      console.warn(error);

      if (this.state === "rhythm") {
        this.musicError = true;
        this.showFeedback(
          "MODO PRÁCTICA SIN AUDIO",
          "#ffdc69"
        );
      }
    });
  }

  getRhythmTime(deltaTime) {
    if (
      !this.musicError &&
      !this.music.paused &&
      this.music.readyState >= 2
    ) {
      this.audioStarted = true;
      return this.music.currentTime;
    }

    if (this.audioStarted && !this.musicError) {
      return this.rhythmTime;
    }

    if (this.musicError) {
      this.fallbackTime += deltaTime;
      return this.fallbackTime;
    }

    return this.rhythmTime;
  }

  updateRhythm(deltaTime) {
    this.rhythmTime = this.getRhythmTime(deltaTime);

    this.feedbackTimer = Math.max(
      0,
      this.feedbackTimer - deltaTime
    );

    for (const effect of this.effects) {
      effect.life -= deltaTime;
    }

    this.effects = this.effects.filter(
      effect => effect.life > 0
    );

    if (
      this.speedEffectUntil > 0 &&
      this.rhythmTime >= this.speedEffectUntil
    ) {
      this.music.playbackRate = 1;
      this.speedEffectUntil = 0;
    }

    for (const note of this.notes) {
      if (note.status !== "pending") continue;

      if (this.rhythmTime > note.time + this.hitWindow) {
        if (note.type === "crossout") {
          note.status = "avoided";
          this.avoidedTraps++;
        } else if (note.type === "star") {
          note.status = "skipped";
        } else {
          note.status = "missed";
          this.registerMiss();
        }

        if (this.state !== "rhythm") return;
      }
    }

    this.checkRhythmEnd();
  }

  getNoteY(note) {
    return this.hitY -
      (note.time - this.rhythmTime) * this.noteSpeed;
  }

  getHittableNote(x) {
    let candidate = null;
    let bestDistance = Infinity;

    for (const note of this.notes) {
      if (note.status !== "pending") continue;

      const difference = Math.abs(this.rhythmTime - note.time);
      const distanceX = Math.abs(x - note.x);

      if (
        difference <= this.hitWindow &&
        distanceX <= 55
      ) {
        const distance = difference * this.noteSpeed +
          distanceX * 0.15;

        if (distance < bestDistance) {
          candidate = note;
          bestDistance = distance;
        }
      }
    }

    return candidate;
  }

  hitNote(x, y, detail = 1) {
    if (Math.abs(y - this.hitY) > 55) return;

    const note = this.getHittableNote(x);

    if (!note) {
      this.showFeedback("FUERA DE TIEMPO", "#ff647a");
      return;
    }

    if (note.type === "crossout") {
      note.status = "trapHit";
      this.registerMiss();

      if (this.state === "rhythm") {
        this.showFeedback("¡NO TOQUES LA EQUIS!", "#ff576d");
      }

      this.checkRhythmEnd();
      return;
    }

    if (note.type === "double") {
      const now = performance.now();

      if (
        note.firstClickTime === null ||
        now - note.firstClickTime > 350
      ) {
        note.firstClickTime = now;
        this.showFeedback("¡SEGUNDO CLIC!", "#ffdc69");
        return;
      }
    }

    note.status = "hit";

    const difference = Math.abs(this.rhythmTime - note.time);

    let points = difference <= this.perfectWindow
      ? 150
      : 100;

    if (note.type === "double") {
      points = 200;
    }

    if (note.type === "star") {
      points = 300;
      this.music.playbackRate = 0.7;
      this.speedEffectUntil = this.rhythmTime + 3;
    }

    this.registerHit(points);

    this.showFeedback(
      note.type === "star"
        ? "¡ESTRELLA! TIEMPO LENTO"
        : note.type === "double"
          ? "¡DOBLE CLIC!"
          : "¡PERFECT!",
      note.type === "star"
        ? "#ffdc69"
        : "#a6ff00"
    );

    this.addEffect(
      note.x,
      this.hitY,
      "#53ddff"
    );

    this.checkRhythmEnd();
  }

  registerHit(points) {
    this.hits++;
    this.combo++;

    this.bestCombo = Math.max(
      this.bestCombo,
      this.combo
    );

    this.score += points +
      Math.min(this.combo * 5, 100);

    this.misses = 0;
  }

  registerMiss() {
    this.misses++;
    this.totalMisses++;
    this.combo = 0;

    this.showFeedback(
      `ERROR ${this.misses}/${this.maxErrors}`,
      "#ff576d"
    );

    if (this.misses >= this.maxErrors) {
      this.endRhythm(false);
    }
  }

  showFeedback(message, color) {
    this.feedback = message;
    this.feedbackColor = color;
    this.feedbackTimer = 0.8;
  }

  addEffect(x, y, color) {
    this.effects.push({
      x,
      y,
      color,
      life: 0.5
    });
  }

  checkRhythmEnd() {
    if (this.state !== "rhythm") return;

    if (
      this.notes.length > 0 &&
      this.notes.every(note => note.status !== "pending")
    ) {
      this.endRhythm(true);
    }
  }

  finishRemainingNotes() {
    if (this.state !== "rhythm") return;

    for (const note of this.notes) {
      if (note.status !== "pending") continue;

      if (note.type === "crossout") {
        note.status = "avoided";
        this.avoidedTraps++;
      } else if (note.type === "star") {
        note.status = "skipped";
      } else {
        note.status = "missed";
        this.registerMiss();
      }

      if (this.state !== "rhythm") return;
    }

    this.checkRhythmEnd();
  }

  endRhythm(won) {
    if (this.state !== "rhythm") return;

    this.musicAttempt++;
    this.music.pause();
    this.music.playbackRate = 1;

    this.state = "rhythmEnd";
    this.result = won ? "victory" : "defeat";
  }

  exitRhythm() {
    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    this.state = "playing";
    this.wasInteracting = true;
  }

  startSliderAt(x, y) {
    return false;
  }

  moveSlider(x, y) {}

  finishSlider(success) {}

  drawBackground() {
    const ctx = this.context;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1280, 720);

    if (this.backgroundVideo.readyState >= 2) {
      ctx.drawImage(
        this.backgroundVideo,
        0, 0, 1280, 720
      );
    }

    ctx.fillStyle = "rgba(5,3,18,0.42)";
    ctx.fillRect(0, 0, 1280, 720);
  }

  drawDuelRoom() {
    const ctx = this.context;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1280, 720);

    if (
      this.duelRoom.complete &&
      this.duelRoom.naturalWidth > 0
    ) {
      ctx.drawImage(this.duelRoom, 0, 0, 1280, 720);
    }
  }

  drawContainedImage(image, area) {
    if (!image.complete || !image.naturalWidth) return;

    const scale = Math.min(
      area.width / image.naturalWidth,
      area.height / image.naturalHeight
    );

    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;

    const x = area.x + (area.width - width) / 2;
    const y = area.y + (area.height - height) / 2;

    this.context.drawImage(image, x, y, width, height);
  }

  drawSprite(image, x, y, size, color) {
    const ctx = this.context;

    if (
      image &&
      image.complete &&
      image.naturalWidth > 0
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        x - size / 2,
        y - size / 2,
        size,
        size
      );

      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.arc(x, y, size * 0.34, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  drawCharacters() {
    const ctx = this.context;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.translate(
      80 - this.player.x,
      355 - this.player.y
    );

    this.player.draw(ctx);
    ctx.restore();

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.translate(
      990 - this.alien.x,
      365 - this.alien.y
    );

    this.alien.draw(ctx);
    ctx.restore();
  }

  draw() {
    if (this.state === "paused") {
      this.drawPause();
    } else if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "credits") {
      this.drawCredits();
    } else if (this.state === "rhythmIntro") {
      this.drawRhythmIntro();
    } else if (this.state === "rhythm") {
      this.drawRhythm();
    } else if (this.state === "rhythmEnd") {
      this.drawRhythmEnd();
    } else {
      this.drawGame();
    }
  }

  drawPause() {
    const ctx = this.context;

    if (this.previousState === "playing") {
      this.drawGame();
    } else if (this.previousState === "rhythm") {
      this.drawRhythm();
    } else if (this.previousState === "rhythmIntro") {
      this.drawRhythmIntro();
    } else if (this.previousState === "rhythmEnd") {
      this.drawRhythmEnd();
    }

    ctx.fillStyle = "rgba(0,0,0,0.70)";
    ctx.fillRect(0, 0, 1280, 720);

    if (
      this.pauseImage.complete &&
      this.pauseImage.naturalWidth > 0
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(this.pauseImage, 0, 0, 1280, 720);
      ctx.restore();
    } else {
      ctx.textAlign = "center";
      ctx.font = "bold 78px Arial";
      ctx.fillStyle = "#a6ff00";
      ctx.fillText("PAUSA", 640, 315);

      ctx.fillStyle = "#32e6ff";
      ctx.fillRect(340, 405, 600, 140);

      ctx.fillStyle = "#8000c8";
      ctx.font = "bold 45px Arial";
      ctx.fillText("CONTINUAR", 640, 490);

      ctx.fillStyle = "#8000c8";
      ctx.fillRect(340, 555, 600, 135);

      ctx.fillStyle = "#32e6ff";
      ctx.fillText("SALIR", 640, 640);
    }
  }

  drawMenu() {
    this.drawBackground();

    this.drawContainedImage(this.logo, {
      x: 145, y: 30, width: 990, height: 390
    });

    this.drawContainedImage(this.playImage, this.buttons.play);
    this.drawContainedImage(this.creditsImage, this.buttons.credits);
  }

  drawCredits() {
    const ctx = this.context;

    this.drawBackground();
    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 48px Arial";
    ctx.fillText("CREDITS", 640, 75);

    this.drawContainedImage(this.studioLogo, {
      x: 490, y: 100, width: 300, height: 250
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 27px Arial";
    ctx.fillText("DOUBLE M STUDIO", 640, 385);

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 20px Arial";
    ctx.fillText("DESARROLLO DEL VIDEOJUEGO", 640, 425);

    ctx.fillStyle = "#c8c4d8";
    ctx.font = "20px Arial";
    ctx.fillText("Desarrollado por", 640, 465);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Mariana A. Reyes", 640, 505);
    ctx.fillText("Oscar Michel Ortega Martinez", 640, 540);

    ctx.fillStyle = "#a6ff00";
    ctx.font = "18px Arial";
    ctx.fillText("ABDUCCIÓN DISCO", 640, 585);

    this.drawBackButton();
  }

  drawBackButton() {
    const ctx = this.context;

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("← BACK", 35, 55);
  }

  drawGame() {
    const ctx = this.context;

    this.drawDuelRoom();

    this.alien.draw(ctx);
    this.player.draw(ctx);

    if (this.isNear(this.player, this.alien)) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText(
        "Presiona E para iniciar el duelo",
        640,
        675
      );
    }
  }

  drawRhythmIntro() {
    const ctx = this.context;

    this.drawDuelRoom();

    ctx.fillStyle = "rgba(5,3,22,0.94)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.fillStyle = "#15112e";
    ctx.fillRect(340, 65, 600, 625);

    ctx.strokeStyle = "#8e45dc";
    ctx.lineWidth = 4;
    ctx.strokeRect(340, 65, 600, 625);

    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 32px Arial";
    ctx.fillText("TUTORIAL DE RITMO", 640, 115);

    ctx.fillStyle = "#ffffff";
    ctx.font = "19px Arial";
    ctx.fillText(
      "Conoce las notas antes del duelo",
      640,
      150
    );

    const items = [
      {
        image: this.normalSprite,
        title: "CÍRCULO",
        description: "Un clic cuando toque la línea",
        y: 215
      },
      {
        image: this.doubleSprite,
        title: "CÍRCULO DOBLE",
        description: "Dos clics rápidos en la línea",
        y: 320
      },
      {
        image: this.starSprite,
        title: "ESTRELLA ESPECIAL",
        description: "Ralentiza la música al acertar",
        y: 420
      },
      {
        image: this.crossoutSprite,
        title: "TACHE / EQUIS",
        description: "No lo presiones: es una trampa",
        y: 525
      }
    ];

    for (const item of items) {
      this.drawSprite(
        item.image,
        410,
        item.y,
        72,
        "#b970ff"
      );

      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Arial";
      ctx.fillText(
        item.title,
        460,
        item.y - 6
      );

      ctx.font = "17px Arial";
      ctx.fillText(
        item.description,
        460,
        item.y + 20
      );
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffdc69";
    ctx.font = "16px Arial";
    ctx.fillText(
      "3 errores seguidos = derrota",
      640,
      588
    );

    const button = this.buttons.begin;

    ctx.fillStyle = "#a6ff00";
    ctx.fillRect(
      button.x,
      button.y,
      button.width,
      button.height
    );

    ctx.fillStyle = "#101225";
    ctx.font = "bold 25px Arial";
    ctx.fillText("INICIAR DUELO", 640, 656);

    this.drawBackButton();
  }

  drawRhythm() {
    const ctx = this.context;

    this.drawDuelRoom();

    ctx.fillStyle = "rgba(5,3,22,0.91)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";
    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 33px Arial";
    ctx.fillText("TUTORIAL DE RITMO", 640, 55);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px Arial";
    ctx.fillText(`PUNTOS ${this.score}`, 175, 145);

    ctx.fillStyle = "#ff60b6";
    ctx.fillText(`COMBO x${this.combo}`, 1100, 145);

    ctx.fillStyle = "#ffffff";
    ctx.font = "19px Arial";
    ctx.fillText(`ACIERTOS ${this.hits}`, 175, 210);
    ctx.fillText(`ERRORES ${this.misses}/3`, 1100, 210);

    ctx.fillStyle = "#15112e";
    ctx.fillRect(
      this.trackLeft,
      105,
      this.trackRight - this.trackLeft,
      520
    );

    ctx.strokeStyle = "#8e45dc";
    ctx.lineWidth = 4;
    ctx.strokeRect(
      this.trackLeft,
      105,
      this.trackRight - this.trackLeft,
      520
    );

    const laneColors = [
      "#b970ff",
      "#32e6ff",
      "#55ff83",
      "#ff60b6"
    ];

    for (let i = 0; i < this.notePositions.length; i++) {
      const x = this.notePositions[i];

      ctx.fillStyle = i % 2 === 0
        ? "rgba(100,55,170,0.10)"
        : "rgba(25,150,180,0.08)";

      ctx.fillRect(x - 58, 110, 116, 510);

      ctx.strokeStyle = laneColors[i];
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(x - 58, 110);
      ctx.lineTo(x - 58, 620);
      ctx.stroke();

      ctx.globalAlpha = 1;
    }

    ctx.save();
    ctx.strokeStyle = "#53ddff";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#53ddff";
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(this.trackLeft, this.hitY);
    ctx.lineTo(this.trackRight, this.hitY);
    ctx.stroke();
    ctx.restore();

    for (const note of this.notes) {
      if (note.status !== "pending") continue;

      const y = this.getNoteY(note);

      if (y < 90 || y > 640) continue;

      let sprite;
      let color;
      let size;

      if (note.type === "circle") {
        sprite = this.normalSprite;
        color = "#b970ff";
        size = 80;
      } else if (note.type === "double") {
        sprite = this.doubleSprite;
        color = "#ff65bf";
        size = 85;
      } else if (note.type === "star") {
        sprite = this.starSprite;
        color = "#ffdc69";
        size = 85;
      } else {
        sprite = this.crossoutSprite;
        color = "#ff576d";
        size = 95;
      }

      this.drawSprite(
        sprite,
        note.x,
        y,
        size,
        color
      );
    }

    for (const effect of this.effects) {
      const progress = 1 - effect.life / 0.5;

      ctx.save();

      ctx.globalAlpha = Math.max(0, effect.life / 0.5);
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.arc(
        effect.x,
        effect.y,
        30 + progress * 70,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "#b8edff";
    ctx.font = "17px Arial";
    ctx.fillText(
      "HAZ CLIC CUANDO LA NOTA TOQUE LA LÍNEA",
      640,
      651
    );

    if (this.feedbackTimer > 0) {
      ctx.fillStyle = this.feedbackColor;
      ctx.font = "bold 22px Arial";
      ctx.fillText(this.feedback, 640, 94);
    }

    if (this.music.playbackRate !== 1) {
      ctx.fillStyle = "#ffdc69";
      ctx.font = "18px Arial";
      ctx.fillText(
        `VELOCIDAD x${this.music.playbackRate.toFixed(2)}`,
        1100,
        270
      );
    }

    this.drawBackButton();
  }

  drawRhythmEnd() {
    const ctx = this.context;

    this.drawDuelRoom();

    ctx.fillStyle = "rgba(7,4,26,0.92)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";

    ctx.fillStyle = this.result === "victory"
      ? "#a6ff00"
      : "#ff576d";

    ctx.font = "bold 44px Arial";

    ctx.fillText(
      this.result === "Victoria"
        ? "¡TUTORIAL COMPLETADO!"
        : "¡HAS PERDIDO!",
      640,
      220
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";
    ctx.fillText(`PUNTUACIÓN ${this.score}`, 640, 305);

    ctx.font = "23px Arial";
    ctx.fillText(`Aciertos: ${this.hits}`, 640, 365);
    ctx.fillText(
      `Errores consecutivos: ${this.misses}`,
      640,
      405
    );
    ctx.fillText(
      `Errores totales: ${this.totalMisses}`,
      640,
      445
    );

    const button = this.buttons.restart;

    ctx.fillStyle = "#a6ff00";
    ctx.fillRect(
      button.x,
      button.y,
      button.width,
      button.height
    );

    ctx.fillStyle = "#101225";
    ctx.font = "bold 25px Arial";
    ctx.fillText("VOLVER A JUGAR", 640, 540);

    this.drawBackButton();
  }
}