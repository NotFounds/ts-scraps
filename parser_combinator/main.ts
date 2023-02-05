import { ParserBase, Parser } from "./mod.ts";

type PingPong = "PING" | "PONG";
class PingPongParser extends ParserBase {
  public parse(): PingPong {
    const ret = this.parsePingPong()();
    if (ret._ === "Failure") throw `Syntax Error at position: ${ret.position}`;
    return ret.value;
  }

  private parsePingPong(): Parser<PingPong> {
    return this.map(
      this.and(
        this.or(
          this.ping(),
          this.pong(),
        ),
        this.eof(),
      ),
      ([val, _null]) => val
    );
  }

  private ping = () => this.atom("PING");
  private pong = () => this.atom("PONG");
}

const ping = new PingPongParser("PING").parse();
console.log(ping);

const pong = new PingPongParser("PONG").parse();
console.log(pong);

// raises error
try {
  new PingPongParser("Hello, World!").parse();
} catch (e) {
  console.error(e);
}
