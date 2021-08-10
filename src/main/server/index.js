const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const http = require('http');
const { app } = require('electron/main');
const { config } = require('../system');

const appExpress = express();
const allowedDomains = config.ServerOptions.cors || '*';
const corsOptions = {
  origin:
    allowedDomains === '*'
      ? '*'
      : (origin, callback) => {
          if (allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Tidak diizinkan oleh CORS'));
          }
        },
};

appExpress.use(cors(corsOptions));
appExpress.use(express.json());
appExpress.use(express.urlencoded({ extended: true }));
appExpress.use(
  fileUpload({
    debug: app.isPackaged === false ? true : false,
  })
);
appExpress.disable('x-powered-by');

const SERVER = http.createServer(appExpress);
const PORT = config.ServerOptions.port || 8008;

module.exports = {
  appExpress,
  SERVER,
  PORT,
};
