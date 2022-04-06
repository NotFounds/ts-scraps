import { assertEquals } from "https://deno.land/std@0.133.0/testing/asserts.ts";
import { TOTP } from "./mod.ts";

Deno.test({
  name: "TOTP.generate example of RFC6238",
  fn: async () => {
    const totp = new TOTP();

    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 59, 8), "94287082");
    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 1111111109, 8), "07081804");
    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 1111111111, 8), "14050471");
    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 1234567890, 8), "89005924");
    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 2000000000, 8), "69279037");
    assertEquals(await totp._generate({ asciiKey: "12345678901234567890" }, 20000000000, 8), "65353130");
  }
});

Deno.test({
  name: "TOTP.generate example",
  fn: async () => {
    const totp = new TOTP();

    assertEquals(await totp._generate({ base32Key: "JBSWY3DPEHPK3PXP" }, 0, 6), "282760");
  }
});
