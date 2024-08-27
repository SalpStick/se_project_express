const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.get("/:itemId", auth,  getItem);

router.post("/",  auth, createItem);

router.delete("/:itemId", auth,  deleteItem);

router.put("/:itemId/likes", auth,  likeItem);

router.delete("/:itemId/likes", auth,  dislikeItem);

module.exports = router;
