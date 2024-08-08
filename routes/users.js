const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", getUsers);
router.get("/:userId", auth, getUser);
router.post("/", auth, createUser);

module.exports = router;
