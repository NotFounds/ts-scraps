import { TOTP } from "./mod.ts";

//const totp = new TOTP("JBSWY3DPEHPK3PXP");
const totp = new TOTP("I65VU7K5ZQL7WB4E");

setInterval(async () => {
  console.log(await totp.generate());
}, 1000);
