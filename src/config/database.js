const mongoose=require("mongoose")


const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://pranavpspallattu:pranav7781@devtinder.gmpyvtn.mongodb.net/DevTinder")
}

module.exports=connectDB