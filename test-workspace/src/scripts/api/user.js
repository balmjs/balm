import URL from './config';
import RestService from './service';
import { http, callback } from './util';

class UserService extends RestService {
  constructor() {
    super(URL.user.user);
  }

  async getAllUsers() {
    return callback(
      await http.get(URL.user.getList).catch(err => {
        console.log(err);
      })
    );
  }
}

export default new UserService();
