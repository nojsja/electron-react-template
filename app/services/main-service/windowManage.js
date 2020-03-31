const electron = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const viewConf = require('../../../app/configure/view-conf');

class WindowManagement {
  constructor() {
    this.window = null;
  }

  // 读取应用设置 //
  getAppConf() {
    let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize; // 硬件参数
    const viewInfo = viewConf.read(); // 用户配置文件

    if (!viewInfo.error && viewInfo.result.width && viewInfo.result.height) {
      width = viewInfo.result.width;
      height = viewInfo.result.height;
      // 存到内存中
      viewConf.set({
        width,
        height,
      });
    } else {
      width *= (3 / 6);
      height *= (4 / 6);
    }

    viewConf.set({
      width, height,
    });

    return {
      width,
      height,
    };
  }

  writeAppConf() {
    return viewConf.write();
  }

  // 根据运行环境加载窗口 //
  loadWindow(env) {
    if (env === 'development') {
    // wait for webpack-dev-server start
      setTimeout(() => {
        this.window.loadURL(url.format({
          pathname: 'localhost:3000',
          protocol: 'http:',
          slashes: true,
        }));
      // window.webContents.openDevTools();
      }, 1e3);
    } else {
      this.window.loadURL(url.format({
        pathname: path.resolve(process.cwd(), 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
      }));
    }
  }

  // main window //
  createWindow() {
    const { width, height } = this.getAppConf();
    this.window = new BrowserWindow({
      width,
      height,
      minWidth: 800,
      minHeight: 600,
      title: 'electronux',
      autoHideMenuBar: true,
      icon: path.join(process.cwd(), 'resources/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.window.on('resize', () => {
      const [_width, _height] = this.window.getContentSize();
      viewConf.set({
        width: _width,
        height: _height,
      });
    });

    this.loadWindow(global.nodeEnv);
  }
}

module.exports = WindowManagement;
