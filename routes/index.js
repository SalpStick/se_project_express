const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require('../errors/NotFoundError');
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");


router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);


router.use((next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
