const express = require("express");
require("./config/database");
const User = require("./models/user");
const connectDB = require("./config/database");
const cookieParser=require("cookie-parser")
const { userAuth } = require("./middlewares/auth");
const cors=require("cors")
// creates an express application
const app = express();

require("dotenv").config();

// app.options('/profile/edit', cors({
//   credentials:true
// }))

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))


app.use(express.json());
app.use(cookieParser())


const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",paymentRouter)



connectDB()
  .then(() => {
    console.log("MongoDB Connected Successfully ");
    app.listen(process.env.PORT, () => {
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
