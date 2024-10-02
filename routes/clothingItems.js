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
const { validateCardBody, validateId } = require('../middlewares/validation');

router.get("/", getItems);

router.use(auth)

router.get("/:itemId", getItem);

router.post("/",  validateCardBody, createItem);

router.delete("/:itemId", validateId,  deleteItem);

router.put("/:itemId/likes", validateId,  likeItem);

router.delete("/:itemId/likes", validateId,  dislikeItem);

module.exports = router;
