const { app } = require('electron/main');
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const rootPath = app.isPackaged === false ? app.getAppPath() : path.dirname(app.getPath('exe'));
const config = ini.parse(fs.readFileSync(path.resolve(rootPath + '/wacsa.ini'), 'utf-8'));
const versionTag = app.getVersion();

module.exports = {
  rootPath,
  config,
  versionTag,
};
