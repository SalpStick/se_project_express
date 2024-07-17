const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The Avatar feild is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Avatar must be a valid URL",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
