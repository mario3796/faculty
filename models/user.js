const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    },
    department: String,
    imageUrl: String,
    courses: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('User', userSchema);