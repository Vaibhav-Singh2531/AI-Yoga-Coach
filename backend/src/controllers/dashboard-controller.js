const Angle = require('../models/angle-model.js');
const { Plan } = require('../models/plan-model.js');
const Pose = require('../models/pose-model.js');

const allPlans = async (req, res) => {
  try {
    const id = req.userId; // assuming middleware sets this from the token

    // Always await database queries
    const result = await Plan.find({ user: id }).lean();

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No plan found" });
    }

    return res.status(200).json({ plan: result });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const createPlan = async (req, res) => {

    // In your createPlan controller...
    const { user_id, title, exercises } = req.body; // 'exercises' is ["1", "15", "22"]

    // Transform the simple array into an array of objects for the schema
    const formattedExercises = exercises.map(id => ({
        poseId: id,
        isCompleted: false // Set the default status
    }));

    // Now create and save the new plan
    const newPlan = new Plan({
        title: title,
        user: user_id, // Assumes you have user ID from auth
        exercises: formattedExercises // Use the transformed array
    });

    await newPlan.save();
    return res.status(200).json({ message: newPlan });
    // ... send response
}


// ...

const getPlanDetails = async (req, res) => {
    try {
        // 1. Get the plan document
        const plan = await Plan.findById(req.params.planId).lean(); // .lean() makes it faster

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // 2. Extract all the 'poseId' strings from the plan
        // This still works perfectly
        const poseIds = plan.exercises.map(ex => ex.poseId);

        // 3. Find all matching poses in your 'Pose' collection
        const poses = await Pose.find({ id: { $in: poseIds } }).lean();

        // 4. Create a fast lookup map (Pose ID -> Full Pose Document)
        const poseMap = new Map();
        poses.forEach(pose => {
            poseMap.set(pose.id, pose);
        });

        // 5. Manually merge the full pose details into the plan's exercises
        const populatedExercises = plan.exercises.map(exercise => {
            const poseDetails = poseMap.get(exercise.poseId);
            return {
                ...exercise, // This now spreads { poseId, isCompleted }
                pose: poseDetails // This adds the full pose details
            };
        });

        // 6. Send the final, combined object to the frontend
        res.json({
            _id: plan._id,
            title: plan.title,
            createdAt: plan.createdAt,
            exercises: populatedExercises // This has all the data for your UI
        });

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const markDone = async (req, res) => {
    const { planId, poseId } = req.params;

    try {
        const result = await Plan.updateOne(
            { _id: planId, "exercises.poseId": poseId.toString() },
            { $set: { "exercises.$.isCompleted": true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Plan or exercise not found" });
        }

        res.status(200).json({ message: "Exercise marked as completed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getReferencePose = async (req , res) => {
    const {id} = req.params;

    try {
        const result = await Angle.findOne({id});

        if (!result) {
            return res.status(404).json({message:"No reference pose found"});
        }

        return res.status(200).json({result});
    } catch (error) {
        res.status(500).json({message:error});
    }
}

module.exports = {
    getPlanDetails,
    allPlans,
    createPlan,
    markDone,
    getReferencePose
};