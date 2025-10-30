const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const {razorpayInstance} = require("../utils/razorpay");
const paymentModel = require("../models/payment");
const {memberShipAmount} = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { memberShipType } = req.body;
    const { firstName, lastName, emailId } = req?.user;
    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100 ,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType,
      },
    });


    const payment = new paymentModel({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // save it in the database
    // return back order details to frontend
    res.json({ message: "order successfull", data: savedPayment,key_id : process.env.KEY_ID });
  } catch (error) {
    res.status(401).send(error);
  }
});


paymentRouter.post("/payment/webhook",async(req,res)=>{
    // body is req.body sent in the api call
    // also sends you a req header - X-Razorpay-Signature
    try{
        const webhookSignature=req.get("X-Razorpay-Signature")
        console.log(webhookSignature);
        
        const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body),
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET)

        if(!isWebhookValid){
            return res.status(400).json({msg:"webhook signature is not valid"})
        }

        // update payment status in db -the req.body also container order details  req.body.payload.payment.entity
        const paymentDetails=req.body.payload.payment.entity
        const payment=await paymentModel.findOne({orderId:paymentDetails.order_id})
        payment.status=paymentDetails.status
        await payment.save()

        // update the user as premium

        const user=await User.findOne({_id:payment.userId})
        user.isPremium=true
        user.memberShipType=payment.notes.memberShipType

        await user.save()

        // return success response to razorpay(200) otherwise it will keep retrying the api and get into infinite loop

        res.status(200).json({msg:"webhook received successfully"})


        // if(req.body.event == "payment.captured"){

        // }

        // if(req.body.event == "payment.failed"){
            
        // }


    }
    catch(error){
        res.status(401).send(error)
    }
})


paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{
  try{
    const user=req.user
    if(user.isPremium){
      res.json({msg:user.firstName + " " + user.lastName +" is a premium member",isPremium:true})
    }
    else{
      res.json({msg:user.firstName + " " + user.lastName +" is not a premium member",isPremium:false})
    }
    
  }
     catch(error){
        res.status(401).send(error)
    }

})

module.exports = paymentRouter;
