export class Enemy {
  constructor(x, y, name = "Alienígena") {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 48;
    this.name = name;
    this.message = "Parece que quiere decirte algo.";
    this.active = true;
  }

  draw(context) {
    context.save();
    context.strokeStyle = "#b9a0ff";
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.restore();
  }
}