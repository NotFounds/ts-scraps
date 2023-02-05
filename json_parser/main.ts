import { MyJSON } from "./mod.ts";

const rawJson = `
{
  "foo": 42,
  "bar": null,
  "hoge": {
    "fuga": [true, false]
  }
}
`;

console.log(JSON.parse(rawJson))
console.log(MyJSON.parse(rawJson));

