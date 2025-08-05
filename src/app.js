const express=require("express")

// creates an express application
const app=express()   

app.use("/text",function(req,res){
    res.send("Hello from server")
})

app.use("/getname",function(req,res){
    res.send("Name is anonymou7")
})

app.use("/savename",function(req,res){
    res.send("save name of the author as thala for a reason")
})


app.listen(7777,()=>{
    console.log("server listening to 7777");  
})