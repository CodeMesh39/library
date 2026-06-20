const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
    courseThumbnail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    numberOfBooks: { type: Number, required: true, default: 0 }
});
module.exports = mongoose.model("Course", CourseSchema);