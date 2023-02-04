import { MyJSON, Tokenizer } from "./mod.ts";

const rawJson = `
{
  "foo": 42,
  "bar": null,
  "hoge": {
    "fuga": [true, false]
  }
}
`;

//const tokenizer = new Tokenizer(rawJson);
//const generator = tokenizer.tokenize();
//
//for (const t of generator) {
//  console.log(t);
//}

console.log(JSON.parse(rawJson))
console.log(MyJSON.parse(rawJson));

