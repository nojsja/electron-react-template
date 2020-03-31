const DataSet = require('./DataSet');
const userSchema = require('./schema/user.schema');
const api = require('../utils/api.js');
const { ipRequestEncoded, ipRequest } = require('../utils/request');

class User extends DataSet {
  constructor() {
    super('users', userSchema);
  }

  /**
    * autoLogin [自动登录]
    */
  autoLogin() {
    const lastUser = this.get('last.username');
    const userInfo = this.get('user', { username: lastUser });
    return new Promise((resolve, reject) => {
      global.ipcMainProcess.nodeModel.getDefaultNode().then((rsp) => {
        if (userInfo.auto && userInfo.pwd && rsp.code === 200) {
          userInfo.host = rsp.result;
          this.login(userInfo).then(resolve, reject);
        } else {
          reject({
            code: 404,
            result: false,
          });
        }
      }, () => {
        reject({
          code: 404,
          result: false,
        });
      });
    });
  }

  /**
    * login [登录]
    * @param  {[String]} host [目标机器]
    * @param  {[String]} username [用户名]
    * @param  {[String]} pwd [密码]
    */
  login({
    username, pwd, host = '', auto = false, memory = false,
  }) {
    // 发送请求查看密码是否正确
    const loginParams = {
      username,
      pwd,
      _ip: host,
    };

    const infoParams = {
      username,
      pwd,
      _ip: host,
    };

    let info = '';
    return new Promise((resolve, reject) => {
      ipRequestEncoded(loginParams, api.public.login).then((login_response) => {
        if (login_response.code === 200) {
          const { access_token } = login_response.result;
          ipRequestEncoded(infoParams, { ...api.public.info, ...{ 'access-token': access_token } }).then((info_response) => {
            if (info_response.code === 200) {
              info = info_response.result;

              this.update('user', { username }, {
                username,
                pwd,
                host,
                auto,
                memory,
              })
                .then(() => this.set('last.username', username))
                .then(() => {
                  global.ipcMainProcess.notifySend({
                    body: '登录成功！',
                  });
                  resolve({
                    code: info_response.code,
                    result: { ...info, ...{ access_token } },
                  });
                }).catch((error) => {
                  reject({
                    code: 600,
                    result: error,
                  });
                });
            } else {
              global.ipcMainProcess.notifySend({
                body: '登录失败！',
              });
              reject(info_response);
            }
          });
        } else {
          global.ipcMainProcess.notifySend({
            body: '登录失败！',
          });
          reject(login_response);
        }
      });
    });
  }

  /**
    * logout [登出]
    * @author nojsja
    * @param  {[String]} username [用户名]
    * @param  {[String]} pwd [密码]
    * @param  {[String]} host [主机]
    * @param  {[String]} auto [自动登录]
    * @param  {[String]} memory [记住密码]
    *
    */
  logout({ username, host = '' }) {
    return new Promise((resolve, reject) => {
      this.update('user', { username }, {
        username,
        pwd: '',
        host,
        auto: false,
        memory: false,
      }).then(() => {
        resolve({
          code: 200,
          result: {
            username,
          },
        });
        global.ipcMainProcess.notifySend({
          body: '登出成功！',
        });
      }).catch((error) => {
        global.ipcMainProcess.notifySend({
          body: '登出失败！',
        });
      });
    });
  }

  editPassword() {
    // infinityTokenRequest(req.body, publicApi.infinity.editPwd, req.headers).then((response) => {
    //   res.json(response);
    // });
  }

  getUserInfo({ username }) {
    return new Promise((resolve, reject) => {
      const userinfo = this.get('user', { username });
      resolve({
        code: 200,
        result: userinfo,
      });
    });
  }
}

module.exports = User;
