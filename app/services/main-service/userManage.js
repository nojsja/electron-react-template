const UserModel = require('../../model/User');

function userManage(ipc) {
  const userModel = new UserModel();
  ipc.on('user', (event = {}, args = {}) => {
    const { action, params } = args;
    userModel[action](params).then((result) => {
      event.reply('user-reply', {
        action,
        data: result,
      });
    }, (result) => {
      event.reply('user-reply', {
        action,
        data: result,
      });
    });
  });
  return userModel;
}

module.exports = userManage;
