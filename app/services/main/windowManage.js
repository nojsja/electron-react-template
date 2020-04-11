const electron = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const viewConf = require('../../configure/view-conf');

class WindowManagement {
  constructor() {
    this.window = null;
  }

  sendToWeb(action, params) {
    this.window.webContents.send(action, params);
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
          pathname: '127.0.0.1:8888',
          protocol: 'http:',
          slashes: true,
        }));
      }, 1e3);
    } else if (env === 'electron-dev') {
      // electron develop tmp
      this.window.loadURL(url.format({
        pathname: path.resolve(app.getAppPath(), 'app', 'index.html'),
        protocol: 'file:',
        slashes: true,
      }));
      this.window.webContents.openDevTools();
    } else {
      // prod
      this.window.loadURL(url.format({
        pathname: path.resolve(app.getAppPath(), 'dist', 'index.html'),
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
      show: false,
      center: true,
      minWidth: 800,
      minHeight: 600,
      title: 'RhinoDisk',
      autoHideMenuBar: true,
      icon: path.join(app.getAppPath(), 'resources/icon.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    const splash = new BrowserWindow({
      width, height,
      transparent: false,
      frame: false,
      // alwaysOnTop: true,
      icon: path.join(app.getAppPath(), 'resources/icon.png'),
    });
    splash.loadURL(`file://${path.join(app.getAppPath(), '/resources/loading.splash.html')}`);
    
    this.window.once('ready-to-show', () => {
      splash.destroy();
      this.window.show();
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
