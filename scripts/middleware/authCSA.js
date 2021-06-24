const authCSA = (req, res, next) => {
  let token = req.headers["x-access-token"];
  const api_token = "46a3c0ac2e80d24b1a51a07ae6cfd8d3";

  if (!token) {
    return res.status(403).send({
      status: false,
      message: "Token tidak tercantum",
    });
  }

  if (token == api_token) {
    next();
    return
  } else {
    return res.status(401).send({
      status: false,
      message: "Token anda salah!",
    });
  }
};

module.exports = { authCSA };
