// describe('Remove Task', () => {
//   beforeEach(() => balm.reset());
//
//   it('remove a file', done => {
//     balm.afterTask = () => {
//       fs.existsSync(`${workspace}/src/remove/remove-file.txt`).should.be.false;
//     };
//     balm.go(mix => mix.remove('./src/remove/remove-file.txt'));
//
//     runGulp(() => {
//       done();
//     });
//   });
//
//   it('remove files', done => {
//     balm.afterTask = () => {
//       fs.existsSync(`${workspace}/src/remove/remove-folder/a.txt`).should.be.false;
//       fs.existsSync(`${workspace}/src/remove/remove-folder/b.txt`).should.be.false;
//     };
//
//     let input = ['./src/remove/remove-folder/a.txt', './src/remove/remove-folder/b.txt'];
//     balm.go(mix => mix.remove(input));
//
//     runGulp(() => {
//       done();
//     });
//   });
//
//   // it('remove a folder', done => {
//   //   balm.afterTask = () => {
//   //     fs.existsSync(`${workspace}/src/remove/remove-folder`).should.be.false;
//   //   };
//   //   balm.go(mix => mix.remove('./src/remove/remove-folder'));
//   //
//   //   runGulp(() => {
//   //     done();
//   //   });
//   // });
// });
