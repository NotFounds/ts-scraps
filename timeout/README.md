# timeout example

## Promise.race を用いたタイムアウト
`Promise.race` は複数のプロミスを受け取り、最初に決定したプロミスを返す関数。  
ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

[MDN の例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race#using_promise.race_to_implement_request_timeout)にあるように `setTimeout` と組み合わせて使うことでリクエストのタイムアウトを実装することができる。

```ts
function fetchWithTimeout1(url: string, timeout: number) {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(), timeout));
  return Promise.race([
    fetch(url),
    timeoutPromise.catch(() => { throw new Error("Timeout Error"); }),
  ]);
}

await fetchWithTimeout1("https://www.example.com/", 1000);
```

## AbortController
上の例では `Promise.race` を使ってリクエストタイムアウトを実装した。ぱっとみた感じリクエストが1秒以上かかる場合はエラーが吐かれるので良さそうに見える。  
しかし、実はタイムアウトされた場合でも fetch 自体が中断されるわけではなく Promise の処理自体は継続される。

例えば次のように書き換えるとタイムアウトしているのにも関わらず "complete" が出力され、処理が継続されていることがわかる。
```ts
function fetchWithTimeout1(url: string, timeout: number) {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(), timeout));
  return Promise.race([
    fetch(url).then(() => console.log("complete")),
    timeoutPromise.catch(() => { throw new Error("Timeout Error"); }),
  ]);
}

try {
  await fetchWithTimeout1("https://www.example.com/", 1);
} catch {
  console.log("timeout");
}
```

ここで `AbortController` と `AbortSignal` を使うことで、タイムアウト時は正しく処理を中断させつつもっとシンプルに実装することができる。  
`AbortController` はブラウザ向けの Web API として提案されたもので、はじめは DOM リクエストを中断するためのコントローラーオブジェクトとして実装された。  
その後 Node.js や Deno などの JavaScript Runtime にも実装された。  
ref. https://developer.mozilla.org/en-US/docs/Web/API/AbortController

`AbortSignal` は EventTarget を拡張したオブジェクトで、中断を受け取るために使われる。  

タイムアウトを実現するためには `AbortSignal.timeout` を使うと良い。
```ts
function fetchWithTimeout2(url: string, timeout: number) {
  const timeoutSignal = AbortSignal.timeout(timeout);
  return fetch(url, { signal: timeoutSignal });
}

await fetchWithTimeout2("https://www.example.com/", 1000);
```
