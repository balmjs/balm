import '../types/index';
import { BalmConfig } from '../index';

interface BalmTest {
  config: Partial<BalmConfig>;
  beforeTask: string | Function | undefined;
  afterTask: string | Function | undefined;
  go: (recipe?: Function) => void;
  reset: Function;
}

declare global {
  namespace NodeJS {
    interface Global {
      isWin: boolean;
      balm: BalmTest;
      runTask: Function;
      expect: any;
      asyncCase: Function;
    }
  }

  var isWin: boolean;
  var balm: BalmTest;
  var runTask: Function;
  var expect: any;
  var asyncCase: Function;
}
