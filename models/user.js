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
    department: {
        type: String,
        required: true
    },
    imageUrl: String,
    courses: []
});

module.exports = mongoose.model('User', userSchema);