## json_parser

```ts
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

console.log(MyJSON.parse(rawJson));
```


