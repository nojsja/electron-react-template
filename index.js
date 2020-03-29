const electron = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron');

/* ------------------- self module ------------------- */
global.pathLocator = require('./app/utils/path-locator.js');
global.consoleLog = require('./app/utils/console-log.js');
const IpcMainClass = require('./app/services/main-service/');
const IpcMaiWindowClass = require('./app/services/main-service/windowManage');
const viewConf = require('./app/configure/view-conf');

/* ------------------- var ------------------- */
const nodeEnv = process.env.NODE_ENV;
global.nodeEnv = process.env.NODE_ENV;

/* ------------------- middleware ------------------- */

/* ------------------- ipcMain ------------------- */
const ipcMainProcess = new IpcMainClass(ipcMain);
const ipcMainWindow = new IpcMaiWindowClass();

/* ------------------- func  ------------------- */

/* ------------------- electron event ------------------- */

app.on('ready', () => {
  if (nodeEnv === 'development') {
    require('source-map-support').install();
  }
  ipcMainWindow.createWindow();
});

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  ipcMainWindow.writeAppConf().then(() => 0, (err) => {
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
  if (ipcMainWindow.window === null) {
    ipcMainWindow.createWindow();
  }
});
