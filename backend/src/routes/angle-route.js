// This now uses require()
const express = require('express');
const Angle = require('../models/angle-model.js');
const router = express.Router();

router.post('/', async (req, res) => {
const { id,angles } = req.body;

 if ( !angles || !id) {
 return res.status(400).json({ msg: 'Please include an angles object with id' });
 }

 try {
 let pose = await Angle.findOne({ id });

 if (pose) {
 return res.status(409).json({ msg: 'A pose with this id already exists' });
 }

 pose = new Angle({
 id,
 angles
 });

 newPose = await pose.save();

 res.status(201).json(newPose);

 } catch (err) {
 if (err.name === 'ValidationError') {
 return res.status(400).json({ msg: err.message });
 }
 res.status(500).send('Server Error');
 }
});

router.get("/:id", async (req, res) => {
 const { id } = req.params;
 if (!id) {
 return res.status(400).json({ msg: 'Please include id' });
 }

 try {

 const pose = await Angle.find({ id });

 res.status(200).json(pose);

 } catch (error) {
 res.status(500).send('Server Error');
 }
})



module.exports = router;