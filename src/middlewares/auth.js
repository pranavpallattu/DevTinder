const jwt=require("jsonwebtoken")
const User=require("../models/user")


const userAuth=async(req,res,next)=>{

try{
    // Read the token from cookies
  const {token}=req.cookies
  if(!token){
    return res.status(401).send("Please Login")
    // 401 - unauthorized
  }
  console.log(token);
  
  // validate the token
  const decodedObj=jwt.verify(token,"devtinder@2025")
  console.log(decodedObj);
  const{_id}=decodedObj
  
  // find the user
  const user=await User.findById(_id)
  if(!user){
    throw new Error("user not found")
  }
  req.user=user
  next();
}
catch(err){
  res.status(400).send("Error: "+err.message)
}
}
module.exports={userAuth}