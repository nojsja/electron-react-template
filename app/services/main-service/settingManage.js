const SettingModel = require('../../model/Setting');

function settingManage(ipc) {
  const settingModel = new SettingModel();
  ipc.on('setting', function(event = {}, args = {}) {
    const { action, params } = args;
    settingModel[action](params).then((result) => {
      event.reply('setting-reply', {
        action: action,
        data: result,
      });
    }, (result) => {
      event.reply('setting-reply', {
        action: action,
        data: result,
      });
    });
  }); 
  return settingModel;
}

module.exports = settingManage;