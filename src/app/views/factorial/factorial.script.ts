// These functions are defined here:
// https://github.com/Microsoft/TypeScript/blob/master/lib/lib.webworker.d.ts
// Easiest way to be able to use the Web workers API on our TypeScript files is to declare
// the specific API functions we want to use according to:
// https://github.com/Microsoft/TypeScript/issues/20595#issuecomment-351030256
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
