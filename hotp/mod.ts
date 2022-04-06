import { hmac } from "./deps.ts";

export class HOTP {
  static dynamicTruncate(HS: Uint8Array) {
    const offset = HS[19] & 0x0f;
    const P = HS.slice(offset, offset + 4)
                .reduce((acc, cur) => acc << 8 | (cur & 0xff), 0);
    return P & 0x7fffffff;
  }

  /**
   * @see https://tools.ietf.org/html/rfc4226
   * @param C 8-byte counter value, the moving factor.
   * @param K shared secret between client and server
   * @param digits number of digits in an HOTP value; system parameter.
   * @returns HOTP
   */
  static generate(C: Uint8Array, K: Uint8Array, digits = 6) {
    // Step 1: Generate an HMAC-SHA-1 value
    const HS = hmac("sha1", K, C) as Uint8Array; // HS is a 20-byte string

    // Step 2: Generate a 4-byte string (Dynamic Truncation)
    // Step 3: Compute an HOTP value
    return HOTP.dynamicTruncate(HS) % 10 ** digits;
  }
}
