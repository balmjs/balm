import { http, callback } from './util';
import URL from './config';

export default {
  async getMenu() {
    return callback(
      await http.get(URL.base.getMenu).catch(err => {
        console.log(err);
      })
    );
  }
};
