export class MyJSON {
  static parse(text: string) {
    return new JSONParser(text).parse();
  }
}

class JSONParser {
  #generator: Generator<TokenizerResult>;
  constructor(text: string) {
    this.#generator = new Tokenizer(text).tokenize();
  }

  private getNext(): TokenizerResult {
    const { value: token, done} = this.#generator.next();
    if (done) throw Error("Unexpected END of JSON input");
    return token;
  }

  parse() {
    return this.parseJSON(this.getNext());
  }

  private parseJSON(token: TokenizerResult): JSONValue {
    switch (token.type) {
      case JSONToken.OpenBrace:
        return this.parseObject();
      case JSONToken.OpenBracket:
        return this.parseArray();
      case JSONToken.String:
        return token.value;
      case JSONToken.Number:
        return token.value;
      case JSONToken.Null:
        return null;
      case JSONToken.True:
        return true;
      case JSONToken.False:
        return false;
    }
    throw Error("Syntax error");
  }

  private parseObject(): JSONValue {
    const result: { [key: string]: JSONValue; } = {};
    let isFirst = true;
    while (true) {
      const t1 = this.getNext();
      if (t1.type === JSONToken.CloseBrace) break;
      if (!isFirst && t1.type === JSONToken.Comma) continue;
      isFirst = false;

      if (t1.type !== JSONToken.String) {
        throw new Error(`Unexpected token: expected "String" but got "${t1.type}"`);
      }

      const t2 = this.getNext();
      if (t2.type !== JSONToken.Colon) {
        throw new Error(`Unexpected token: expected "Colon" but got "${t1.type}"`);
      }

      result[t1.value] = this.parseJSON(this.getNext());
    }

    return result;
  }

  private parseArray(): JSONValue {
    const result: Array<JSONValue> = [];
    let isFirst = true;
    while (true) {
      const t1 = this.getNext();
      if (t1.type === JSONToken.CloseBracket) break;
      if (!isFirst && t1.type === JSONToken.Comma) continue;
      isFirst = false;

      result.push(this.parseJSON(t1));
    }

    return result;
  }
}

type JSONValue =
  | { [key: string]: JSONValue }
  | Array<JSONValue>
  | string
  | number
  | true
  | false
  | null;

const WhitespaceToken = new Set([..."\r\n\t "]);
const EndOfNumberToken = new Set([...",:{}[]", ...WhitespaceToken]);
const NumberPattern = /[+-]?\d+(\.\d+)?/;

enum JSONToken {
  Unknown = "Unknown",
  OpenBrace = "OpenBrace",
  CloseBrace = "CloseBrace",
  OpenBracket = "OpenBracket",
  CloseBracket = "CloseBracket",
  Colon = "Colon",
  Comma = "Comma",
  Number = "Number",
  String = "String",
  Null = "Null",
  True = "True",
  False = "False",
}

type SymbolToken = {
  type: Exclude<JSONToken, JSONToken.Number | JSONToken.String | JSONToken.Unknown | JSONToken.Null | JSONToken.True | JSONToken.False>;
  position: number;
};
type ValueToken = {
  type: JSONToken.Number;
  value: number;
  raw: string;
  position: number;
} | {
  type: JSONToken.String;
  value: string;
  raw: string;
  position: number;
};
type NullOrTrueOrFalseToken = {
  type: JSONToken.Null | JSONToken.True | JSONToken.False;
  raw: string;
  position: number;
}
type ErrorToken = {
  type: JSONToken.Unknown;
  raw: string;
  position: number;
  message?: string;
}
type TokenizerResult = SymbolToken | ValueToken | NullOrTrueOrFalseToken | ErrorToken;

export class Tokenizer {
  #text: string;

  constructor(text: string) {
    this.#text = text;
  }

  *tokenize(): Generator<TokenizerResult> {
    const len = this.#text.length;
    for (let i = 0; i < len; i++) {
      if (WhitespaceToken.has(this.#text[i])) continue;

      switch (this.#text[i]) {
        case '{':
          yield { type: JSONToken.OpenBrace, position: i };
          continue;
        case '}':
          yield { type: JSONToken.CloseBrace, position: i };
          continue;
        case '[':
          yield { type: JSONToken.OpenBracket, position: i };
          continue;
        case ']':
          yield { type: JSONToken.CloseBracket, position: i };
          continue;
        case ':':
          yield { type: JSONToken.Colon, position: i };
          continue;
        case ',':
          yield { type: JSONToken.Comma, position: i };
          continue;
        case '"': {
          const pos = i++;
          while (i < len && this.#text[i] !== '"') i++;
          yield {
            type: JSONToken.String,
            position: pos,
            value: this.#text.substring(pos + 1, i),
            raw: this.#text.substring(pos, i + 1),
          };
          continue;
        }
      }

      const pos = i;
      while (i + 1 < len && !EndOfNumberToken.has(this.#text[i + 1])) i++

      const term = this.#text.substring(pos, i + 1);
      switch (true) {
        case term === "null":
          yield { type: JSONToken.Null, position: i, raw: term };
          continue;
        case term === "true":
          yield { type: JSONToken.True, position: i, raw: term };
          continue;
        case term === "false":
          yield { type: JSONToken.False, position: i, raw: term };
          continue;
        case NumberPattern.test(term): {
          const val = Number(term);
          if (Number.isNaN(term) || !Number.isFinite(val)) {
            return {
              type: JSONToken.Unknown,
              position: pos,
              raw: term,
              message: "Cannot parse as number.",
            };
          }

          yield { type: JSONToken.Number, position: i, value: val, raw: term };
          continue;
        }
      }

      return {
        type: JSONToken.Unknown,
        position: pos,
        raw: term,
      };
    }
  }
}
