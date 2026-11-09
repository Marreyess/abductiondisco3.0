
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.canvas.width = 1280;
    this.canvas.height = 720;

    this.logo = new Image();
    this.logo.src = "./assets/logo-abduccion.png";

    this.playImage = new Image();
    this.playImage.src = "./assets/play.png";

    this.creditsImage = new Image();
    this.creditsImage.src = "./assets/credits.png";

    this.studioLogo = new Image();
    this.studioLogo.src = "./assets/double-m-studio.jpeg";

    this.duelRoom = new Image();
    this.duelRoom.src = "./assets/sala-duelo.jpeg";

    this.pauseImage = new Image();
    this.pauseImage.src = "./assets/pause.png";

    this.crossoutImage = new Image();
    this.crossoutImage.src = "./assets/Notas/crossout01.png";

    this.player = new Player(390, 430);
    this.alien = new Enemy(260, 410, "Alien");

    this.lastTime = 0;
    this.state = "menu";
    this.wasInteracting = false;

    this.previousState = null;
    this.videoWasPlaying = false;

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
      {
        x: 350,
        y: 440,
        width: 230,
        height: 120
      },
      {
        x: 1030,
        y: 390,
        width: 250,
        height: 220
      }
    ];

    this.buttons = {
      play: {
        x: 490,
        y: 450,
        width: 300,
        height: 100
      },

      credits: {
        x: 490,
        y: 560,
        width: 300,
        height: 75
      },

      back: {
        x: 35,
        y: 28,
        width: 115,
        height: 42
      },

      begin: {
        x: 475,
        y: 615,
        width: 330,
        height: 65
      },

      continue: {
        x: 340,
        y: 405,
        width: 600,
        height: 140
      },

      exit: {
        x: 340,
        y: 555,
        width: 600,
        height: 135
      }
    };

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();

        if (event.repeat) return;

        if (this.state === "paused") {
          this.resumeGame();
        } else if (
          this.state === "playing" ||
          this.state === "rhythmIntro" ||
          this.state === "rhythm"
        ) {
          this.pauseGame();
        }
      }
    });
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time) => {
    const deltaTime = Math.min(
      (time - this.lastTime) / 1000,
      0.05
    );

    this.lastTime = time;

    if (this.state === "playing") {
      this.update(deltaTime);
    }

    this.draw();
    requestAnimationFrame(this.loop);
  };

  pauseGame() {
    if (this.state === "paused") return;

    this.previousState = this.state;

    this.videoWasPlaying =
      !this.backgroundVideo.paused;

    this.backgroundVideo.pause();

    this.state = "paused";
  }

  resumeGame() {
    if (this.state !== "paused") return;

    this.state = this.previousState || "playing";
    this.previousState = null;

    if (this.videoWasPlaying) {
      this.backgroundVideo.play().catch(() => {});
    }

    this.videoWasPlaying = false;
    this.lastTime = performance.now();
  }

  exitPause() {
    if (this.state !== "paused") return;

    this.state = "menu";
    this.previousState = null;

    this.backgroundVideo.play().catch(() => {});

    this.videoWasPlaying = false;
    this.wasInteracting = false;
  }

  handleClick(x, y) {
    if (this.state === "paused") {
      if (this.isInside(x, y, this.buttons.continue)) {
        this.resumeGame();
      } else if (
        this.isInside(x, y, this.buttons.exit)
      ) {
        this.exitPause();
      }

      return;
    }

    if (this.state === "menu") {
      if (this.isInside(x, y, this.buttons.play)) {
        this.state = "playing";
      } else if (
        this.isInside(x, y, this.buttons.credits)
      ) {
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
        this.state = "playing";
      } else if (this.isInside(x, y, this.buttons.begin)) {
        this.state = "rhythm";
      }

      return;
    }

    if (this.state === "rhythm") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.state = "playing";
      }
    }
  }

  isInside(x, y, button) {
    return (
      x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height
    );
  }

  update(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isPositionAllowed(x, y)
    );

    const interacting = this.player.wantsToInteract();
    const nearAlien = this.isNear(
      this.player,
      this.alien
    );

    if (
      interacting &&
      !this.wasInteracting &&
      nearAlien
    ) {
      this.state = "rhythmIntro";
    }

    this.wasInteracting = interacting;
  }

  isPositionAllowed(x, y) {
    const feet = this.player.getFootPosition(x, y);

    if (
      !this.isPointInsidePolygon(
        feet,
        this.walkableArea
      )
    ) {
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

    for (
      let i = 0, j = polygon.length - 1;
      i < polygon.length;
      j = i++
    ) {
      const a = polygon[i];
      const b = polygon[j];

      const intersects =
        a.y > point.y !== b.y > point.y &&
        point.x <
          ((b.x - a.x) * (point.y - a.y)) /
          (b.y - a.y) + a.x;

      if (intersects) {
        inside = !inside;
      }
    }

    return inside;
  }

  isNear(player, target) {
    const playerCenterX =
      player.x + player.width / 2;

    const playerCenterY =
      player.y + player.height / 2;

    const targetCenterX =
      target.x + target.width / 2;

    const targetCenterY =
      target.y + target.height / 2;

    const dx = playerCenterX - targetCenterX;
    const dy = playerCenterY - targetCenterY;

    return Math.hypot(dx, dy) < 120;
  }

  drawBackground() {
    const context = this.context;
    const canvas = this.canvas;

    context.fillStyle = "#000000";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (this.backgroundVideo.readyState >= 2) {
      context.drawImage(
        this.backgroundVideo,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    context.fillStyle = "rgba(5, 3, 18, 0.42)";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  drawDuelRoom() {
    const context = this.context;
    const canvas = this.canvas;

    context.fillStyle = "#000000";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (
      this.duelRoom.complete &&
      this.duelRoom.naturalWidth > 0
    ) {
      context.drawImage(
        this.duelRoom,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  drawContainedImage(image, area) {
    if (
      !image.complete ||
      image.naturalWidth === 0
    ) return;

    const scale = Math.min(
      area.width / image.naturalWidth,
      area.height / image.naturalHeight
    );

    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;

    const x = area.x +
      (area.width - width) / 2;

    const y = area.y +
      (area.height - height) / 2;

    this.context.drawImage(
      image,
      x,
      y,
      width,
      height
    );
  }

  drawImageButton(image, button) {
    this.drawContainedImage(image, button);
  }

  draw() {
    if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "credits") {
      this.drawCredits();
    } else if (this.state === "paused") {
      this.drawPause();
    } else if (this.state === "rhythmIntro") {
      this.drawRhythmIntro();
    } else if (this.state === "rhythm") {
      this.drawRhythm();
    } else {
      this.drawGame();
    }
  }

  drawPause() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (this.previousState === "rhythm") {
      this.drawRhythm();
    } else if (this.previousState === "rhythmIntro") {
      this.drawRhythmIntro();
    } else {
      this.drawGame();
    }

    context.fillStyle = "rgba(0, 0, 0, 0.65)";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (
      this.pauseImage.complete &&
      this.pauseImage.naturalWidth > 0
    ) {
      context.save();
      context.imageSmoothingEnabled = false;

      context.drawImage(
        this.pauseImage,
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.restore();
    } else {
      context.textAlign = "center";

      context.fillStyle = "#a6ff00";
      context.font = "bold 80px Arial";
      context.fillText("PAUSA", 640, 300);

      context.fillStyle = "#3de6ed";
      context.fillRect(
        340,
        405,
        600,
        140
      );

      context.fillStyle = "#8d00ed";
      context.font = "bold 44px Arial";
      context.fillText(
        "CONTINUAR",
        640,
        490
      );

      context.fillStyle = "#8d00ed";
      context.fillRect(
        340,
        555,
        600,
        135
      );

      context.fillStyle = "#3de6ed";
      context.fillText(
        "SALIR",
        640,
        640
      );

      context.textAlign = "start";
    }
  }

  drawMenu() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.drawBackground();

    this.drawContainedImage(this.logo, {
      x: 145,
      y: 30,
      width: 990,
      height: 390
    });

    this.drawImageButton(
      this.playImage,
      this.buttons.play
    );

    this.drawImageButton(
      this.creditsImage,
      this.buttons.credits
    );
  }

  drawCredits() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.drawBackground();

    context.textAlign = "center";
    context.fillStyle = "#a6ff00";
    context.font = "bold 48px Arial";

    context.fillText(
      "CREDITS",
      canvas.width / 2,
      75
    );

    this.drawContainedImage(this.studioLogo, {
      x: canvas.width / 2 - 150,
      y: 100,
      width: 300,
      height: 250
    });

    context.fillStyle = "#ffffff";
    context.font = "bold 27px Arial";

    context.fillText(
      "DOUBLE M STUDIO",
      canvas.width / 2,
      385
    );

    context.fillStyle = "#a6ff00";
    context.font = "bold 20px Arial";

    context.fillText(
      "DESARROLLO DEL VIDEOJUEGO",
      canvas.width / 2,
      425
    );

    context.fillStyle = "#c8c4d8";
    context.font = "20px Arial";

    context.fillText(
      "Desarrollado por",
      canvas.width / 2,
      465
    );

    context.fillStyle = "#ffffff";
    context.font = "bold 22px Arial";

    context.fillText(
      "Mariana A. Reyes",
      canvas.width / 2,
      505
    );

    context.fillText(
      "Oscar Michel Ortega Martinez",
      canvas.width / 2,
      540
    );

    context.fillStyle = "#a6ff00";
    context.font = "18px Arial";

    context.fillText(
      "ABDUCCIÓN DISCO",
      canvas.width / 2,
      585
    );

    this.drawBackButton();
    context.textAlign = "start";
  }

  drawBackButton() {
    const context = this.context;
    const button = this.buttons.back;

    context.fillStyle = "#ffffff";
    context.font = "20px Arial";
    context.textAlign = "left";

    context.fillText(
      "← BACK",
      button.x,
      button.y + 27
    );
  }

  drawGame() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    this.drawDuelRoom();

    this.alien.draw(context);
    this.player.draw(context);

    if (this.isNear(this.player, this.alien)) {
      context.fillStyle = "#ffffff";
      context.font = "20px Arial";
      context.textAlign = "center";

      context.fillText(
        "Presiona E para iniciar el duelo",
        canvas.width / 2,
        canvas.height - 45
      );

      context.textAlign = "start";
    }
  }

  drawRhythmIntro() {
    const context = this.context;

    this.drawDuelRoom();

    context.fillStyle = "rgba(5, 3, 22, 0.94)";
    context.fillRect(0, 0, 1280, 720);

    context.fillStyle = "#15112e";
    context.fillRect(340, 65, 600, 625);

    context.strokeStyle = "#8e45dc";
    context.lineWidth = 4;
    context.strokeRect(340, 65, 600, 625);

    context.textAlign = "center";
    context.fillStyle = "#a6ff00";
    context.font = "bold 32px Arial";
    context.fillText("TUTORIAL DE RITMO", 640, 115);

    context.fillStyle = "#ffffff";
    context.font = "19px Arial";
    context.fillText("Conoce las notas antes del duelo", 640, 150);

    context.save();
    context.shadowColor = "#b970ff";
    context.shadowBlur = 18;
    context.fillStyle = "#b970ff";
    context.beginPath();
    context.arc(410, 215, 24, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.fillStyle = "#ffffff";
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("CÍRCULO", 460, 209);

    context.font = "17px Arial";
    context.fillText("Un clic cuando toque la línea", 460, 235);

    context.save();
    context.shadowColor = "#ff2bd6";
    context.shadowBlur = 18;
    context.strokeStyle = "#ff2bd6";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(410, 320, 25, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.arc(410, 320, 14, 0, Math.PI * 2);
    context.stroke();
    context.restore();

    context.fillStyle = "#ffffff";
    context.font = "bold 20px Arial";
    context.fillText("CÍRCULO DOBLE", 460, 315);

    context.font = "17px Arial";
    context.fillText("Dos clics rápidos en la línea", 460, 341);

    this.drawTutorialStar(410, 420, 27);

    context.fillStyle = "#ffffff";
    context.font = "bold 20px Arial";
    context.fillText("ESTRELLA ESPECIAL", 460, 415);

    context.font = "17px Arial";
    context.fillText("Ralentiza la música al acertar", 460, 441);

    if (
      this.crossoutImage.complete &&
      this.crossoutImage.naturalWidth > 0
    ) {
      context.drawImage(
        this.crossoutImage,
        375,
        475,
        70,
        70
      );
    }

    context.fillStyle = "#ffffff";
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("TACHE / EQUIS", 460, 505);

    context.font = "17px Arial";
    context.fillText("No lo presiones: es una trampa", 460, 525);

    context.textAlign = "center";
    context.fillStyle = "#ffdc69";
    context.font = "16px Arial";
    context.fillText("3 errores seguidos = derrota", 640, 565);

    const button = this.buttons.begin;

    context.fillStyle = "#a6ff00";
    context.fillRect(button.x, button.y, button.width, button.height);

    context.fillStyle = "#101225";
    context.font = "bold 25px Arial";
    context.fillText("INICIAR DUELO", 640, 656);

    this.drawBackButton();
    context.textAlign = "start";
  }

  drawTutorialStar(centerX, centerY, radius) {
    const context = this.context;
    const spikes = 5;
    const innerRadius = radius * 0.45;
    let rotation = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(centerX, centerY - radius);

    for (let i = 0; i < spikes; i++) {
      context.lineTo(
        centerX + Math.cos(rotation) * radius,
        centerY + Math.sin(rotation) * radius
      );
      rotation += step;

      context.lineTo(
        centerX + Math.cos(rotation) * innerRadius,
        centerY + Math.sin(rotation) * innerRadius
      );
      rotation += step;
    }

    context.lineTo(centerX, centerY - radius);
    context.closePath();
    context.fillStyle = "#ffdc69";
    context.fill();
  }

  drawRhythm() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.fillStyle = "#101225";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.fillStyle = "#a6ff00";
    context.font = "bold 48px Arial";
    context.textAlign = "center";

    context.fillText(
      "JUEGO DE RITMO",
      canvas.width / 2,
      canvas.height / 2
    );

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";

    context.fillText(
      "Aquí comenzará el duelo musical",
      canvas.width / 2,
      canvas.height / 2 + 55
    );

    this.drawBackButton();
    context.textAlign = "start";
  }
}
