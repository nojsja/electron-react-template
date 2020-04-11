const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

/* ------------------- self module ------------------- */
global.pathLocator = require('./app/utils/path-locator.js');
const requireLang = require('./app/lang');
const IpcMainClass = require('./app/services/main/');
const IpcMaiWindowClass = require('./app/services/main/windowManage');
const { readFileSync } = require('./app/utils/write-file');


/* ------------------- var ------------------- */
const nodeEnv = process.env.NODE_ENV;
global.nodeEnv = process.env.NODE_ENV;

/* ------------------- middleware ------------------- */
const { result, error } = readFileSync(path.join(app.getAppPath(), 'app/runtime/database/setting.json'), true);
requireLang(result.lang);

/* ------------------- ipcMain ------------------- */
global.ipcMainProcess = new IpcMainClass(ipcMain);
global.ipcMainWindow = new IpcMaiWindowClass();

/* ------------------- func  ------------------- */

/* ------------------- electron event ------------------- */

app.on('ready', () => {
  if (nodeEnv === 'development') {
    require('source-map-support').install();
  }
  global.ipcMainWindow.createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  global.ipcMainWindow.writeAppConf().then(() => 0, (err) => {
    console.error(err);
    throw new Error('App quit: view-conf write error !');
  });
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  console.log('will-quit');
});

app.on('before-quit', () => {
  console.log('before-quit');
});

app.on('quit', () => {
  console.log('quit');
});

app.on('activate', () => {
  if (global.ipcMainWindow.window === null) {
    global.ipcMainWindow.createWindow();
  }
});
