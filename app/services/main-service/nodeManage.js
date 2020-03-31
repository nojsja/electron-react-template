const NodeModel = require('../../model/Node');

function nodeManage(ipc) {
  const nodeModel = new NodeModel();
  ipc.on('node', function(event = {}, args = {}) {
    const { action, params } = args;
    nodeModel[action](params).then((result) => {
      event.reply('node-reply', {
        action: action,
        data: result,
      });
    }, (result) => {
      event.reply('node-reply', {
        action: action,
        data: result,
      });
    });
  }); 
  return nodeModel;
}

module.exports = nodeManage;