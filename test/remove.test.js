// describe('Remove Task', () => {
//   beforeEach(() => balm.reset());

//   it('remove a file', done => {
//     balm.afterTask = () => {
//       fs.existsSync(`${workspace}/src/remove-file.txt`).should.be.false;
//     };
//     balm.go(mix => mix.remove('./src/remove-file.txt'));

//     runGulp(() => {
//       done();
//     });
//   });

//   it('remove a folder', done => {
//     balm.afterTask = () => {
//       fs.existsSync(`${workspace}/src/remove-folder`).should.be.false;
//     };
//     balm.go(mix => mix.remove('./src/remove-folder'));

//     runGulp(() => {
//       done();
//     });
//   });
// });
