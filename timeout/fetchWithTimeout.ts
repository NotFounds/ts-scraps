function fetchWithTimeout1(url: string, timeout: number) {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(), timeout));
  return Promise.race([
    fetch(url),
    timeoutPromise.catch(() => { throw new Error("Timeout Error"); }),
  ]);
}

function fetchWithTimeout2(url: string, timeout: number) {
  const timeoutSignal = AbortSignal.timeout(timeout);
  return fetch(url, { signal: timeoutSignal });
}

await fetchWithTimeout1("https://www.example.com/", 1000);
await fetchWithTimeout2("https://www.example.com/", 1000);
