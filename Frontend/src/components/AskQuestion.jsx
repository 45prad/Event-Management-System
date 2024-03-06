import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons'; // Importing faEye icon


const AskQuestion = ({ eventId }) => {
    const [questionInput, setQuestionInput] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false);
    const [replyInput, setReplyInput] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/questions`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                throw new Error('Failed to fetch questions');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAskQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'FrAngel-auth-token': localStorage.getItem('FrAngel-auth-token'),
                },
                body: JSON.stringify({ question: questionInput }),
            });
            if (response.ok) {
                // Optionally, you can add a callback here to notify the parent component about the successful question submission
                console.log('Question submitted successfully');
                fetchQuestions();
            } else {
                throw new Error('Failed to ask question');
            }
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

    const handleReply = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/questions/${questionId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'FrAngel-auth-token': localStorage.getItem('FrAngel-auth-token'),
                },
                body: JSON.stringify({ reply: replyInput }),
            });

            if (response.ok) {
                // Optionally, you can add a callback here to notify the parent component about the successful reply submission
                console.log('Reply submitted successfully');
                // Clear input field after submission
                setReplyInput('');
                setReplyTo(null);
            } else {
                throw new Error('Failed to submit reply');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    // Function to toggle question visibility
    const toggleQuestions = () => {
        setShowQuestions(!showQuestions);
    };

    const handleReplyClick = (questionId) => {
        setReplyTo(questionId);
    };

    return (
        <div className="flex flex-col lg:w-3/5 lg:mx-auto mt-4">
            <div className='flex flex-row'>
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    className="border-none outline-none rounded-md p-2 mb-2 w-full bg-transparent"
                />
                <button
                    className="mr-4 text-blue-500" // Added flex and items-center classes
                    type="button"
                    onClick={handleAskQuestion}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                <button onClick={toggleQuestions} className="text-blue-500 mr-2">
                    <FontAwesomeIcon icon={faComment}  fill='none'/>
                </button>
            </div>
            {showQuestions && (
                <div>
                    <h2 className='font-bold text-lg' >Questions:</h2>
                    <ul>
                    {questions.map((question, index) => (
                            <li key={index} className='ms-4'>
                                <label htmlFor={question.askedBy.fullname} className='font-bold text-lg'>Question By: <span className='underline'>{question.askedBy.fullname}</span></label>
                                <p className='font-normal text-md'>{question.question}</p>
                                {question.replies && question.replies.length > 0 && (
                                    <ul>
                                        {question.replies.map((reply, replyIndex) => (
                                            <li key={replyIndex} className=''>
                                                <p><span className='font-bold'>[{reply.repliedBy.fullname}]</span> {reply.reply} </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {replyTo === question._id && (
                                    <div className='flex flex-row'>
                                        <input
                                            type="text"
                                            placeholder="Your reply..."
                                            value={replyInput}
                                            onChange={(e) => setReplyInput(e.target.value)}
                                            className="border-none outline-none rounded-md p-2 mb-2 w-full bg-transparent"
                                            key={`reply-input-${question._id}`} // Unique key for input field
                                        />
                                        <button onClick={() => handleReply(question._id)}><FontAwesomeIcon icon={faPaperPlane} /></button>
                                    </div>
                                    
                                )}
                                <button onClick={() => handleReplyClick(question._id)} className="text-gray-500 mb-2">
                                    Reply
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AskQuestion;
