import React, { useState,useContext } from 'react';
import myContext from '../../context/data/myContext';
import Loader from '../../components/loader/Loader';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { fireDB } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';


const FeedbackPage = () => {
  const context = useContext(myContext);
  const { mode } = context;
  const { loading, setLoading } = context;
  const [message, setMessage] = useState('');
  const userData = JSON.parse(localStorage.getItem('user'))?.user ?? 'null';
  const [feedback, setFeedback] = useState({
    message: '',
    time: Timestamp.now(),
    email: userData?.email || null
  });

  

  const handleSendClick = async () => {
    if (message === '' || message == undefined) {
      return toast.error('Text area is blank!');
    }
    setLoading(true);
  
    try {
      feedback.message = message;
      await addDoc(collection(fireDB, "feedback"), feedback);
      toast.success("Feedback sent successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send feedback");
      setLoading(false);
    }
  
    setMessage('');
  };


  return (
    <div className="mx-auto my-4 md:my-10 lg:my-10 w-3/4 md:w-2/3 lg:w-1/2 h-72 border-2 border-gray-400 rounded-lg relative">
      {loading && <Loader />}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Help us to improve your experience, write a feedback..."
        className="w-full p-2 rounded-md h-3/4 md:h-3/8 resize-none outline-none"
        style={{ backgroundColor: 'transparent', color: mode === 'dark' ? 'white' : '' }}
      />
      <button
        onClick={handleSendClick}
        className="bg-neutral-950 absolute bottom-2 right-2 text-white px-7 py-2 rounded-md"
      >
        Send
      </button>
    </div>
  );
};

export default FeedbackPage;
