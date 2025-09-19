const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

const authRouter = express.Router();

// signup api

authRouter.post("/signup", async (req, res) => {
  // validation of data
  // creating a new instance of the User Model

  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedpassword,
    });

    const signedInUser = await user.save();

    // create a jwt token
    const token = await user.getJWT();

    // add the token to cookie and send the response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "user added successfully", data: signedInUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      res.status(401).send("invalid credentials");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(401).send("invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a jwt token
      const token = await user.getJWT();

      // add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send(user);
    } else {
      res.status(401).send("invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
    console.log(err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successfully");
});

module.exports = authRouter;
