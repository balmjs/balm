import { describe, it, expect } from 'vitest';
import { TaskDAG, FunctionTask, createDefaultConfig } from 'balm-core';

describe('Task DAG Subsystem', () => {
  it('should execute tasks in series', async () => {
    const dag = new TaskDAG();
    const sequence: string[] = [];
    const config = createDefaultConfig();

    dag.registerTask(new FunctionTask('first', () => { sequence.push('first'); }));
    dag.registerTask(new FunctionTask('second', () => { sequence.push('second'); }));
    dag.registerTask(new FunctionTask('third', () => { sequence.push('third'); }));

    await dag.runSeries(['first', 'second', 'third'], config);
    expect(sequence).toEqual(['first', 'second', 'third']);
  });

  it('should execute dependent tasks automatically before dependent', async () => {
    const dag = new TaskDAG();
    const log: string[] = [];
    const config = createDefaultConfig();

    dag.registerTask(new FunctionTask('prep', () => { log.push('prep'); }));
    dag.registerTask(new FunctionTask('main', () => { log.push('main'); }, ['prep']));

    await dag.executeTask('main', config);
    expect(log).toEqual(['prep', 'main']);
  });

  it('should propagate errors cleanly from failing tasks', async () => {
    const dag = new TaskDAG();
    const config = createDefaultConfig();

    dag.registerTask(new FunctionTask('failing', () => {
      throw new Error('Task Execution Error');
    }));

    await expect(dag.executeTask('failing', config)).rejects.toThrow('Task Execution Error');
  });
});
