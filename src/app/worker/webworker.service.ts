import { Injectable } from '@angular/core';

// Credits to: https://github.com/start-javascript/ngx-web-worker/blob/master/web-worker.ts

/**
 * <p><code>Service</code> that handles the <i>web worker</i> creation from the given input
 * <code>Function</code>. It also handles the execution and "<i>promisification</i>" of the
 * created web worker.</p>
 */
@Injectable({
  providedIn: 'root'
})
export class WebworkerService {
  // tslint:disable-next-line
  private workerFunctionToUrlMap = new WeakMap<Function, string>();
  private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();

  /**
   * <p>Method that runs the given function with the given data.</p>
   * @param workerFunction function to run on the web worker context.
   * @param data data to pass to the web worker context. <b>IMPORTANT</b>:
   * the function must be self-contained, meaning that no external functions or
   * libraries can be passed through this parameter.
   */
  public run<T>(workerFunction: (input: any) => T, data?: any): Promise<T> {
    const url = this.getOrCreateWorkerUrl(workerFunction);
    return this.runUrl(url, data);
  }

  /**
   * <p>Method that runs the given <i>ObjectURL</i> with the given data.</p>
   * @param url <i>ObjectURL</i> to run on the web worker context.
   * @param data data to pass to the web worker context. <b>IMPORTANT</b>:
   * the function must be self-contained, meaning that no external functions or
   * libraries can be passed through this parameter.
   */
  public runUrl(url: string, data?: any): Promise<any> {
    const worker = new Worker(url);
    const promise = this.createPromiseForWorker(worker, data);
    const promiseCleaner = this.createPromiseCleaner(promise);

    this.promiseToWorkerMap.set(promise, worker);

    promise.then(promiseCleaner).catch(promiseCleaner);

    return promise;
  }

  // tslint:disable
  /**
   * <p>Method that terminates the given <i>Promise</i> and removes it from the
   * internal service maps.</p>
   * @param promise promise to terminate.
   */
  public terminate<T>(promise: Promise<T>): Promise<T> {
    return this.removePromise(promise);
  }

  /**
   * <p>Method that retrieves the <i>web worker</i> to which the given <i>Promise</i>
   * belongs to.
   * @param promise promise whose <i>web worker</i> we want to find.
   */
  public getWorker(promise: Promise<any>): Worker {
    return this.promiseToWorkerMap.get(promise);
  }
  // tslint:enable

  /**
   * <p>Method that handles the promise creation for the given <i>web worker</i> with
   * the given input data.</p>
   * @param worker worker for which the promise will be created.
   * @param data data that will be passed into the worker object.
   */
  private createPromiseForWorker<T>(worker: Worker, data: any) {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener('message', (event) => resolve(event.data));
      worker.addEventListener('error', reject);
      worker.postMessage(data);
    });
  }

  // tslint:disable
  /**
   * <p>Method that allocates a <i>web worker</i> <i>ObjectURL</i> for the given function.
   * It's used to create caches for the <i>(function, workerUrl)</i> pairs in order to avoid
   * creating the urls more than once.</p>
   * @param fn function whose worker we want to allocate.
   */
  private getOrCreateWorkerUrl(fn: Function): string {
    if (!this.workerFunctionToUrlMap.has(fn)) {
      const url = this.createWorkerUrl(fn);
      this.workerFunctionToUrlMap.set(fn, url);
      return url;
    }
    return this.workerFunctionToUrlMap.get(fn);
  }

  /**
   * <p>Method that creates a <i>web worker</i> <i>ObjectURL</i> from the given
   * <i>Function</i> object.</p>
   * @param resolve function the <i>web worker</i> will run.
   */
  private createWorkerUrl(resolve: Function): string {
    const resolveString = resolve.toString();
    // The template is basically an addEventListener attachment that creates a
    // closure (IIFE*) with the provided function and invokes it with the provided
    // data.
    // * IIFE stands for immediately Immediately-Invoked Function Expression
    // Removed the postMessage from this template in order to allow worker functions
    // to use asynchronous functions and resolve whenever they need to.
    const webWorkerTemplate = `
            self.addEventListener('message', function(e) {
                ((${resolveString})(e.data));
            });
        `;
    const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
    return URL.createObjectURL(blob);
  }
  // tslint:enable

  /**
   * <p>Method that creates a function that removes the given promise from the
   * service context.</p>
   * @param promise promise the cleaner function will be created for.
   */
  private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
    return (event) => {
      this.removePromise(promise);
      return event;
    };
  }

  /**
   * <p>Method that removes the given promise from the service context.
   * It also terminates the associated worker in case it exists.</p>
   * @param promise promise to be removed from the service context.
   */
  private removePromise<T>(promise: Promise<T>): Promise<T> {
    const worker = this.promiseToWorkerMap.get(promise);
    if (worker) {
      worker.terminate();
    }
    this.promiseToWorkerMap.delete(promise);
    return promise;
  }
}
