const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});

/* DB */
mongoose.connect("mongodb://127.0.0.1:27017/wheatDB")
.then(()=>console.log("MongoDB Connected"));

/* MODEL */
const Farmer = mongoose.model("Farmer",{
    name:String,
    quantity:Number,
    status:{type:String,default:"Pending"},
    slot:{type:String,default:"-"},
    time:{type:String,default:"-"},
    date:{type:String,default:"-"}
});

/* ADMIN LOGIN */
const ADMIN={username:"admin",password:"123"};
let isAdmin=false;

app.post("/adminLogin",(req,res)=>{
    const {username,password}=req.body;
    if(username===ADMIN.username && password===ADMIN.password){
        isAdmin=true;
        res.json({success:true});
    } else res.json({success:false});
});

/* FARMER REGISTER */
app.post("/register",async(req,res)=>{
    const farmer=new Farmer(req.body);
    await farmer.save();
    res.json(farmer);
});

/* FARMER LOGIN */
app.post("/farmerLogin",async(req,res)=>{
    const farmer=await Farmer.findOne({name:req.body.name});
    if(farmer) res.json(farmer);
    else res.json(null);
});

/* GET ALL FARMERS (ADMIN) */
app.get("/farmers",async(req,res)=>{
    if(!isAdmin) return res.status(403).send("Unauthorized");
    const data=await Farmer.find();
    res.json(data);
});

/* ASSIGN SLOT */
app.post("/assign",async(req,res)=>{
    if(!isAdmin) return res.status(403).send("Unauthorized");

    const {id,slot,time,date}=req.body;

    const farmer=await Farmer.findByIdAndUpdate(
        id,
        {slot,time,date,status:"Assigned"},
        {new:true}
    );

    res.json(farmer);
});

/* COMPLETE PROCUREMENT */
app.post("/complete",async(req,res)=>{
    if(!isAdmin) return res.status(403).send("Unauthorized");

    const farmer=await Farmer.findByIdAndUpdate(
        req.body.id,
        {status:"Completed"},
        {new:true}
    );

    res.json(farmer);
});

app.listen(3000,()=>console.log("Server running on http://localhost:3000"));