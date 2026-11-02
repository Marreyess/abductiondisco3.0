export class Enemy {
  constructor(x, y, name = "Alien") {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 150;
    this.name = name;

    this.image = new Image();
    this.image.src = "./assets/Alien/perfil_derecho.png";
  }

  draw(context) {
    if (!this.image.complete || this.image.naturalWidth === 0) return;

    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}