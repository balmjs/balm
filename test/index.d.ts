import '../types';

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

  const isWin: boolean;
  const balm: any;
  const runTask: Function;
  const expect: any;
  const asyncCase: Function;
}
