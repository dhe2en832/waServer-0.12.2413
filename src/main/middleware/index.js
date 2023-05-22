const credentials = require("../../credentials.json");

const auth = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      status: false,
      message: "Token tidak tercantum",
    });
  }

  if (token === credentials.token) {
    next();
    return;
  } else {
    return res.status(401).send({
      status: false,
      message: "Token anda salah!",
    });
  }
};

module.exports = { auth };
