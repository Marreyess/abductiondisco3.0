import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.player = new Player(120, 120);

    this.enemies = [
      new Enemy(430, 270, "Alien"),
      new Enemy(850, 470, "Guardia")
    ];

    this.interactable = {
      x: 620,
      y: 300,
      width: 40,
      height: 40,
      name: "Panel de control",
      message: "El panel está encendido, pero necesitas averiguar cómo usarlo."
    };

    this.message = "";
    this.messageTimer = 0;
    this.wasInteracting = false;
    this.lastTime = 0;
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time) => {
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.loop);
  };

  update(deltaTime) {
    this.player.update(deltaTime, this.canvas);

    if (this.messageTimer > 0) {
      this.messageTimer -= deltaTime;

      if (this.messageTimer <= 0) {
        this.message = "";
      }
    }

    const nearObject = this.isNear(this.player, this.interactable);
    const nearbyEnemy = this.enemies.find((enemy) =>
      this.isNear(this.player, enemy)
    );

    const canInteract = nearObject || nearbyEnemy !== undefined;
    const interacting = this.player.wantsToInteract();

    if (interacting && !this.wasInteracting && canInteract) {
      if (nearObject) {
        this.showMessage(this.interactable.message);
      } else if (nearbyEnemy) {
        this.showMessage(`${nearbyEnemy.name}: ${nearbyEnemy.message}`);
      }
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

    return Math.hypot(dx, dy) < 90;
  }

  showMessage(message) {
    this.message = message;
    this.messageTimer = 3.5;
  }

  draw() {
    const context = this.context;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    context.fillStyle = "#101225";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    context.strokeStyle = "#252943";
    context.lineWidth = 3;
    context.strokeRect(35, 35, this.canvas.width - 70, this.canvas.height - 70);

    context.fillStyle = "#e5d7ff";
    context.font = "24px Arial";
    context.fillText("ÁREA CENTRAL", 60, 75);

    context.strokeStyle = "#70e1ff";
    context.lineWidth = 2;
    context.strokeRect(
      this.interactable.x,
      this.interactable.y,
      this.interactable.width,
      this.interactable.height
    );

    for (const enemy of this.enemies) {
      enemy.draw(context);
    }

    this.player.draw(context);

    const nearbyObject = this.isNear(this.player, this.interactable);
    const nearbyEnemy = this.enemies.some((enemy) =>
      this.isNear(this.player, enemy)
    );

    if (nearbyObject || nearbyEnemy) {
      context.fillStyle = "#ffffff";
      context.font = "18px Arial";
      context.fillText(
        "Presiona E para interactuar",
        60,
        this.canvas.height - 60
      );
    }

    if (this.message) {
      context.fillStyle = "rgba(5, 7, 20, 0.92)";
      context.fillRect(
        60,
        this.canvas.height - 150,
        this.canvas.width - 120,
        65
      );

      context.strokeStyle = "#70e1ff";
      context.strokeRect(
        60,
        this.canvas.height - 150,
        this.canvas.width - 120,
        65
      );

      context.fillStyle = "#ffffff";
      context.font = "20px Arial";
      context.fillText(
        this.message,
        80,
        this.canvas.height - 110,
        this.canvas.width - 160
      );
    }
  }
}