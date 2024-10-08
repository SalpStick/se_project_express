const validator = require("validator");
const ClothingItem = require("../models/clothingItems");
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { ERROR_MESSAGES } = require("../utils/errors");



const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!validator.isURL(imageUrl)) {
    return next(new BadRequestError('Not a valid URL'));
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const getItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError('Item not Found'))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(err.message));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const getItems = (res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>{
      console.log(err);
     return next;
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (String(item.owner) !== req.user._id)
      {
        return next(new ForbiddenError ("You are not authorized to delete this item"));
      }
      return item.deleteOne().then(() => res.status(200).send({ message: "Item successfully deleted" }));
    })
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND ));
      }
      if (err.kind === "ObjectId" || err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID ));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
};
