const express = require("express");
const { validateEditProfileData } = require("../utils/validation");
const validator=require("validator")
const bcrypt=require("bcrypt")

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("no user found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  console.log(req.body);

  try {
    validateEditProfileData(req)
    
    const loggedInUser=req.user

    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key] )

    await loggedInUser.save()


    res.json({
        message:`${loggedInUser.firstName} profile updated successfully`,
        data:loggedInUser
    });

    // const isallowedUpdates=req.body.some((item)=>item.includes(allowedUpdates))
    // console.log(isallowedUpdates);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const {password}=req.body
        if(!validator.isStrongPassword(password)){
            throw new Error("password is not strong")
        }
        const hashedpassword=await bcrypt.hash(password,10)
        console.log(hashedpassword);

        loggedInUser.password=hashedpassword
        await loggedInUser.save()

        res.json({
            message:`${loggedInUser.firstName} password updated successfully`,
            data:loggedInUser
        }) 
    }
    catch (err) {
    res.status(400).send(err.message);
  }
})

module.exports = profileRouter;
