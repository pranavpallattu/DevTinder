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

const validateEditProfileData = (req) => {
  const { firstName, lastName, age, gender, photoUrl, about, skills } =
    req.body;

  if (firstName && (firstName.length < 4 || firstName.length > 50)) {
    throw new Error("first name should be 4 to 50 characters");
  }
   if (lastName && (lastName.length < 4 || lastName.length > 50)) {
    throw new Error("last name should be 4 to 50 characters");
  } 
   if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("the photoURL field must be a valid URL");
  } 
   if (about && about.length > 200) {
    throw new Error("the about should be under 200 characters");
  } 
  
  const allowedUpdates = ["firstName","lastName", "age", "gender", "photoUrl", "about", "skills"];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key)
  );
  if (!isUpdateAllowed){
    throw new Error("Invalid fields ! Only allowed fields can be updated")
  }
  return true
};

module.exports = { validateSignupData, validateEditProfileData };
