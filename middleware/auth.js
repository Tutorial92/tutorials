/*
Project : NFT-marketplace
FileName : auth.js
*/

let jwt = require("jsonwebtoken");
const config = require("./../helper/config");

let auth = (req, res, next) => {
  // console.log("token is ", req.headers)
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token == null) {
    return res.status(401).json({
      status: false,
      message: "Auth token is not supplied",
    });
  }

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        console.log("decode", decoded.id);
        var user_id = decoded.id;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: false,
      message: "Auth token is not supplied",
    });
  }
};

module.exports = auth;
