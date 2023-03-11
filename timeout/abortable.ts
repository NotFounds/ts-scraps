async function heavyProcess() {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(() => r(undefined), 100));
    console.log(i);
  }
  return undefined;
}

function handleAborted() { Promise.reject(signal.reason); }
async function abortablePromise<T>(promise: Promise<T>, signal: AbortSignal) {
  signal.addEventListener('abort', handleAborted, { once: true });
  try {
    const result = await promise;
    return Promise.resolve(result);
  }
  catch (e) {
    return Promise.reject(e);
  }
  finally {
    signal.removeEventListener('abort', handleAborted);
  }
}

const signal = AbortSignal.timeout(1000);
await abortablePromise(heavyProcess(), signal);
