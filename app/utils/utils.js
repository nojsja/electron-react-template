const { Notification } = require('electron');
const fs = require('fs');
const path = require('path');

/**
* @name: jsonstr2Object
* @description: 去除shell返回的json字符串内容的最后一个','符号，并转化成对象
*/
exports.jsonstr2Object = function (_str) {
  let str = _str;

  try {
    str = str.substr(0, (str.length - 1));
    str = `{${str}}`;
    str = JSON.parse(str);
  } catch (e) {
    str = '{}';
    console.error(e);
  }

  return str;
}

/**
* @name: notifySend
* @description: 桌面通知发送
*/
exports.notifySend = function ({
  title, body, icon, delay,
}) {
  const notify = new Notification({
    title,
    body,
    icon,
  });

  if (delay) {
    setTimeout(() => {
      notify.show();
    }, delay);
  } else {
    notify.show();
  }
}

/**
  * checkEnvFiles [检查环境文件是否存在]
  * @author nojsja
  * @return {[type]} param [desc]
  */
exports.checkEnvFiles = function() {
  const pathRuntime = path.join(process.cwd(), 'app/runtime/');
  const check = function(_path, isDir) {
    if (!fs.existsSync(_path)) {
      if (isDir) {
        fs.mkdirSync(_path);
      } else {
        fs.closeSync(fs.openSync(_path, 'w'));
      }
    }
  };
  [
    { _path: pathRuntime, isDir: true },
    { _path: path.join(pathRuntime, 'view.conf'), isDir: false },
    { _path: path.join(pathRuntime, 'database/'), isDir: true },
    { _path: path.join(pathRuntime, 'database/hosts.json'), isDir: false },
    { _path: path.join(pathRuntime, 'database/users.json'), isDir: false },
    { _path: path.join(pathRuntime, 'database/uploads.json'), isDir: false }
  ].forEach(({_path, isDir}) => {
    check(_path, isDir);
  });
}


/**
  * templateStrTranform [模板字符串转换]
  * params1: {bucket: testBucket, uid: testUid, bucketId: testID}
  * params2: /admin/bucket?format=json&bucket={bucket}&uid={uid}&bucket-id={bucketId}
  * return: /admin/bucket?format=json&bucket=testBucket&uid=testUid&bucket-id=testID
  * 
  * @author nojsja
  * @param  {[Object]} varObj [替换变量对象]
  * @param {[String]} templateStr [模板字符串]
  * @return {[String]} result [模板字符串]
  */
 exports.templateStrTransform = (varObj, templateStr) => {
  if (typeof varObj !== 'object' || !templateStr) return templateStr;
  for (const attr in varObj) {
    if (varObj.hasOwnProperty(attr)) {
      templateStr = templateStr.replace(new RegExp(`{${attr}}`, 'g'), varObj[attr]);
    }
  }
  return templateStr;
};

