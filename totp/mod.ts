import { HOTP } from "../hotp/mod.ts";
import { base32Decode } from "./deps.ts";

export class TOTP {
  private T0: number;
  private X: number;

  constructor(T0 = 0, X = 30) {
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
   * @param key the shared secret(asciiKey or base32Key)
   * @param time a value that reflects a time
   * @param digits number of digits to return
   * @returns a numeric String in base 10 that includes `digits` digits
   */
  async _generate(key: { asciiKey?: string; base32Key?: string; }, time: number, digits: number) {
    let encodedKey: Uint8Array;
    if (key.asciiKey !== undefined) {
      encodedKey = new TextEncoder().encode(key.asciiKey);
    } else if (key.base32Key !== undefined) {
      encodedKey = base32Decode(key.base32Key);
    } else {
      throw Error("asciiKey or base32Key must be provided");
    }

    const T = Math.floor((time - this.T0) / this.X);
    const encodedT = TOTP.integerToBytes(T);
    return await HOTP.generate(encodedT, encodedKey, digits);
  }

  async generateByAsciiSecret(secret: string, digits = 6) {
    return await this._generate({ asciiKey: secret }, new Date().getTime() / 1000, digits);
  }

  async generateByBase64Secret(secret: string, digits = 6) {
    return await this._generate({ base32Key: secret }, new Date().getTime() / 1000, digits);
  }
}
