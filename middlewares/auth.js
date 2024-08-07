const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Authorization required" });
  }

  console.log(payload, "authorization from auth middleware");
  req.user = payload;
  next();
};

module.exports = { auth };
