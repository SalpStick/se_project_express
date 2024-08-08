const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(400).send({ message: "Authorization required 1st" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(400).send({ message: "Authorization required 2nd" });
  }

  console.log(payload, "authorization from auth middleware");
  req.user = payload;
  return next();
};

module.exports = { auth };
