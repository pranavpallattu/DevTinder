const express=require("express")
const { userAuth } = require("../middlewares/auth")
const connectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")
const userRouter=express.Router()

const USER_SAFE_DATA=["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

// get all the pending connection request for the loggedin user

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user

        const pendingRequests=await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message:`pending connection requests of ${loggedInUser.firstName} `,
            data:pendingRequests
        })
    }
    catch(error){
        res.status(400).send("Error "+ error.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user

        const connections=await connectionRequestModel.find({
         $or:[
            {toUserId:loggedInUser._id, status:"accepted"},
            {fromUserId:loggedInUser._id, status:"accepted"}
         ]
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA)

        const data=connections.map((row)=>{
            if(row.fromUserId.equals(loggedInUser._id)){
                return row.toUserId
            }

            return row.fromUserId
    })

        res.json({
            message:`connections of ${loggedInUser.firstName}`,
            data
        })
    }
    catch(error){
        res.status(400).send("Error "+ error.message)
    }
})


userRouter.get("/user/feed",userAuth,async(req,res)=>{

    try{

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit > 50 ? 50 : limit;
        // if(limit > 50){
        //     limit = 50
        // } 
        // else{
        //     limit
        // }
        const skip= (page-1) * limit


        const loggedInUser=req.user
        // find all connection requests(sent & recieved)
        const connectionRequests=await connectionRequestModel.find({
                $or:[
                    {fromUserId:loggedInUser._id},
                    {toUserId:loggedInUser._id}
                ]
            }).select("fromUserId toUserId")

        // console.log(connectionRequests);

        const hideUsersFromFeed=new Set()

        connectionRequests.forEach((request)=>{
            hideUsersFromFeed.add(request.fromUserId.toString())
            hideUsersFromFeed.add(request.toUserId.toString())
        })

        // console.log(hideUsersFromFeed);


        const users=await User.find({
            $and:[{_id: { $ne : loggedInUser._id }},{
                _id: {$nin:Array.from(hideUsersFromFeed)}
            }]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        // console.log(users);
        res.json({ 
            message:"user feed for "+ loggedInUser.firstName,
            data:users
        })
        
    }
    catch(err){
        res.status(400).send("Error "+ err.message)
    }
    
})

module.exports=userRouter

// This is more of a defensive programming practice. Here’s why:

// Edge case safety

// Imagine for some reason your ID didn’t get added into hideUsersFromFeed (maybe a future change, a bug, or if connectionRequests returns empty).

// In that case, $nin won’t exclude your own ID, and you might see yourself in your own feed.

// Adding $ne is a guarantee that you’ll never see yourself, regardless of what happens in the Set.

// Readability

// It makes the query intent clear to future developers: “always exclude the logged-in user.”

// Even if $nin already handles it, $ne explicitly documents the business rule.

// Best practice in user feeds

// In most feed/recommendation systems, excluding yourself is a separate requirement.

// So devs often keep it explicit with $ne.