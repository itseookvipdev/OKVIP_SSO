const jwt = require("jsonwebtoken");

const SECRET_KEY = "5UUDgBoUBRpdBhh";
const ISSUER = "sso-node";

const genJwtToken = payload =>
  new Promise((resolve, reject) => {
    jwt.sign(
      { ...payload },
      SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        issuer: ISSUER
      },
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });

module.exports = Object.assign({}, { genJwtToken });
