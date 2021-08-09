const fs = require('fs');
const path = require('path');
const { rootPath } = require('../system/index');
const ERROR_FILE_PATH = path.resolve(rootPath + '/wacsa-error.log');
const { dateTimeGeneratorServer } = require('../../utils/dateTimeGenerator');

async function errorLogger(errMsg, win) {
  try {
    await new Promise((resolve, reject) => {
      const log = 'Error At ' + dateTimeGeneratorServer() + ' : ' + errMsg + '\r\n \r\n';
      fs.writeFile(ERROR_FILE_PATH, log, { flag: 'a' }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  } catch (error) {
    win.webContents.send('error', error);
  }
}

module.exports = errorLogger;
