
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

    this.player = new Player(390, 430);

    this.alien = new Enemy(260, 410, "Alien");

    this.lastTime = 0;
    this.state = "menu";

    this.backgroundVideo = document.createElement("video");
    this.backgroundVideo.src = "./assets/space-background.mp4";
    this.backgroundVideo.loop = true;
    this.backgroundVideo.muted = true;
    this.backgroundVideo.playsInline = true;
    this.backgroundVideo.preload = "auto";
    this.backgroundVideo.load();
    this.backgroundVideo.play().catch(() => {});

    this.wasInteracting = false;

    this.buttons = {
      play: { x: 490, y: 450, width: 300, height: 100 },
      credits: { x: 490, y: 560, width: 300, height: 75 },
      back: { x: 35, y: 28, width: 115, height: 42 }
    };
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time) => {
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (this.state === "playing") {
      this.update(deltaTime);
    }

    this.draw();
    requestAnimationFrame(this.loop);
  };

  handleClick(x, y) {
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
    this.player.update(deltaTime, this.canvas);

    const interacting = this.player.wantsToInteract();
    const nearAlien = this.isNear(this.player, this.alien);

    if (interacting && !this.wasInteracting && nearAlien) {
      this.state = "rhythm";
    }

    this.wasInteracting = interacting;
  }

  isNear(player, target) {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    const dx = playerCenterX - targetCenterX;
    const dy = playerCenterY - targetCenterY;

    return Math.hypot(dx, dy) < 120;
  }

  drawBackground() {
    const context = this.context;
    const canvas = this.canvas;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

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
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawDuelRoom() {
    const context = this.context;
    const canvas = this.canvas;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (this.duelRoom.complete && this.duelRoom.naturalWidth > 0) {
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
    if (!image.complete || image.naturalWidth === 0) return;

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

  drawImageButton(image, button) {
    this.drawContainedImage(image, button);
  }

  draw() {
    if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "credits") {
      this.drawCredits();
    } else if (this.state === "rhythm") {
      this.drawRhythm();
    } else {
      this.drawGame();
    }
  }

  drawMenu() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBackground();

    this.drawContainedImage(this.logo, {
      x: 145,
      y: 30,
      width: 990,
      height: 390
    });

    this.drawImageButton(this.playImage, this.buttons.play);
    this.drawImageButton(this.creditsImage, this.buttons.credits);
  }

  drawCredits() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBackground();

    context.textAlign = "center";
    context.fillStyle = "#a6ff00";
    context.font = "bold 48px Arial";
    context.fillText("CREDITS", canvas.width / 2, 75);

    this.drawContainedImage(this.studioLogo, {
      x: canvas.width / 2 - 150,
      y: 100,
      width: 300,
      height: 250
    });

    context.fillStyle = "#ffffff";
    context.font = "bold 27px Arial";
    context.fillText("DOUBLE M STUDIO", canvas.width / 2, 385);

    context.fillStyle = "#a6ff00";
    context.font = "bold 20px Arial";
    context.fillText("DESARROLLO DEL VIDEOJUEGO", canvas.width / 2, 425);

    context.fillStyle = "#c8c4d8";
    context.font = "20px Arial";
    context.fillText("Desarrollado por", canvas.width / 2, 465);

    context.fillStyle = "#ffffff";
    context.font = "bold 22px Arial";
    context.fillText("Mariana A. Reyes", canvas.width / 2, 505);
    context.fillText("Oscar Michel Ortega Martinez", canvas.width / 2, 540);

    context.fillStyle = "#a6ff00";
    context.font = "18px Arial";
    context.fillText("ABDUCCIÓN DISCO", canvas.width / 2, 585);

    this.drawBackButton();
    context.textAlign = "start";
  }

  drawBackButton() {
    const context = this.context;
    const button = this.buttons.back;

    context.fillStyle = "#ffffff";
    context.font = "20px Arial";
    context.textAlign = "left";
    context.fillText("← BACK", button.x, button.y + 27);
  }

  drawGame() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
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

  drawRhythm() {
    const context = this.context;
    const canvas = this.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#101225";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#a6ff00";
    context.font = "bold 48px Arial";
    context.textAlign = "center";
    context.fillText("JUEGO DE RITMO", canvas.width / 2, canvas.height / 2);

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
