// These functions are defined here:
// https://github.com/Microsoft/TypeScript/blob/master/lib/lib.webworker.d.ts
// However, they're not automatically included over lib.d.ts, so we have to
// declare them manually.
declare function postMessage(message: any): void;

export const FACTORIAL_SCRIPT = (input) => {
  const factorial = (input: number, partialResult: number) => {
    if (input === 0 || input === 1) {
      return partialResult;
    } else {
      return factorial(input - 1, partialResult * input);
    }
  };

  const runnerResult = {
    executions: 0,
    results: [],
    time: 0
  };

  const startTime = Date.now();
  for (let execution = 1; execution <= input.maxFactorial; execution++) {
    const result = factorial(execution, 1);
    runnerResult.executions++;
    runnerResult.results.push({ number: execution, result });
  }

  // Force slow the execution
  let x = 0;
  while (x < 1000000000) {
    x++;
  }

  const endTime = Date.now();
  runnerResult.time = (endTime - startTime) / 1000;

  if (input.worker) {
    postMessage(runnerResult);
  } else {
    return runnerResult;
  }
};
