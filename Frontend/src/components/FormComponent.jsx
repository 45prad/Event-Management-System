import React, { useState } from 'react';
import jsPDF from 'jspdf';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    committeeName: '',
    eventName: '',
    eventType: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venueRequired: '',
    otherResourcesRequired: '',
    budget: '',
    contactPersonName: '',
    contactPersonMobile: '',
    contactPersonEmail: '',
    otherNotes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  
  
  const generatePDF = () => {
    const doc = new jsPDF();
    const {
      committeeName,
      eventName,
      eventType,
      eventDescription,
      startDate,
      endDate,
      startTime,
      endTime,
      venueRequired,
      otherResourcesRequired,
      budget,
      contactPersonName,
      contactPersonMobile,
      contactPersonEmail,
      otherNotes,
    } = formData;

    // Generate the letter content with subject line mentioning event name and type
    const subject = `Permission Request for ${eventName} - ${eventType} event `;
    const letterContent = `
    Date: ${new Date().toLocaleDateString()}
    
    Subject: ${subject}
    
    Dear HOD/Principal's,
    
    I am ${committeeName}'s president writing to request permission for our 
    upcoming event:
    
    Committee Name: ${committeeName}
    Event Name: ${eventName}
    Event Type: ${eventType}
    Event Description: ${eventDescription}
    Start Date: ${startDate}
    Start Time: ${startTime}
    Venue Required: ${venueRequired}
    Other Resources Required: ${otherResourcesRequired}
    Budget: ${budget}
    Contact Person Name: ${contactPersonName}
    Contact Person Mobile: ${contactPersonMobile}
    Contact Person Email: ${contactPersonEmail}
    Other Notes: ${otherNotes}
    
    Thank you for considering our request. We assure you that all necessary 
    arrangements will be made to ensure the success and safety of the event.
    
    Sincerely,
    ${contactPersonName}
    ${committeeName} president 

    
        `;

    doc.text(letterContent, 10, 10); // Adjust position as needed

    doc.save('permission_letter.pdf');
  };

  const getUser = async () => {
    // API call
    const response = await fetch('https://event-management-system-ext9.onrender.com/api/auth/getuser', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "FrAngel-auth-token": localStorage.getItem('FrAngel-auth-token')
      },
    });
    const json = await response.json();
    setUser(json)
    console.log(user);

  }

  return (
    <div  className="flex justify-center items-center h-screen bg-gray-100" >
      <div className="bg-white p-8 rounded-lg shadow-lg" >
        <h2 className="text-2xl font-semibold mb-4 text-center">Event Details Form</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Committee Name:</label>
            <input type="text" name="committeeName" value={formData.committeeName} onChange={handleChange} className="input-field border p-1 rounded" placeholder='eg. GDSC'/>
          </div>
          <div>
            <label className="block font-semibold">Event Name:</label>
            <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} className="input-field border p-1 rounded" placeholder='eg. GitHub Workshop'/>
          </div>
          <div>
            <label className="block font-semibold">Event Type:</label>
            <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} className="input-field border p-1 rounded" placeholder='eg. Technical / Non - Technical'/>
          </div>
          <div>
            <label className="block font-semibold">Event Description:</label>
            <textarea name="eventDescription" value={formData.eventDescription} onChange={handleChange} className="input-field border p-1 rounded resize-none" placeholder='In 20-30 words'/>
          </div>
          <div>
            <label className="block font-semibold">Start Date:</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          {/* <div>
            <label className="block font-semibold">End Date:</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input-field" />
          </div> */}
          <div>
            <label className="block font-semibold">Start Time:</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          {/* <div>
            <label className="block font-semibold">End Time:</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="input-field" />
          </div> */}
          <div>
            <label className="block font-semibold">Venue Required:</label>
            <input type="text" name="venueRequired" value={formData.venueRequired} onChange={handleChange} className="input-field border p-1 rounded" placeholder='eg. M202'/>
          </div>
          <div>
            <label className="block font-semibold">Other Resources Required:</label>
            <input type="text" name="otherResourcesRequired" value={formData.otherResourcesRequired} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Budget:</label>
            <input type="text" name="budget" value={formData.budget} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Contact Person Name:</label>
            <input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Contact Person Mobile:</label>
            <input type="text" name="contactPersonMobile" value={formData.contactPersonMobile} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          <div>
            <label className="block font-semibold">Contact Person Email:</label>
            <input type="email" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleChange} className="input-field border p-1 rounded" />
          </div>
          
        
          <button type="submit" className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;