const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/users");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  
  if (!email) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "An email address is required." });
  }

  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        return res
          .status(409)
          .send({ message: "Email already exists" });
      }
      return bcrypt.hash(password, 10);
    })
  .then((hash) =>
    User.create({ name, avatar, email, password: hash }).then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
  )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.VALIDATION_ERROR });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error(ERROR_MESSAGES.NOT_FOUND))
    .then((user) => {
       res.status(200).send(user);
       return null;
})
    .catch((err) => {
      console.error(err);
      if (err.message === ERROR_MESSAGES.NOT_FOUND) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ITEM_ID });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("user object from the login controller", user);
      if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }

      if (!user._id || !JWT_SECRET) {
        console.error("user._id or JWT_SECRET is undefined");
        return res
          .status(500)
          .send({ message: "Internal server error from the try statement" });
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.name);
      if (err.name === "Error") {
        return res.status(400).send({
          message:
            " Authorization with non-existent email and password in the database",
        });
      }

      res.status(500).send({
        message:
          "Internal server error from the catch in the login controller" + err,
      });
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
    .then((user) =>  res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error(err);
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: `${ERROR_MESSAGES.VALIDATION_ERROR} updateUser` });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: `${ERROR_MESSAGES.NOT_FOUND} from updateUser` });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: `${ERROR_MESSAGES.SERVER_ERROR} from updateUser` });
    });
};



module.exports = { getUsers, createUser, getUser, login, updateUser };
