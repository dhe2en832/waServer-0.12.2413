const { MessageMedia } = require('whatsapp-web.js');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware');
const { phoneNumberFormatter } = require('../../utils/phoneNumberFormatter');
const errorLogger = require('../logger/error-logger');

function messageRoutes(appExpress, waClient, win) {
  const clientState = async function () {
    try {
      const state = await waClient.getState();
      return state;
    } catch (error) {
      errorLogger('messageRoutes #clientState' + error, win);
    }
  };
  const checkRegisteredNumber = async function (number) {
    try {
      const isRegistered = await waClient.isRegisteredUser(number);
      return isRegistered;
    } catch (error) {
      errorLogger('messageRoutes #checkRegisteredNumber' + error, win);
    }
  };

  appExpress.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  appExpress.post(
    '/message/send-text',
    [auth, body('number').notEmpty(), body('message').notEmpty()],
    async (req, res) => {
      try {
        const isConnectedClient = await clientState();
        if (isConnectedClient === 'CONNECTED') {
          const errors = validationResult(req).formatWith(({ msg }) => {
            return msg;
          });

          if (!errors.isEmpty()) {
            return res.status(400).json({
              status: false,
              message: 'Nomor Telepon Atau Pesan Masih Kosong',
            });
          }

          const number = phoneNumberFormatter(req.body.number);
          const isRegisteredNumber = await checkRegisteredNumber(number);
          if (!isRegisteredNumber) {
            return res.status(422).json({
              status: false,
              message: 'Nomor Whatsapp tidak terdaftar',
            });
          }
          const message = req.body.message;

          waClient
            .sendMessage(number, message)
            .then((response) => {
              res.status(200).json({
                status: true,
                response: response,
              });
            })
            .catch((error) => {
              errorLogger('messageRoutes #sendMessageText' + error, win);
              res.status(500).json({
                status: false,
                response: err,
              });
            });
        } else {
          return res.status(400).json({
            status: false,
            message: 'WACSA belum diinisialisasi atau belum terhubung',
          });
        }
      } catch (error) {
        errorLogger('messageRoutes #appExpressSendMediaText' + error, win);
        return res.status(400).json({
          status: false,
          message: 'WACSA API mengalami masalah. ' + error,
        });
      }
    }
  );

  appExpress.post('/message/send-media', [auth, body('number').notEmpty()], async (req, res) => {
    try {
      const isConnectedClient = await clientState();
      if (isConnectedClient === 'CONNECTED') {
        const errors = validationResult(req).formatWith(({ msg }) => {
          return msg;
        });

        if (!errors.isEmpty()) {
          return res.status(422).json({
            status: false,
            message: 'Nomor Telepon Masih Kosong',
          });
        }

        const number = phoneNumberFormatter(req.body.number);
        const isRegisteredNumber = await checkRegisteredNumber(number);
        if (!isRegisteredNumber) {
          return res.status(422).json({
            status: false,
            message: 'Nomor Whatsapp tidak terdaftar',
          });
        }

        const caption = req.body.message;
        const file = req.files.file;
        const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);

        waClient
          .sendMessage(number, media, { caption: caption })
          .then((response) => {
            res.status(200).json({
              status: true,
              response: response,
            });
          })
          .catch((error) => {
            errorLogger('messageRoutes #sendMessageMedia' + error, win);
            res.status(500).json({
              status: false,
              response: err,
            });
          });
      } else {
        return res.status(400).json({
          status: false,
          message: 'WACSA belum diinisialisasi atau belum terhubung',
        });
      }
    } catch (error) {
      errorLogger('messageRoutes #appExpressSendMediaMessage' + error, win);
      return res.status(400).json({
        status: false,
        message: 'WACSA API mengalami masalah. ' + error,
      });
    }
  });
}

module.exports = messageRoutes;
