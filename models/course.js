const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    instructor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    description: String,
    students: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);