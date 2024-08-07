const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { getUser, login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItemRouter);
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/users/me", auth, getUser);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
