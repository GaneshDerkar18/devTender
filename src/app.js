const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignUpdata}=require("./utils/validation")
const bcrypt= require("bcrypt")

app.use(express.json())

app.post("/signup",async (req,res)=>{
   
    try{
        validateSignUpdata(req);
        const {firstName,lastName,emailId,password }= req.body;

        const passwordHash=await bcrypt.hash(password, 10)
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        })
        await user.save();
        res.send("data send")
    }
    catch(err){
        res.status(400).send("data not send: "+err.message);
    }
})

app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;

    try {
        const user= await User.find({emailId:userEmail});
        if(user.length===0){
            res.status(400).send("user not found!");
        }
        else{
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("something went wrong"+error.message);
    }
})

app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send("user deleted");
    }
    catch(error){
        res.status(400).send("something went wrong")
    }
})

app.patch("/user",async (req,res)=>{
    const emailId=req.body.emailId;
    const data=req.body;

    try{
        const ALLOWED_UPDATES=["photoUrl","about","skills","gender","age"];
        const isUpdateAllowed=object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update Not Allowed");
            
        }
        if(data.skills.length>10){
            throw new Error("skills cannot be more than 10");
            
        }
        const user=await User.findByIdAndUpdate(emailId,data,{
            runValidators:true,
            returnDocument:"after"
        });
        res.send("updated");
    }
    catch(err){
        res.status(400).send("update failed"+err.message);
    }
})

app.post("/login", async (req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user= await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERR : "+ error.message);
    }
});

connectDB().then(() => {
    console.log("database connected");

app.listen(7777,()=>{
    console.log("server started");
})
}).catch(err => {
    console.log("database not connected");
})


