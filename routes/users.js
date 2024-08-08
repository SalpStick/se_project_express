const { Router } = require("express");
const { getUsers, createUser, getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = Router();

router.get("/", getUsers);
router.get("/:userId", auth, getUser);
router.post("/", auth, createUser);

module.exports = router;
