const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser, getUser, updateUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.get("/users/me", getUser);
router.patch("/users/me", auth, updateUser);


router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

module.exports = router;
