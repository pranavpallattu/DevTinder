const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.mauicardiovascularsymposium.com/wp-content/uploads/2019/08/dummy-profile-pic-300x300.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },

    about: {
      type: String,
      default: "This is the default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "devtinder@2025", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
