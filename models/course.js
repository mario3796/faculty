const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    instructorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    description: String
});

module.exports = mongoose.model('Course', courseSchema);