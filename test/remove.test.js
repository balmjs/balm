// describe('Remove Task', () => {
//   beforeEach(() => balm.reset());
//
//   it('remove a file', done => {
//     balm.afterTask = () => {
//       fs.existsSync(`${workspace}/src/remove-me.txt`).should.be.false;
//     };
//     balm.go(mix => mix.remove('./src/remove-me.txt'));
//
//     runGulp(() => {
//       done();
//     });
//   });
// });
