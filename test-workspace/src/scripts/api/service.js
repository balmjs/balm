import { http, callback } from './util';

class RestService {
  constructor(url) {
    this.url = url;
  }

  async create(data) {
    return callback(
      await http
        .post(this.url, {
          data
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  async delete(id) {
    return callback(
      await http.delete(`${this.url}/${id}`).catch(err => {
        console.log(err);
      })
    );
  }

  async update(id, data) {
    return callback(
      await http
        .put(`${this.url}/${id}`, {
          data
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  async getAll(params) {
    return callback(
      await http
        .get(this.url, {
          params
        })
        .catch(err => {
          console.log(err);
        })
    );
  }

  async getOne(id) {
    return callback(
      await http.get(`${this.url}/${id}`).catch(err => {
        console.log(err);
      })
    );
  }
}

export default RestService;
