const express=require("express")

// creates an express application
const app=express()   

// app.use("/user",(req,res)=>{
//     res.send("app.use called")
// })

app.get("/user",(req,res)=>{
    res.send({Firstname:"Thala",LastName: "Dhoni"})
})

app.post("/user",(req,res)=>{
    res.send("User data saved successfully")
})


app.delete("/user",(req,res)=>{
    res.send("deleted user data saved successfully")
})


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



app.listen(7777,()=>{
    console.log("server listening to 7777");  
})