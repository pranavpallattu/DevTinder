const express=require("express")
const bcrypt=require("bcrypt")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const User=require("../models/user")
const { validateSignupData } = require("../utils/validation");


const authRouter=express.Router()

// signup api

authRouter.post("/signup", async (req, res) => {
  // validation of data
  // creating a new instance of the User Model

  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedpassword=await bcrypt.hash(password, 10)
    console.log(hashedpassword);
    

    const user = new User({
      firstName,
      lastName,
      emailId,
      password:hashedpassword
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});



authRouter.post("/login",async(req,res)=>{
  try{
    const{emailId, password}=req.body
    if(!validator.isEmail(emailId)){
      res.send("invalid credentials")
    }

    const user=await User.findOne({emailId:emailId})
    if(!user){
      res.send("invalid credentials")
    }

    const isPasswordValid=await user.validatePassword(password)
    if(isPasswordValid){
      
      // create a jwt token
      const token=await user.getJWT()
      console.log("line 62 "+ token);
      
     
      // add the token to cookie and send the response back to the user
      res.cookie("token",token)
      res.send("login successfull")
    }
    else{
      res.send("invalid credentials")
    }
  }
  catch (err) {
    res.status(400).send(err.message);
  }
})

authRouter.post("/logout",(req,res)=>{
    res.clearCookie("token")
    res.send("logout successfully")
})




module.exports=authRouter