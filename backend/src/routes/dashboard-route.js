const express = require("express");
const {allPlans , getPlanDetails , createPlan , markDone,getReferencePose} = require("../controllers/dashboard-controller.js");
const {protectRoute} = require("../middleware/protect-route.js");
const router = express.Router();

router.get("/getPlans",protectRoute ,allPlans);
router.get("/get/:id/:planid", getPlanDetails);
router.post("/:planId/:poseId", markDone);
router.post("/check",createPlan);
router.get("/:planId",getPlanDetails);
router.get("/reference/:id",getReferencePose);



module.exports = router;