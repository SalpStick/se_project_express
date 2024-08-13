const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getUser, updateUser } = require("../controllers/users");

router.get("/users/me", auth, getUser);
router.patch("/users/me", auth, updateUser);


module.exports = router;
