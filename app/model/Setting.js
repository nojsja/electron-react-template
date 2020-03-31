const DataSet = require('./DataSet');
const settingSchema = require('./schema/setting.schema');
const api = require('../utils/api.js');
const { ipRequestEncoded, ipRequest } = require('../utils/request');

class Setting extends DataSet {
  constructor() {
    super('setting', settingSchema);
  }

  getSetting() {
    return new Promise((resolve, reject) => {
      const settings = this.getState();
      resolve({
        code: 200,
        result: settings
      });
    });
  }

  changeSetting(settings) {
    return new Promise((resolve, reject) => {
      this.setState(settings).then((result) => {
        resolve({
          code: 200,
          result
        });
      }, (err) => {
        reject(err);
      });
    })
  }
}

module.exports = Setting;