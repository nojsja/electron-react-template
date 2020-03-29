/**
* @name: notifySend
* @description: 桌面通知发送
*/

const { Notification } = require('electron');

function notifySend({
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

module.exports = notifySend;
