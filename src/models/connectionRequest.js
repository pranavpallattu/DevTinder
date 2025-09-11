const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE is not allowed}`,
      },
    },
  },
  {
    timestamps: true,
  }

);

  connectionRequestSchema.index({fromUserId:1, toUserId:1})

  connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this
    // check if the fromUserId is equals to toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you cannot sent connection requees to yourself")
    }
    next()
  })


const connectionRequestModel= new mongoose.model("connectionRequest",connectionRequestSchema)

module.exports=connectionRequestModel