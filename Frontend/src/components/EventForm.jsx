import React, { useState } from 'react';
import axios from 'axios';

const EventForm = ({ showModal, setShowModal, fetchData }) => {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: '',
        image: null,
        keywords: [],
        link: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEventData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const keywordsArray = eventData.keywords.split(',');
    
        const formData = new FormData();
        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('dateTime', eventData.dateTime);
        formData.append('location', eventData.location);
        formData.append('keywords', eventData.keywords.split(','));
        formData.append('link', eventData.link);
        formData.append('image', eventData.image);
    
        try {
            const response = await fetch('http://localhost:5000/api/events/addEvents', {
                method: 'POST',
                body: formData,
                headers: {
                    "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
                },
                // Do not set the Content-Type header, it will be set automatically
            });
    
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
    
            const responseData = await response.json();
    
            console.log(responseData); // Handle response as needed
    
            setEventData({
                title: '',
                description: '',
                dateTime: '',
                location: '',
                image: null,
                keywords: [],
                link: ''
            });
    
            setShowModal(false);
            fetchData();
            alert('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        }
    };
    
    

    return (
        showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 overflow-y-auto max-h-96">
                    <h2 className="text-2xl font-bold mb-4">Add Event Details: </h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Event Title</label>
                            <input type="text" name="title" value={eventData.title} onChange={handleChange} placeholder="eg. GitHub Workshop" className="mt-1 p-2 border rounded-md w-full" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={eventData.description} onChange={handleChange} placeholder="Enter event description in 20-30 words" className="mt-1 p-2 border rounded-md w-full" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input type="datetime-local" name="dateTime" value={eventData.dateTime} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" value={eventData.location} onChange={handleChange} placeholder="Enter event location" className="mt-1 p-2 border rounded-md w-full" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} placeholder="Upload event image" className="mt-1 p-2 border rounded-md w-full" required />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Keywords</label>
                            <input type="text" name="keywords" value={eventData.keywords} onChange={handleChange} placeholder="eg. keyword1, keyword2, keyword3" className="mt-1 p-2 border rounded-md w-full" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">WhatsApp Link</label>
                            <input type="text" name="link" value={eventData.link} onChange={handleChange} placeholder="Enter WhatsApp group link" className="mt-1 p-2 border rounded-md w-full" />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Event</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );  
};

export default EventForm;