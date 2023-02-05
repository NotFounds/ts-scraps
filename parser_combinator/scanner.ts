export class Scanner {
  #text: string;
  #length: number;
  #i: number;
  constructor(readonly input: string) {
    this.#text = input;
    this.#length = input.length;
    this.#i = 0;
  }

  public peek(): string | undefined {
    if (this.#i >= this.#length) return undefined;
    return this.#text[this.#i];
  }

  public read(): string {
    if (this.#i >= this.#length) throw Error("Unexpected END of input");
    return this.#text[this.#i++];
  }

  public reset(): void {
    this.#i = 0;
  }

  public cursor(): number {
    return this.#i;
  }

  public rollback(idx: number): void {
    if (idx < 0 || idx >= this.#length) return;
    this.#i = idx;
  }

  public close(): Scanner {
    return structuredClone(this);
  }
}
