const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const fetchuser = require('../middleware/fetchuser');
const feedback = require('../models/feedback');
const user = require('../models/user');
const multer = require('multer');
const { uploadImageToCloudinary } = require('../utils/imageUpload');
const data = require('../models/data');


// Route to get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Adjust the file size limit as needed (10MB in this example)
});

// Route to add a new event
router.post('/addEvents', upload.single('image'), fetchuser, async (req, res) => {
  const { title, description, dateTime, location, keywords, link } = req.body;
  const file = req.file;
  const userId = req.user.id;
  const userData = await user.findById(userId);
  const userDepartment = userData.commiteeName;
  // console.log(req.body);
  try {
    if (!file) {
      return res.status(401).json({ success: false, msg: "Enter valid file" });
    }

    const imageUrl = await uploadImageToCloudinary(file);

    const newEvent = new Event({
      title,
      description,
      date: dateTime,
      location,
      image: imageUrl,
      tag: keywords,
      link,
      department: userDepartment
    });



    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.put('/:eventId/rsvp', fetchuser, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id; // Assuming user ID is available in request

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    event.registeredUsers.push(userId);
    await event.save();

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to save feedback
router.post('/:eventId/feedback', fetchuser, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { rating, likedMostRating, improvementsRating, recommendationRating, comments } = req.body;

    const newFeedback = new feedback({
      eventId,
      userId,
      rating,
      likedMost: likedMostRating,
      improvements: improvementsRating,
      recommendations: recommendationRating,
      comments
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get events and registered users details based on user department for commitee
router.get('/registerations', fetchuser, async (req, res) => {
  try {
    // Extract department from JWT token
    const userId = req.user.id;
    const userData = await user.findById(userId);
    const userDepartment = userData.commiteeName;

    // Find events with the same department as the user's department
    const events = await Event.find({ department: userDepartment });

    // Array to store event details along with registered users' details
    const eventData = [];

    // Iterate over events
    for (const event of events) {
      const eventDetails = {
        title: event.title,
        registeredUsers: []
      };

      // Iterate over registered users
      for (const userId of event.registeredUsers) {
        const User = await user.findById(userId);
        if (User) {
          // Push user details into registeredUsers array
          eventDetails.registeredUsers.push({
            email: User.email,
            department: User.department
          });
        }
      }

      // Push event details into eventData array
      eventData.push(eventDetails);
    }

    // Send the combined data as the response
    res.json(eventData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to add a question for an event
router.post('/:eventId/questions', fetchuser, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { question } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.questions.push({ question, askedBy: userId });
    await event.save();

    res.status(201).json({ message: 'Question added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get questions for an event
router.get('/:eventId/questions', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId)
      .populate({
        path: 'questions.askedBy',
        select: 'fullname'
      })
      .populate({
        path: 'questions.replies.repliedBy',
        select: 'fullname'
      });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const questions = event.questions;
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to add a reply to a question
router.post('/:eventId/questions/:questionId/replies', fetchuser, async (req, res) => {
  try {
    const { reply } = req.body;
    const { eventId, questionId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Convert questionId to string for comparison
    const stringQuestionId = questionId.toString();
    const questionIndex = event.questions.findIndex(q => q._id.toString() === stringQuestionId);
    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is registered for the event
    if (!event.registeredUsers.includes(userId)) {
      return res.status(401).json({ message: 'User is not registered for the event' });
    }

    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add reply to question
    event.questions[questionIndex].replies.push({
      reply,
      repliedBy: userId
    });
    await event.save();

    res.status(201).json({ message: 'Reply added successfully' });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
