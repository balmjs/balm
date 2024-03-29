import '@balm-core/types/index';

declare global {
  namespace NodeJS {
    interface Global {
      isWin: boolean;
      balm: any;
      expect: any;
      asyncCase: Function;
    }
  }

  var isWin: boolean;
  var balm: any;
  var expect: any;
  var asyncCase: Function;
}
