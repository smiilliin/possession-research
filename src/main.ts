import * as PIXI from "pixi.js";
import { Person, Target, Vector2 } from "./classes";

const app = new PIXI.Application({
  background: "#000000",
  resizeTo: document.body,
});

document.body.appendChild(app.view as HTMLCanvasElement);

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

class DrawablePerson extends Person {
  graphic: PIXI.Graphics;

  constructor(vector: Vector2, ambitious: boolean) {
    super(vector);

    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(ambitious ? 0xffffff : 0x555555);
    this.graphic.drawCircle(0, 0, 3);
    this.graphic.endFill();
    this.update();
  }
  possess() {
    super.possess();

    this.graphic.clear();
    this.graphic.beginFill(0xff1111);
    this.graphic.drawCircle(0, 0, 3);
    this.graphic.endFill();
  }
  update() {
    this.graphic.x = this.vector.x;
    this.graphic.y = this.vector.y;
  }
  tick(targets: Target[]) {
    super.tick(targets);
    this.update();
  }
}
class DrawableTarget extends Target {
  graphic: PIXI.Graphics;

  constructor(vector: Vector2) {
    super(vector);

    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(0x11ff11);
    this.graphic.drawCircle(0, 0, 3);
    this.graphic.endFill();
    this.update();
  }
  update() {
    this.graphic.x = this.vector.x;
    this.graphic.y = this.vector.y;

    if (this.disabled) {
      this.graphic.clear();
    }
  }
  disable() {
    super.disable();
    this.update();
  }
}

const view = new PIXI.Container();

const screenSize = new Vector2(1000, 500);

const box = new PIXI.Graphics();
box.lineStyle({ color: 0xffffff, width: 1 });
box.drawRect(0, 0, screenSize.x, screenSize.y);
view.addChild(box);

view.x = -screenSize.x / 2 + app.screen.width / 2;
view.y = -screenSize.y / 2 + app.screen.height / 2;

app.stage.addChild(view);

const dummyPeople: Person[] = [];
const people: Person[] = [];
let targets: Target[] = [];
const N = 100;
const ambitiousRatio = 0.5;

for (let i = 0; i < N * (1 - ambitiousRatio); i++) {
  const person = new DrawablePerson(
    new Vector2(Math.random() * screenSize.x, Math.random() * screenSize.y),
    false
  );
  view.addChild(person.graphic);

  dummyPeople.push(person);
}
for (let i = 0; i < N * ambitiousRatio; i++) {
  const person = new DrawablePerson(
    new Vector2(Math.random() * screenSize.x, Math.random() * screenSize.y),
    true
  );
  view.addChild(person.graphic);

  people.push(person);
}
// const r = Math.random() / 2;
function randomNormal(mean: number, standardDeviation: number) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return z0 * standardDeviation + mean;
}

let r = randomNormal(0.3, 0.2);

if (r < 0.1) r = 0.1;
if (r > 1) r = 1;
for (let i = 0; i < r * N; i++) {
  const target = new DrawableTarget(
    new Vector2(Math.random() * screenSize.x, Math.random() * screenSize.y)
  );
  view.addChild(target.graphic);

  targets.push(target);
}

app.ticker.add(() => {
  people.forEach((person) => person.tick(targets));
  targets = targets.filter((target) => !target.disabled);
});
