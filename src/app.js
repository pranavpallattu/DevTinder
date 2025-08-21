const express = require("express");
require("./config/database");
const User = require("./models/user");
const connectDB = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const bcrypt=require("bcrypt")
const validator=require("validator")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
// creates an express application
const app = express();

app.use(express.json());
app.use(cookieParser())

// signup api
app.post("/signup", async (req, res) => {
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

app.post("/login",async(req,res)=>{
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


app.get("/profile",userAuth,async(req,res)=>{
  try{
    const user=req.user
    if(!user){
      throw new Error("no user found")
    }
    res.send(user)
  }
   catch (err) {
    res.status(400).send(err.message);
  }
})


app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

  const user=req.user
  console.log("sending connection request");

  res.send(user)
  
})


connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully ");
    app.listen(7777, () => {
      console.log("server listening to 7777");
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed " + err);
  });

// const {adminAuth,userAuth}=require("./middlewares/auth")

// // handle auth middleware for all requests GET,POST,PUT.PATCH,DELETE
// app.use("/admin",adminAuth)
// app.use("/user",userAuth)

// app.get("/admin/getAllData",(req,res)=>{
//   // Logic checking if the request is authorized
//   res.send("All Data sent")
// })

// app.get("/user",userAuth, (req, res) => {
//   console.log("handling the route user");
//   throw new Error("dhfjdsf")
//   res.send("user request handler");
// });

// app.use("/",(err,req,res,next)=>{
//   if(err){
//     console.log(err);
//     res.status(401).send("something went wrong")
//   }
// })

// app.delete("/admin/deleteUser",(req,res)=>{
//   res.send("User Deleted")
// })

// app.use("/",(req,res,next)=>{
//   // res.send("handling / route");
//   next()
// })

// app.get("/user", (req, res, next) => {
//   console.log("handling the route user 2");
//   // res.send("request handler 2");
// next()
// });

// app.post("/user", (req, res, next) => {
//   console.log("handling the route user 1");
//   res.send("request handler 1");
// // next()
// });

// app.use("/user", (req, res, next) => {
//   console.log("handling the route user 2");
//   res.send("request handler 2");
// // next()
// });

// app.use("/user",(req,res)=>{
//     res.send("app.use called")
// })

// app.get(/^\/*fly$/,(req,res)=>{
//     res.send({Firstname:"Thala",LastName: "Dhoni"})
// })

// app.get("/user",(req,res)=>{
//     res.send({Firstname:"Thala",LastName: "Dhoni"})
// })

// app.post("/user/:userid",(req,res)=>{
//     console.log(req.params);

//     res.send("User data saved successfully")
// })

// app.delete("/user",(req,res)=>{
//     res.send("deleted user data saved successfully")
// })

// app.use("/",function(req,res){
//     res.send("Namaste Pranav")
// })

// app.use("/text/77",(req,res)=>{
//     res.send("MAGIC MAGIC MAGIC")
// })

// app.use("/text",function(req,res){
//     res.send("Hello from server")
// })

// app.use("/text/77",(req,res)=>{
//     res.send("MAGIC MAGIC MAGIC")
// })

// app.use("/getname",function(req,res){
//     res.send("Name is anonymou7")
// })

// app.use("/savename",function(req,res){
//     res.send("save name of the author as thala for a reason")
// })

// app.use("/",function(req,res){
//     res.send("Namaste Pranav")
// })
