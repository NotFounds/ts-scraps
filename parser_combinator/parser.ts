// https://blog.livewing.net/typescript-parser-combinator をもとに parser_combinator を作ってみる

import { Scanner } from "./scanner.ts";

export type ParseSuccess<T> = {
  _: "Success";
  value: T;
  position: number;
};
export type ParseFailure = {
  _: "Failure";
  position: number;
};
export type ParseResult<T> = Readonly<ParseSuccess<T> | ParseFailure>;
export type ParseResultType<T> = T extends Parser<infer U> ? U : never;
export type Parser<T> = () => ParseResult<T>;

type EOF = null;

export abstract class ParserBase {
  #sc: Scanner;
  constructor(readonly input: string) {
    this.#sc = new Scanner(input);
  }

  public abstract parse(): unknown;

  protected eof(): Parser<EOF> {
    return () => {
      const pos = this.#sc.cursor();
      const ch = this.#sc.peek();
      if (ch === undefined) {
        return {
          _: "Success",
          value: null,
          position: pos,
        };
      }
      return {
        _: "Failure",
        position: pos,
      };
    };
  }

  protected any(): Parser<string> {
    return () => {
      const pos = this.#sc.cursor();
      const ch = this.#sc.read();
      return {
        _: "Success",
        value: ch,
        position: pos,
      };
    };
  }

  protected char<T extends string>(c: T): Parser<T> {
    return () => {
      const pos = this.#sc.cursor();
      const ch = this.#sc.read();
      if (ch === c) {
        return {
          _: "Success",
          value: c,
          position: pos,
        };
      }

      return {
        _: "Failure",
        position: pos,
      }
    };
  }

  protected atom<T extends string>(str: T): Parser<T> {
    return () => {
      const res = this.and(...[...str].map((c) => this.char(c)))();
      if (res._ === "Failure") return res;

      return {
        _: "Success",
        value: str,
        position: res.position,
      };
    };
  }

  protected or<T>(...parsers: Parser<T>[]): Parser<T> {
    return () => {
      const pos = this.#sc.cursor();
      for (const parser of parsers) {
        const res = parser();
        if (res._ === "Success") return res;
        this.#sc.rollback(pos);
      }
      return {
        _: "Failure",
        position: pos,
      };
    };
  }

  protected and<T extends Parser<unknown>[]>(...parsers: T): Parser<{ [K in keyof T]: ParseResultType<T[K]> }> {
    return () => {
      const pos = this.#sc.cursor();
      const res: { [K in keyof T]: ParseResultType<T[K]>; } = [] as any;

      for (const k in parsers) {
        const r = parsers[k]();
        if (r._ === "Failure") return r;
        res[k] = r.value;
      }

      return {
        _: "Success",
        value: res,
        position: pos,
      };
    };
  }

  protected map<T, U>(parser: Parser<T>, fn: (v: T) => U): Parser<U> {
    return () => {
      const res = parser();
      if (res._ === "Success") {
        return {
          ...res,
          value: fn(res.value),
        };
      }

      return {
        _: "Failure",
        position: res.position,
      };
    };
  }
}
