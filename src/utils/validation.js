const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not valid");
  } else if (firstName.length < 4 && firstName.length > 50) {
    throw new Error("first name should be 4 to 50 characters");
  } else if (lastName.length < 4 && lastName.length > 50) {
    throw new Error("last name should be 4 to 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong");
  }
};

module.exports={validateSignupData}