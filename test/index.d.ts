import '../packages/balm-core/types/index';

declare global {
  namespace NodeJS {
    interface Global {
      isWin: boolean;
      balm: any;
      runTask: Function;
      expect: any;
      asyncCase: Function;
    }
  }

  var isWin: boolean;
  var balm: any;
  var runTask: Function;
  var expect: any;
  var asyncCase: Function;
}
