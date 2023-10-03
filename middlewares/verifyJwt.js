const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.config");
function isAdmin(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(403).send("token is not present");
  }

  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(403).send({
        message: "Invalid token",
      });
    } else if (decoded.userType === "ADMIN") {
      next();
    } else {
      res.status(403).send("Only admins can call this api");
    }
  });
}

function verifyJwtToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.status(403).send("token is not present");
  }

  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      res.status(401).send({
        message: "Unauthenticated user",
      });
    } else {
      req.userId = decoded.userId;
      req.userType = decoded.userType;
      next();
    }
  });
}
module.exports = { isAdmin, verifyJwtToken };
