import { Fraction } from "./fraction.ts";

const a = new Fraction(1, 2);
const b = new Fraction(2, 3);

// 1 / 3
console.log(Fraction.mul(a, b).reduce().toString());

