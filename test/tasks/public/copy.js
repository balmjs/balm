import CopyTask from '../../../lib/tasks/public/copy';

describe('Copy Task', () => {
  it('copies a file to a new location', done => {
    let input = './src/copy/foo/foo.txt';
    let output = 'copy-dest';

    const task = new CopyTask(input, output);
    const test = `${output}/foo.txt`;

    runTask({
      task,
      test,
      done
    });
  });

  it('copies and renames a file to a new location', done => {
    let input = './src/copy/foo/foo.txt';
    let output = 'copy-dest';
    let options = {
      basename: 'changed'
    };

    const task = new CopyTask(input, output, options);
    const test = `${output}/changed.txt`;

    runTask({
      task,
      test,
      done
    });
  });

  it('copies an array of folder paths to a new location', done => {
    let input = ['./src/copy/foo/*', './src/copy/bar/*'];
    let output = 'copy-dest/foobar';

    const task = new CopyTask(input, output);
    const test = [`${output}/foo.txt`, `${output}/bar.txt`];

    runTask({
      task,
      test,
      done
    });
  });

  it('copies a folder with a period in its name to a new location', done => {
    let input = './src/copy/foo.bar/*';
    let output = 'copy-dest/some.dir';

    const task = new CopyTask(input, output);
    const test = `${output}/baz.txt`;

    runTask({
      task,
      test,
      done
    });
  });
});
