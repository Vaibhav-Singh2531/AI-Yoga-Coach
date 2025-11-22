const mongoose = require("mongoose");

const angleSchema = new mongoose.Schema({
    leftElbow: {
        type: Number,
        required: true
    },
    rightElbow: {
        type: Number,
        required: true
    },
    leftShoulder: {
        type: Number,
        required: true
    },
    rightShoulder: {
        type: Number,
        required: true
    },
    leftKnee: {
        type: Number,
        required: true
    },
    rightKnee: {
        type: Number,
        required: true
    },
    leftHip: {
        type: Number,
        required: true
    },
    rightHip: {
        type: Number,
        required: true
    }
}, { _id: false }); 

const poseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    angles: {
        type: angleSchema,  
        required: true
    }
}, {
    timestamps: true 
});

const Angle = mongoose.model('Angle', poseSchema);

module.exports = Angle;