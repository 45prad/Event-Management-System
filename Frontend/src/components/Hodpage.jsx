import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../app.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function HodPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://event-management-system-ext9.onrender.com/api/data', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`https://event-management-system-ext9.onrender.com/api/data/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
        },
        body: JSON.stringify({ status: newStatus })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      const updatedData = data.map(item => {
        if (item._id === id) {
          const newStatusString = item.status ? `${item.status}, ${newStatus}` : newStatus;
          return { ...item, status: newStatusString };
        }
        return item;
      });
      fetchData();
      setData(updatedData);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">HOD Dashboard</h1>
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
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
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
              <td className="border px-4 py-2">{item.status}</td>
              <td className="border px-4 py-2">
                {
                  item.HODApproval == 1 ?
                    <>
                      <h1>Send to Principle for Approval</h1>
                    </>
                    :
                    item.HODApproval == 2 ? 
                    <>
                      <h1>Rejected Approval</h1>
                    </>
                    :
                    <div className='grid grid-cols-2'>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 flex flex-row justify-center items-center"
                        onClick={() => handleStatusUpdate(item._id, 'Approved by HOD')}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex flex-row justify-center items-center"
                        onClick={() => handleStatusUpdate(item._id, 'Rejected by HOD')}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                        Reject
                      </button>
                    </div>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HodPage;
