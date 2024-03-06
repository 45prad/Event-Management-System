import React, { useState } from 'react';

function TailwindModal({ isOpen, onClose, title, onSubmit }) {
  const [formData, setFormData] = useState({
    id: 0,
    committeeName: '',
    eventType: '',
    eventName: '',
    convenorName: '',
    eventDate: '',
    duration: 0,
    poaPdf: null,
    status: 'Pending from all',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      id: 0,
      committeeName: '',
      eventType: '',
      eventName: '',
      convenorName: '',
      eventDate: '',
      duration: 0,
      poaPdf: null,
      status: 'Pending from all',
    });
  };

  return (
    <div className={`${isOpen ? 'fixed' : 'hidden'} inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white p-8 rounded-lg w-1/2">
        <div className="flex justify-between items-center border-b-2 pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="committeeName" className="block text-sm font-medium text-gray-700">Committee Name</label>
            <input type="text" id="committeeName" name="committeeName" value={formData.committeeName} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
            <input type="text" id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
            <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="convenorName" className="block text-sm font-medium text-gray-700">Convenor Name</label>
            <input type="text" id="convenorName" name="convenorName" value={formData.convenorName} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
            <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="mb-4">
            <label htmlFor="poaPdf" className="block text-sm font-medium text-gray-700">POA PDF</label>
            <input type="file" id="poaPdf" name="poaPdf" onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default TailwindModal;
