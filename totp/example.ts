import { TOTP } from "./mod.ts";

const totp = new TOTP();

setInterval(async () => {
  console.log(await totp.generateByBase64Secret("JBSWY3DPEHPK3PXP"));
}, 1000);
