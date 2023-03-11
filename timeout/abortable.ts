async function heavyProcess(signal: AbortSignal) {
  signal.addEventListener('abort', () => Promise.reject(signal.reason), { once: true });

  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(() => r(undefined), 100));
    console.log(i);
  }
  Promise.resolve(undefined);
}

const signal = AbortSignal.timeout(1000);
await heavyProcess(signal);
