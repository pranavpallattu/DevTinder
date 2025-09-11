const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const connectionRequestModel = require("../models/connectionRequest");

const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const toUserId = req.params.toUserId;

      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(404).send("invalid status type");
      }

      // check if toUserId if valid

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).send("user not found");
      }

      // if there is an existing request

      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("connection request already exists");
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} is ${status} ${toUser.firstName} `,
        data,
      });

      console.log(status);
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const {status, requestId}=req.params
    const loggedInUser=req.user

    const allowedstatus=["accepted","rejected"]

    if(!allowedstatus.includes(status)){
      return res.status(404).send("connection request status invalid")
    }

    const existingRequest=await connectionRequestModel.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    })

    if(!existingRequest){
      return res.status(400).json("Invalid Request")
    }

    existingRequest.status=status
    
    const data=existingRequest.save()

    res.json({
      message:"connection status updated successfully",
      data:existingRequest
    })

  }
  catch(error){
    res.status(400).json("Error ! "+ error.message)
  }
})

module.exports = requestRouter;
