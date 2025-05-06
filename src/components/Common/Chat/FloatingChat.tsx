import React, { useState } from 'react';
import ChatBox from './Chat';


interface FloatingChatProps {
  complaintId: string;
  userId: string;
  mechanicId: string;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ complaintId, userId, mechanicId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <ChatBox
          complaintId={complaintId}
          userId={userId}
          mechanicId={mechanicId}
          onClose={toggleChat}
        />
      )}
    </div>
  );
};

export default FloatingChat;