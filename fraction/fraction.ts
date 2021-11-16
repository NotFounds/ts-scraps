/* eslint-disable no-dupe-class-members */
export class Fraction {
  public numerator: number;
  public denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error('Denominator cannot be zero');
    }
    this.numerator = numerator;
    this.denominator = denominator;
  }

  public toString(): string {
    return `${this.numerator} / ${this.denominator}`;
  }

  public toDecimal(): number {
    return this.numerator / this.denominator;
  }

  public toInteger(): number {
    return Math.floor(this.numerator / this.denominator);
  }

  public reduce(): Fraction {
    const g = Fraction.gcd(this.numerator, this.denominator);
    return new Fraction(this.numerator / g, this.denominator / g);
  }

  public isIrreducible(): boolean {
    return Fraction.gcd(this.numerator, this.denominator) === 1;
  }

  public isDivisible(): boolean {
    return this.numerator % this.denominator === 0;
  }

  public static add(l: Fraction, r: Fraction): Fraction;
  public static add(l: number, r: Fraction): Fraction;
  public static add(l: Fraction, r: number): Fraction;
  public static add(l: Fraction | number, r: Fraction | number): Fraction {
    if (typeof l !== 'number' && typeof r !== 'number') {
      return new Fraction(l.numerator * r.denominator + r.numerator * l.denominator, l.denominator * r.denominator).reduce();
    } else if (typeof l === 'number' && typeof r !== 'number') {
      return new Fraction(l * r.denominator + r.numerator, r.denominator).reduce();
    } else if (typeof l !== 'number'  && typeof r === 'number') {
      return new Fraction(l.numerator + r * l.denominator, l.denominator).reduce();
    }
    return new Fraction((l as number) + (r as number), 1);
  }

  public static sub(l: Fraction, r: Fraction): Fraction;
  public static sub(l: number, r: Fraction): Fraction;
  public static sub(l: Fraction, r: number): Fraction;
  public static sub(l: Fraction | number, r: Fraction | number): Fraction {
    if (typeof l !== 'number' && typeof r !== 'number') {
      return new Fraction(l.numerator * r.denominator - r.numerator * l.denominator, l.denominator * r.denominator).reduce();
    } else if (typeof l === 'number' && typeof r !== 'number') {
      return new Fraction(l * r.denominator - r.numerator, r.denominator).reduce();
    } else if (typeof l !== 'number'  && typeof r === 'number') {
      return new Fraction(l.numerator - r * l.denominator, l.denominator).reduce();
    }
    return new Fraction((l as number) - (r as number), 1);
  }

  public static mul(l: Fraction, r: Fraction): Fraction;
  public static mul(l: number, r: Fraction): Fraction;
  public static mul(l: Fraction, r: number): Fraction;
  public static mul(l: Fraction | number, r: Fraction | number): Fraction {
    if (typeof l !== 'number' && typeof r !== 'number') {
      return new Fraction(l.numerator * r.numerator, l.denominator * r.denominator).reduce();
    } else if (typeof l === 'number' && typeof r !== 'number') {
      return new Fraction(l * r.numerator, r.denominator).reduce();
    } else if (typeof l !== 'number'  && typeof r === 'number') {
      return new Fraction(l.numerator * r, l.denominator).reduce();
    }
    return new Fraction((l as number) * (r as number), 1);
  }

  public static div(l: Fraction, r: Fraction): Fraction;
  public static div(l: number, r: Fraction): Fraction;
  public static div(l: Fraction, r: number): Fraction;
  public static div(l: Fraction | number, r: Fraction | number): Fraction {
    if (typeof l !== 'number' && typeof r !== 'number') {
      return new Fraction(l.numerator * r.denominator, l.denominator * r.numerator).reduce();
    } else if (typeof l === 'number' && typeof r !== 'number') {
      return new Fraction(l * r.denominator, r.numerator).reduce();
    } else if (typeof l !== 'number'  && typeof r === 'number') {
      return new Fraction(l.numerator, l.denominator * r).reduce();
    }
    return new Fraction((l as number), (r as number)).reduce();
  }

  private static gcd(a: number, b: number): number {
    if (a < b) {
      return Fraction.gcd(b, a);
    } else if (b === 0) {
      return a;
    }
    return Fraction.gcd(b, a % b);
  }
}
