// models/Plan.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * This is a SUB-DOCUMENT.
 * It defines the shape of objects inside the 'exercises' array.
 * We still use an object to track the 'isCompleted' status for each pose.
 */
const planExerciseSchema = new Schema({
    // This is the link to your Pose model, using its 'id' field
    poseId: {
        type: String, // This will store "1", "50", "75", etc.
        required: true
    },
    
    // This is the plan-specific STATUS
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { 
    _id: false // No separate _id needed for this sub-document
});

/**
 * This is the main Plan schema
 */
const planSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Standard ref to the User's _id
        required: true,
        index: true
    },
    title: {
        type: String, // The "plan name" from the chatbot
        required: true
    },
    
    // This is an array of the exercises for this specific plan
    exercises: [planExerciseSchema]

}, { 
    timestamps: true // `createdAt` is used for step 2
});

export const Plan = mongoose.model('Plan', planSchema);