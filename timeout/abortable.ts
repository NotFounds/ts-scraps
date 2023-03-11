async function heavyProcess() {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(() => r(undefined), 100));
    console.log(i);
  }
  return undefined;
}

function handleAborted() { Promise.reject(signal.reason); }
function makeAbortable<T>(promise: Promise<T>): (signal: AbortSignal) => Promise<T> {
  if (signal.aborted) handleAborted();
  return async (signal: AbortSignal) => {
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
  };
}

const signal = AbortSignal.timeout(1000);
await makeAbortable(heavyProcess())(signal);
