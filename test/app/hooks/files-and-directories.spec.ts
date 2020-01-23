import { cleanup, runTest } from '../test';

const targetDir = '.output';

describe('Balm Hooks - files & directories', function() {
  beforeEach(function() {
    balm.config = {
      useDefaults: false
    };
  });

  after(function() {
    cleanup();
  });

  it('copies a file to a new location', function(done) {
    const input = 'src/copy/foo/foo.txt';
    const output = `${targetDir}/copy-dest`;

    runTest(
      {
        testCase: `${output}/foo.txt`,
        testHook: (mix: any) => {
          mix.copy(input, output);
        }
      },
      done
    );
  });

  it('copies and renames a file to a new location', function(done) {
    const input = 'src/copy/foo/foo.txt';
    const output = `${targetDir}/copy-dest`;
    const rename = {
      basename: 'changed'
    };

    runTest(
      {
        testCase: `${output}/changed.txt`,
        testHook: (mix: any) => {
          mix.copy(input, output, {
            rename
          });
        }
      },
      done
    );
  });

  it('copies an array of folder paths to a new location', function(done) {
    const input = ['./src/copy/foo/*', './src/copy/bar/*'];
    const output = `${targetDir}/copy-dest/foobar`;

    runTest(
      {
        testCase: [`${output}/foo.txt`, `${output}/bar.txt`],
        testHook: (mix: any) => {
          mix.copy(input, output);
        }
      },
      done
    );
  });

  it('copies a folder with a period in its name to a new location', function(done) {
    const input = './src/copy/foo.bar/*';
    const output = `${targetDir}/copy-dest/some.dir`;

    runTest(
      {
        testCase: `${output}/baz.txt`,
        testHook: (mix: any) => {
          mix.copy(input, output);
        }
      },
      done
    );
  });

  it('remove a file', function(done) {
    const source = 'src/remove/remove-file.txt';
    const output = `${targetDir}/remove`;
    const input = `${output}/remove-file.txt`;

    runTest(
      {
        testCase: `${output}/remove-file.txt`,
        testHook: (mix: any) => {
          mix.copy(source, output);
          mix.remove(input);
        }
      },
      done,
      false
    );
  });

  it('remove files', function(done) {
    const source = 'src/remove/remove-folder/*';
    const output = `${targetDir}/remove/remove-folder`;
    const input = [`${output}/a.txt`, `${output}/b.txt`];

    runTest(
      {
        testCase: [`${output}/a.txt`, `${output}/b.txt`],
        testHook: (mix: any) => {
          mix.copy(source, output);
          mix.remove(input);
        }
      },
      done,
      false
    );
  });

  it('remove a folder', function(done) {
    const source = 'src/remove/remove-folder/*';
    const output = `${targetDir}/remove/remove-folder`;
    const input = output;

    runTest(
      {
        testCase: output,
        testHook: (mix: any) => {
          mix.copy(source, output);
          mix.remove(input);
        }
      },
      done,
      false
    );
  });
});
