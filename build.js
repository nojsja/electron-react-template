const path = require('path');
const fs = require('fs');
const { copyDirSync, exec, execRealtime, console_log, removeDirSync } = require('./service/build.utils');

/*
   * 函数调用list
   * @param web-dist 使用webpack打包前端web代码
   * @param build-win 执行win平台打包
   * @param build-mac 执行linux平台打包
   * @param build-linux 执行mac平台打包
   * @param build-all 执行所有平台打包
   * @param --help | -h 查看帮助信息
   */
const func = {
  'test': () => {
    copyDirSync('./view/dist', './service/dist');
  },
  /* web build */
  'web-dist': async () => {
    console_log('>>>>>> web-dist ...');
    await execRealtime('git pull', { cwd: './view' })
    .then(() => execRealtime('npm run build', { cwd: './view' }))
    .then(() => {
      if (fs.existsSync('./service/dist')) {
        removeDirSync('./service/dist');
      }
      fs.mkdirSync('./service/dist');
      copyDirSync('./view/dist', './service/dist');
    });
  },
  /* build for win platform */
  'build-win': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-win ${env}`, { cwd: './service' });
  },
  /* build for linux platform */
  'build-linux': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-linux ${env}`, { cwd: './service' });
  },
  /* build for mac platform */
  'build-mac': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-mac ${env}`, { cwd: './service' });
  },
  /* build for all platform */
  'build-all': async (env) => {
    await func['web-dist']();
    await execRealtime(`node ./build.js build-all ${env}`, { cwd: './service' });
  },
  'clean-build': async (env) => {
    await execRealtime('node ./build.js clean-build', { cwd: './service' });
    if (fs.existsSync('./view/dist')) {
      removeDirSync('./view/dist');
    }
    await execRealtime('git checkout -- dist', { cwd: './view' });
    console_log(`\nclean finishied!`);
  },
  /* build command usage */
  '--help': () => {
    console_log('\
    \n\
    description: build command for electron-re.\n\
    command: node build.js [action] [config]\n\
    |\n\
    |\n\
    |______ param: [--help | -h ] => show usage info.\n\
    |______ param: [build:libs ] => build command for service component.\n\
    |______ param: [build:ui   ] => build command for ui component.\n\
    |______ param: [build      ] => build command for ui and service\n\
    |______ param: [clean-build ] => clean build directory after build\n\
    |\n\
    |______ example1: node build.js build:libs\n\
    |______ example2: node build.js build:ui\n\
    |______ example7: node build.js --help\n\
    |______ example8: node build.js clean-build\n\
    \n\
    ')
  },
  '-h': () => {
    func['--help']();
  }
};

/* Main */
function Main() {
  const params = process.argv.splice(2);
  const indexArray = [];
  let args;

  params.forEach((key, i) => {
    if (func[key] && (typeof func[key] === 'function')) indexArray.push(i);
  });
  
  indexArray.forEach((index, i) => {
    args = indexArray.slice(index + 1, indexArray[i + 1]).map(i => params[i]);
    if (args.length)
      func[params[index]](...args);
    else
      func[params[index]]('');
  });
}

Main();