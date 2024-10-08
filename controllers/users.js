const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");
const { ERROR_MESSAGES } = require("../utils/errors");
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  
  if (!email) {
    returnnext(new BadRequestError("An email address is required."));
  }

  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        return next(new ConflictError("Email already exists"));
      }
      return bcrypt.hash(password, 10)
  .then((hash) =>
    User.create({ name, avatar, email, password: hash }).then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
  )
})
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError( ERROR_MESSAGES.VALIDATION_ERROR ));
      }
      return next(err);
    });
};

const getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error(ERROR_MESSAGES.NOT_FOUND))
    .then((user) => {
       res.status(200).send(user);
       return null;
})
    .catch((err) => {
      console.error(err);
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND ));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ITEM_ID ));
      }
      return next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.name);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(
            "Authorization with non-existent email and password in the database",
        ));
      }

      return next(err);
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    {
      new: true, 
      runValidators: true, 
    }
  )
  .orFail()
    .then((user) =>  res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error(err);
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(err.message));
      }
      return next(err);
    });
};



module.exports = { createUser, getUser, login, updateUser };
