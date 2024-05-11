class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  distance(vector: Vector2) {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2)
    );
  }
  add(vector: Vector2) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }
  subtract(vector: Vector2) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }
  mul(x: number) {
    return new Vector2(this.x * x, this.y * x);
  }
  normalize() {
    const distance = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new Vector2(this.x / distance, this.y / distance);
  }
  sign() {
    return new Vector2(Math.sign(this.x), Math.sign(this.y));
  }
}
class Person {
  vector: Vector2;
  currentTarget: Target | null;
  moveVector: Vector2;
  possessed: boolean;
  static speed = 2;

  constructor(vector: Vector2) {
    this.vector = vector;
    this.currentTarget = null;
    this.moveVector = new Vector2(0, 0);
    this.possessed = false;
  }
  possess() {
    this.possessed = true;
  }
  tick(targets: Target[]) {
    if (this.currentTarget?.disabled) this.currentTarget = null;

    if (this.currentTarget == null && !this.possessed) {
      const { target } = targets.reduce<{
        distance: number;
        target: Target | null;
      }>(
        (prev, curr) => {
          if (curr.disabled) return prev;

          const distance = curr.vector.distance(this.vector);
          if (distance < prev.distance) {
            return { distance: distance, target: curr };
          }
          return prev;
        },
        { distance: Number.MAX_VALUE, target: null }
      );

      if (target) {
        this.currentTarget = target;
        this.moveVector = new Vector2(
          target.vector.x - this.vector.x,
          target.vector.y - this.vector.y
        );
        this.moveVector = this.moveVector.normalize();
      }
    }

    if (this.currentTarget) {
      this.vector = this.vector.add(this.moveVector.mul(Person.speed));
      const sign = this.moveVector.sign();
      const distanceVector = this.currentTarget.vector.subtract(this.vector);

      if (distanceVector.x * sign.x < 0 && distanceVector.y * sign.y < 0) {
        this.currentTarget.disable();
        this.currentTarget = null;
        this.possess();
      }
    }
  }
}
class Target {
  vector: Vector2;
  disabled: boolean;

  constructor(vector: Vector2) {
    this.vector = vector;
    this.disabled = false;
  }
  disable() {
    this.disabled = true;
  }
}
export { Person, Target, Vector2 };
