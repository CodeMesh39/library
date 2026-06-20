const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const bcrypt=require("bcryptjs");
require("dotenv").config();

const jwt=require("jsonwebtoken");
const Book=require("./models/Book");
const Course=require("./models/Course");
const User=require("./models/User");
const app=express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Cloud Connected Successfully.");
    })
    .catch((error)=>{
        console.log("MongDB Connecion Failed", error);
    });

app.get("/",(req,res)=>{
    res.send("backend running successfully");
})

app.post("/api/register",async (req,res)=>{
    try{
        const {fullName,email,password}=req.body;
        const existingUser=await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({
                message: "Email already registered",
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(200).json({
            message: "Registration Successfully Completed."
        });
    }catch(error){
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

app.post("/api/login",async (req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser=await User.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({
                message: "Invalid email or password",

            });
        }
        const isPasswordMatch=await bcrypt.compare(
            password,
            existingUser.password
        );
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Invalid email or password",
            });
        }
        const token=jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",

            }
        );
        res.status(200).json({
            message:"Login Successully ",
            token:token,
            user: {
                id:existingUser._id,
                fullName:existingUser.fullName,
                email: existingUser.email,
            }
        });
    } catch(error) {
    console.error("--- REAL LOGIN ERROR ---", error); 
    res.status(500).json({
        message: "login failed occured",
        error: error.message
    });
}
})

app.get("/api/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/api/courses", async (req, res) => {
    try {
        const { courseThumbnail, title, description, author, numberOfBooks } = req.body;
        const newCourse = new Course({ courseThumbnail, title, description, author, numberOfBooks });
        await newCourse.save();
        res.status(201).json({ message: "Book added successfully", data: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Failed to add book" });
    }
});
app.put("/api/courses/:id", async (req, res) => {
    try {
        const { courseThumbnail, title, description, author, numberOfBooks } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { courseThumbnail, title, description, author, numberOfBooks },
            { new: true }
        );
        if (!updatedCourse) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book updated successfully", data: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Failed to update book" });
    }
});
app.delete("/api/courses/:id", async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete book" });
    }
});

app.get("/api/course-count", async (req, res) => {
    try {
        const courses = await Course.find();
        let totalStock = 0;
        courses.forEach(course => {
            totalStock += Number(course.numberOfBooks) || 0;
        });
        res.json({ totalCourses: totalStock });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const autoUpdateOverdue=async()=>{
const sevenDaysAgo=new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);
await Book.updateMany({status:"Issued",issuedAt:{$lte:sevenDaysAgo}},{status:"Not Returned"});
};
app.get("/api/all-books",async(req,res)=>{
try{
await autoUpdateOverdue();
const books=await Book.find();
res.json(books);
}catch(err){
res.status(500).json({message:err.message});
}
});
app.post("/api/all-books",async(req,res)=>{
try{
const{title,borrowerId,status}=req.body;
const newBook=new Book({title,borrowerId,status:status||"Issued",issuedAt:new Date()});
await newBook.save();
res.status(201).json(newBook);
}catch(err){
res.status(500).json({message:err.message});
}
});
app.put("/api/all-books/:id",async(req,res)=>{
try{
const{status}=req.body;
const updatedBook=await Book.findByIdAndUpdate(req.params.id,{status},{new:true});
res.json(updatedBook);
}catch(err){
res.status(500).json({message:err.message});
}
});
app.get("/api/all-books/counts",async(req,res)=>{
try{
await autoUpdateOverdue();
const total=await Course.countDocuments();
const issued=await Book.countDocuments({status:"Issued"});
const pending=await Book.countDocuments({status:"Pending"});
const overdue=await Book.countDocuments({status:"Not Returned"});
res.json({total,issued,pending,overdue});
}catch(err){
res.status(500).json({message:err.message});
}
});


app.put("/api/change-password", async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})