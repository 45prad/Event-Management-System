import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RoomBooking() {
  const { eventId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [committeeDetails, setCommitteeDetails] = useState('');
  const [bookingTime, setBookingTime] = useState(new Date()); // Default to current date
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch room data from backend API
    fetch('http://localhost:5000/api/room')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        return response.json();
      })
      .then(data => {
        setRooms(data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  // Filter rooms based on selected date and booked status
  const filteredRooms = rooms.filter(room => {
    const selectedDate = new Date(bookingTime).setHours(0, 0, 0, 0); // Reset time to start of day
    return room.bookedAt.some(date => new Date(date).setHours(0, 0, 0, 0) === selectedDate); // Check if selected date matches any booking date
  });


  const bookRoom = (roomId) => {
    const room = rooms.find(room => room._id === roomId);
    if (!room) {
      console.error('Room not found');
      return;
    }
    if (!room.booked) {
      setSelectedRoom(room);
      setModalOpen(true);
    } else {
      setModalOpen(true); // Open modal to display booking details
    }
  };

  const handleSubmit = () => {
    if (!committeeDetails || !bookingTime) {
      alert('Please fill in all details');
      return;
    }
    // Make API call to book the room
    fetch(`http://localhost:5000/api/room/${selectedRoom._id}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: eventId, committeeDetails: committeeDetails, bookingTime: bookingTime })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to book room');
        }
        return response.json();
      })
      .then(data => {
        console.log('Room booked successfully:', data);
        // Update room status locally
        setRooms(rooms.map(room => {
          if (room._id === selectedRoom._id) {
            const updatedBookedAt = Array.isArray(room.bookedAt) ? [...room.bookedAt, bookingTime] : [bookingTime];
            return { ...room, booked: true, allocatedTo: committeeDetails, bookedAt: updatedBookedAt, eventId: eventId };
          }
          return room;
        }));
        // Close the modal
        setModalOpen(false);
        setSelectedRoom(null);
        setCommitteeDetails('');
        setBookingTime(new Date()); // Reset to current date
      })
      .catch(error => {
        console.error('Error booking room:', error);
      });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl pb-4">Room Booking</h1>
      <div className="flex">
        {/* Calendar */}
        <div className="w-[15%] pr-4">
          <DatePicker
            selected={bookingTime}
            onChange={(date) => setBookingTime(date)}
            dateFormat="MMMM d, yyyy"
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        {/* Room list */}
        <div className="w-[85%]">
          <div className="grid grid-cols-12 gap-2">
            {rooms.map(room => (
              <div key={room._id} className={`p-4 rounded-md ${Array.isArray(room.bookedAt) && room.bookedAt.some(date => new Date(date).setHours(0, 0, 0, 0) === new Date(bookingTime).setHours(0, 0, 0, 0)) ? 'bg-red-500' : 'bg-blue-200'}`} onClick={() => bookRoom(room._id)}>
                <h2>Room {room.roomNumber}</h2>
                {Array.isArray(room.bookedAt) && room.bookedAt.map((date, index) => {
                  if (new Date(date).setHours(0, 0, 0, 0) === new Date(bookingTime).setHours(0, 0, 0, 0)) {
                    return <p key={index}>Booked by: {Array.isArray(room.allocatedTo) ? room.allocatedTo[index] : ''}</p>;
                  }
                  return null;
                })}
              </div>
            ))}
          </div>
        </div>


      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            {selectedRoom && (
              <div>
                <p>Room: {selectedRoom.roomNumber}</p>
                {selectedRoom.booked ? (
                  <div>
                    <p>Booked by: {selectedRoom.allocatedTo}</p>
                    <p>Booking Time: {selectedRoom.bookedAt}</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="mb-4">
                      <label htmlFor="committeeDetails" className="block font-medium">Committee Details:</label>
                      <input type="text" id="committeeDetails" className="border border-gray-300 rounded-md p-2 w-full" value={committeeDetails} onChange={(e) => setCommitteeDetails(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="bookingTime" className="block font-medium">Booking Time:</label>
                      <input type="datetime-local" id="bookingTime" className="border border-gray-300 rounded-md p-2 w-full" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
                    </div>
                    <div className="flex flex-row">
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Book</button>
                      <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
