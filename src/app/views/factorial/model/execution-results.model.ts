import { ResultsModel } from './results.model';

export class ExecutionResultsModel {
  constructor(
    public executionResults: ResultsModel[],
    public executions: number,
    public executionTime: number,
    public scheduleTime: number) {}
}
