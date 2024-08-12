const router = require("express").Router();
const { updateUser } = require("../controllers/users");

router.patch("/users/me", auth, updateUser);


module.exports = router;
