import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const RegisteredUsersList = ({ users }) => (
    <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
      {users.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table header */}
          <thead className="bg-gray-500">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-white font-bold text-md uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-white font-bold text-md uppercase tracking-wider"
              >
                Department
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p-4 text-gray-500">No registrations yet.</p>
      )}
    </div>
  );

const EventWithRegisteredUsers = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div key={event.title} className="mb-8 p-4 border rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <FontAwesomeIcon
          icon={showDetails ? faChevronUp : faChevronDown}
          onClick={toggleDetails}
          className="cursor-pointer text-blue-500 hover:text-blue-700"
        />
      </div>
      {showDetails && (
        <>
          <h4 className="text-lg font-semibold mb-2">Registered Users:</h4>
          <RegisteredUsersList users={event.registeredUsers} />
        </>
      )}
    </div>
  );
};

const EventsAndRegisteredUsers = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://event-management-system-ext9.onrender.com/api/events/registerations", {
        headers: {
          "FrAngel-auth-token": localStorage.getItem("FrAngel-auth-token")
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Events and Registered Users</h2>
      {events.map((event, index) => (
        <EventWithRegisteredUsers key={index} event={event} />
      ))}
    </div>
  );
};

export default EventsAndRegisteredUsers;
