import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AskQuestion from './AskQuestion';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [userId, setUserId] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(1);
    const [likedMostRating, setLikedMostRating] = useState(1);
    const [improvementsRating, setImprovementsRating] = useState(1);
    const [recommendationRating, setRecommendationRating] = useState(1);
    const [comments, setComments] = useState("");
    const [selectedEventId, setSelectedEventId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/getuser', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
                },
            });
            if (response.ok) {
                const json = await response.json();
                setUserId(json._id);
            } else {
                throw new Error('Failed to get user data');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/events");
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                throw new Error("Failed to fetch events");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleRSVP = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'FrAngel-auth-token': localStorage.getItem("FrAngel-auth-token")
                }
            });
            if (response.ok) {
                // Refresh events after successful RSVP
                const updatedEvents = await response.json();
                setEvents(updatedEvents);
                fetchEvents();
            } else {
                throw new Error('Failed to RSVP');
            }
        } catch (error) {
            console.error('Error RSVPing to event:', error);
        }
    };


    const handleOpenFeedbackModal = (eventId) => {
        setShowFeedbackModal(true);
        setSelectedEventId(eventId);
    };

    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
    };

    const handleSubmitFeedback = async () => {
        const feedbackData = {
            rating,
            likedMostRating,
            improvementsRating,
            recommendationRating,
            comments
        };
        try {
            const response = await fetch(`http://localhost:5000/api/events/${selectedEventId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'FrAngel-auth-token': localStorage.getItem('FrAngel-auth-token')
                },
                body: JSON.stringify(feedbackData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Feedback saved successfully message from backend
                // Reset form fields
                setRating(1);
                setLikedMostRating(1);
                setImprovementsRating(1);
                setRecommendationRating(1);
                setComments("");
                handleCloseFeedbackModal();
            } else {
                throw new Error('Failed to submit feedback');
            }


        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        filterEvents(e.target.value);
    };

    const filterEvents = (query) => {
        const filtered = events.filter((event) =>
            event.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const eventsToDisplay = searchQuery ? filteredEvents : events;

    const isEventExpired = (eventDate) => {
        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        return eventDateObj < currentDate;
    };

    return (
        <div className="mt-8 mx-8">
            <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            {eventsToDisplay.map((event, index) => (
                <div className="flex flex-col border-2 rounded-2xl p-4 my-8">
                    <div key={index} className="flex md:flex-row flex-col items-center">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-[120px] h-[120px] rounded-full mx-16"
                        />
                        <div>
                            <Typography variant="h5" gutterBottom>
                                {event.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {event.date} - {event.location}
                            </Typography>
                            <div className="flex flex-row flex-wrap py-2">
                                {event.tag.map((tag, index) => (
                                    <div key={index} className="px-4 py-1 me-2 bg-gray-200 rounded-md">{tag}</div>
                                ))
                                }
                            </div>
                            <Typography variant="body1">{event.description}</Typography>
                            {(isEventExpired(event.date) && event.registeredUsers.includes(userId)) ? (
                                <button
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    type="button"
                                    onClick={() => handleOpenFeedbackModal(event._id)}
                                >
                                    Feedback Form
                                </button>
                            ) : (
                                <button
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    type="button"
                                    onClick={() => handleRSVP(event._id)}
                                    style={{ backgroundColor: event.registeredUsers.includes(userId) ? 'green' : 'blue', color: 'white' }}
                                >
                                    {event.registeredUsers.includes(userId) ? 'Registered' : 'RSVP'}
                                </button>
                            )}

                        </div>
                    </div>
                    <AskQuestion eventId={event._id}/>

                </div>
            ))}
            {showFeedbackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white rounded-lg p-6 w-full md:w-2/3 lg:w-1/3 overflow-y-auto h-full md:max-h-96">
                        <h2 className="text-xl font-semibold mb-4">Event Feedback Form</h2>
                        <div className="flex flex-col space-y-4">
                            <label className="text-lg">Rate the event:</label>
                            <select
                                className="px-4 py-2 border rounded-lg"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <label className="text-lg">What did you like the most about the event?</label>
                            <select
                                className="px-4 py-2 border rounded-lg"
                                value={likedMostRating}
                                onChange={(e) => setLikedMostRating(e.target.value)}
                            >
                                <option value="Not much">Not much</option>
                                <option value="A little">A little</option>
                                <option value="Average">Average</option>
                                <option value="Quite a bit">Quite a bit</option>
                                <option value="A lot">A lot</option>
                            </select>
                            <label className="text-lg">What could be improved?</label>
                            <select
                                className="px-4 py-2 border rounded-lg"
                                value={improvementsRating}
                                onChange={(e) => setImprovementsRating(e.target.value)}
                            >
                                <option value="Not needed">Not needed</option>
                                <option value="Minor improvements needed">Minor improvements needed</option>
                                <option value="Some improvements needed">Some improvements needed</option>
                                <option value="Significant improvements needed">Significant improvements needed</option>
                                <option value="Major improvements needed">Major improvements needed</option>
                            </select>
                            <label className="text-lg">How likely are you to recommend this event to others?</label>
                            <select
                                className="px-4 py-2 border rounded-lg"
                                value={recommendationRating}
                                onChange={(e) => setRecommendationRating(e.target.value)}
                            >
                                <option value="Not likely">Not likely</option>
                                <option value="Somewhat likely">Somewhat likely</option>
                                <option value="Neutral">Neutral</option>
                                <option value="Likely">Likely</option>
                                <option value="Very likely">Very likely</option>
                            </select>
                            <label className="text-lg">Any other comments or suggestions?</label>
                            <textarea
                                className="px-4 py-2 border rounded-lg"
                                rows="3"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleCloseFeedbackModal}>Close</Button>
                            <Button onClick={handleSubmitFeedback} variant="contained" color="primary">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
