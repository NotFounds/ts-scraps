import { HOTP } from "../hotp/mod.ts";

export class TOTP {
  private T0: number;
  private X: number;
  private K: string;

  constructor(K = "", T0 = 0, X = 30) {
    this.K = K;
    this.T0 = T0;
    this.X = X;

    if (this.X <= 0) {
      throw Error("X must be greater than 0");
    }
  }

  private static integerToBytes(integer: number): Uint8Array {
    const bytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      bytes[i] = integer & 0xff;
      integer >>= 8;
    }
    return bytes.reverse();
  }

  /**
   * This generates a TOTP code for the given set parameters (using HMAC-SHA-1).
   * @param key the shared secret
   * @param time a value that reflects a time
   * @param digits number of digits to return
   * @returns a numeric String in base 10 that includes `digits` digits
   */
  async _generate(key: string, time: number, digits: number) {
    const T = Math.floor((time - this.T0) / this.X);

    const encodedT = TOTP.integerToBytes(T);
    const encodedKey = new TextEncoder().encode(key);
    return await HOTP.generate(encodedT, encodedKey, digits);
  }

  async generate(digits = 6) {
    return await this._generate(this.K, new Date().getTime() / 1000, digits);
  }
}
