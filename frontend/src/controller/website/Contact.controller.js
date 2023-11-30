import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";

const api = new RestApiClient();

class Contact {
  static async list() {
    return new Promise((resolve, reject) => {
      api
        .get(apiUrls.website.contact.index)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async get(id) {
    return api.get(apiUrls.website.contact.get(id));
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      api
        .post(apiUrls.website.contact.create, data)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static async update(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      api
        .put(apiUrls.website.contact.update(data.id), data)
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To delete a contact id is required" });
      api
        .delete(apiUrls.website.contact.delete(id))
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }
}

export default Contact;
