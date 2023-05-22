const { body, validationResult } = require("express-validator");
const credentials = require("../../credentials.json");

function authRoutes(appExpress) {
  appExpress.post(
    "/auth/login",
    [body("email").notEmpty(), body("password").notEmpty()],
    (req, res) => {
      try {
        const errors = validationResult(req).formatWith(({ msg }) => {
          return msg;
        });
        if (!errors.isEmpty()) {
          return res.status(422).json({
            status: false,
            message: "Email atau Password Masih Kosong",
          });
        } else {
          if (
            req.body.email === credentials.id &&
            req.body.password === credentials.password
          ) {
            return res.status(200).json({
              status: true,
              response: "Email dan Password Cocok. Login Telah Berhasil",
            });
          } else {
            return res.status(422).json({
              status: false,
              message: "Email atau Password Tidak Cocok",
            });
          }
        }
      } catch (error) {
        return res.status(500).json({
          status: false,
          response: error,
        });
      }
    }
  );
}

module.exports = authRoutes;
