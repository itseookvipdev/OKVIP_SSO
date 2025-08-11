const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;
const ISSUER = "sso-node";

const verifyJwtToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      SECRET_KEY,
      { issuer: ISSUER, algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      }
    );
  });

module.exports = Object.assign({}, { verifyJwtToken });
