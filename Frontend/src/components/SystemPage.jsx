import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../app.css';
import { useNavigate } from 'react-router-dom';

function SystemDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch room data from backend API
    fetch('https://event-management-system-ext9.onrender.com/api/room')
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

  useEffect(() => {
    fetchData();
  }, []);

  

  const fetchData = async () => {
    try {
      const response = await axios.get('https://event-management-system-ext9.onrender.com/api/data', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVenueAssignment = async (id) => {
    // Logic for venue assignment goes here
    console.log(`Assigning venue for item with ID: ${id}`);
  };

  const handleRoomAllocation = async (id) => {
    // Logic for room allocation goes here
    console.log(`Allocating room for item with ID: ${id}`);

    navigate(`/roombooking/${id}`);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">System Dashboard</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name of the Committee</th>
            <th className="border px-4 py-2">Event Type</th>
            <th className="border px-4 py-2">Event Name</th>
            <th className="border px-4 py-2">Convenor Name</th>
            <th className="border px-4 py-2">Event Date</th>
            <th className="border px-4 py-2">Duration</th>
            <th className="border px-4 py-2">POA PDF</th>
            <th className="border px-4 py-2">Allot Venue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i + 1}>
              <td className="border px-4 py-2">{i + 1}</td>
              <td className="border px-4 py-2">{item.committeeName}</td>
              <td className="border px-4 py-2">{item.eventType}</td>
              <td className="border px-4 py-2">{item.eventName}</td>
              <td className="border px-4 py-2">{item.convenorName}</td>
              <td className="border px-4 py-2">{item.eventDate}</td>
              <td className="border px-4 py-2">{item.duration}</td>
              <td className="border px-4 py-2">
                <a href={`https://event-management-system-ext9.onrender.com/uploads/${item.poaPdf}`} target="_blank" rel="noopener noreferrer">View PDF</a>
              </td>
              <td className="border px-4 py-2">
                {rooms.some(room => room.eventId.some(eventId => eventId === item._id)) ? (
                  <div>
                     <h1>{item.committeeName +"\n"+ item.eventDate.split('T')[0]} <br/> Room Allocated: {rooms.find(room => room.eventId.some(eventId => eventId === item._id)).roomNumber}</h1> 
                  </div>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRoomAllocation(item._id)}
                  >
                    Allocate Room
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SystemDashboard;
