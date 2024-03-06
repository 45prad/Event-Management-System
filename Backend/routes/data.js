const express = require('express');
const router = express.Router();
const DataModel = require('../models/data');
const multer = require('multer');
const path = require('path');
const fetchuser = require('../middleware/fetchuser');
const userData = require('../models/user')

// Define multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save uploaded files to the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ storage: storage });

// Add new data with file upload
router.post('/', upload.single('poaPdf'), async (req, res) => {
  try {
    const { id, committeeName, eventType, eventName, convenorName, eventDate, duration, status } = req.body;
    const poaPdf = req.file ? req.file.filename : ''; // Save filename instead of path

    const newData = new DataModel({ id, committeeName, eventType, eventName, convenorName, eventDate, duration, poaPdf, HODApproval: false, PrincipleApproval: false, RoomAllocated: false, status });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all data
router.get('/', fetchuser, async (req, res) => {
  try {
    const user = req.user.role;
    if (user == "hod") {
      const data = await DataModel.find();
      res.json(data);
    }
    else if (user == "principle") {
      const data = await DataModel.find({ HODApproval: 1 });
      res.json(data);
    }
    else if (user == "system") {
      const data = await DataModel.find({ HODApproval: 1, PrincipleApproval: 1 });
      res.json(data);
    } else {
      const userId = req.user.id;
      const commitee = await userData.findById(userId);
      const commiteeName = commitee.commiteeName;
      const data = await DataModel.find({ "committeeName": commiteeName });
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve PDF files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.put('/status/:id', fetchuser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user.role;
    const { status } = req.body;
    const newData = await DataModel.findById(id);
    newData.status = status;
    if (user == "principle") {
      newData.PrincipleApproval = status.includes("Approved by Principal") ? 1 : status.includes("Rejected by Principal") ? 2 : 0;
    }
    else if (user == "hod") {
      newData.HODApproval = status.includes("Approved by HOD") ? 1 : status.includes("Rejected by HOD") ? 2 : 0;
    }
    await newData.save();
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update data by ID
router.put('/:id', upload.single('poaPdf'), async (req, res) => {
  try {
    const id = req.params.id;
    const { committeeName, eventType, eventName, convenorName, eventDate, duration, status } = req.body;
    const poaPdf = req.file ? req.file.filename : null;

    const updatedData = {
      committeeName,
      eventType,
      eventName,
      convenorName,
      eventDate,
      duration,
      poaPdf,
      status
    };

    await DataModel.findByIdAndUpdate(id, updatedData);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete data by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await DataModel.findByIdAndDelete(id);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});






module.exports = router;
