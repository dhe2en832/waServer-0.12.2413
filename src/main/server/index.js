const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const http = require('http');
const ini = require('ini');
const fs = require('fs');
const path = require('path');

// Read config directly instead of requiring system module
const config = ini.parse(
  fs.readFileSync(path.resolve(process.cwd() + "/wacsa.ini"), "utf-8")
);

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
    debug: process.env.NODE_ENV !== 'production',
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
