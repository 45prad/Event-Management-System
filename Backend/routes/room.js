const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const data = require('../models/data');

router.get('/', async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Create a new room
  router.post('/addRoom', async (req, res) => {
    const room = new Room({
      roomNumber: req.body.roomNumber,

    });
  
    try {
      const newRoom = await room.save();
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Book a room
router.post('/:id/book', async (req, res) => {
  try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ message: 'Room not found' });

      const { committeeDetails, bookingTime, eventId } = req.body;
      
      // Update the allocatedTo and bookedAt arrays
      room.allocatedTo.push(committeeDetails);
      room.bookedAt.push(new Date(bookingTime)); // Convert bookingTime to Date object
      room.eventId.push(eventId);

      const eventData = await data.findById(eventId);
      eventData.status = `Approved and Room Allocated is ${room.roomNumber}`;
      eventData.RoomAllocated = true;
      await eventData.save();

      // Save the changes
      await room.save();

      res.json(room);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

  module.exports = router;