const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require('../errors/NotFoundError');
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");


router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);


router.use((req, res) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
