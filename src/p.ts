import { Person, Target, Vector2 } from "./classes";

// Person
const screenSize = new Vector2(1000, 500);

function randomNormal(mean: number, standardDeviation: number) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return z0 * standardDeviation + mean;
}
class IndexedPerson extends Person {
  index: number;

  constructor(vector: Vector2, index: number) {
    super(vector);
    this.index = index;
  }
}

const giveTargets = (ambitiousRatio: number, N: number) => {
  const possessedPeople: IndexedPerson[] = [];
  let people: IndexedPerson[] = [];
  let targets: Target[] = [];

  for (let i = 0; i < N; i++) {
    const person = new IndexedPerson(
      new Vector2(Math.random() * screenSize.x, Math.random() * screenSize.y),
      i
    );

    people.push(person);
  }
  let r = randomNormal(0.2, 0.1);

  if (r < 0.1) r = 0.1;
  if (r > 1) r = 1;

  const targetCount = Math.floor(r * (N / ambitiousRatio));
  for (let i = 0; i < targetCount; i++) {
    const target = new Target(
      new Vector2(Math.random() * screenSize.x, Math.random() * screenSize.y)
    );

    targets.push(target);
  }

  while (targets.length > 0 && possessedPeople.length < N) {
    people.forEach((person) => person.tick(targets));
    targets = targets.filter((target) => !target.disabled);
    people = people.filter((person) => {
      if (person.possessed) {
        possessedPeople.push(person);
        return false;
      }
      return true;
    });
  }

  return possessedPeople.map((v) => v.index);
};

Person.speed = 5;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const calculateP = () => {
  const P = (ambitiousRatio: number) => {
    const T = 10;
    const N = 1000;

    const count = new Array(N).fill(0);
    for (let i = 0; i < T; i++) {
      const result = giveTargets(ambitiousRatio, N);
      result.forEach((i) => count[i]++);
    }
    return count.map((v) => v / T).reduce((prev, curr) => prev + curr, 0) / N;
  };

  for (let i = 0.001; i <= 1; i += 0.001) {
    console.log(`(${i}, ${P(i)})`);
  }
};

const P = (x: number) =>
  Math.min(
    -5.2161 * Math.pow(x, 4) +
      10.88 * Math.pow(x, 3) -
      6.4686 * Math.pow(x, 2) -
      0.07 * x +
      1.0281,
    1
  );
export { P };
