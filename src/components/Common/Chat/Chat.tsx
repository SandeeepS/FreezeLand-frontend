import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { getComplaintDetails } from "../../../Api/chat";

// Define message interface
export interface Message {
  senderId: string;
  message: string;
  sendAt: string;
  senderType: string;
}

interface ChatBoxProps {
  complaintId: string;
  userId: string;
  mechanicId: string;
  isMinimized?: boolean;
  onClose?: () => void;
  roomId: string;
  senderType: string;
}

interface ComplaintDetails {
  userId: string;
  currentMechanicId: string;
}

const ENDPOINT = "http://localhost:5000"; // Your server URL

const ChatBox: React.FC<ChatBoxProps> = ({
  complaintId,
  userId,
  mechanicId,
  isMinimized = false,
  onClose,
  roomId,
  senderType,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [minimized, setMinimized] = useState(isMinimized);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [complaintDetails, setComplaintDetails] =
    useState<ComplaintDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintDetails = await getComplaintDetails(complaintId);
        console.log("ComplaintDetails in the chat page is", complaintDetails);
        setComplaintDetails(complaintDetails?.data.result[0]);
      } catch (error) {
        console.log(error as Error);
        throw error as Error;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const newSocket = io(ENDPOINT, { withCredentials: true });
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Join the chat room
    socket.emit("join_room", roomId);

    // Load previous messages
    socket.emit("get_messages", { roomId });

    const messageHandler = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    // Typing indicator handler
    const typingHandler = (data: { user: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setIsTyping(true);
        setTypingUser(data.user);
      } else {
        setIsTyping(false);
      }
    };

    // Previous messages handler
    const previousMessagesHandler = (data: { messages: Message[] }) => {
      setMessages(data.messages);
    };

    // Register event listeners
    socket.on("receive_message", messageHandler);
    socket.on("user_typing", typingHandler);
    socket.on("previous_messages", previousMessagesHandler);

    // Clean up event listeners
    return () => {
      socket.off("receive_message", messageHandler);
      socket.off("user_typing", typingHandler);
      socket.off("previous_messages", previousMessagesHandler);
    };
  }, [socket, roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get current user ID based on sender type
  let senderId: string = "";  
  if (senderType === "User" && complaintDetails?.userId) {
    senderId = complaintDetails.userId;
  } else if (senderType === "Mechanic" && complaintDetails?.currentMechanicId) {
    senderId = complaintDetails.currentMechanicId;
  }

  // Send message function
  const sendMessage = () => {
    if (newMessage.trim() === "" || !socket || !senderId) return;

    const messageData: Message = {
      senderId: senderId,
      message: newMessage,
      sendAt: new Date().toISOString(),
      senderType: senderType,
    };

    socket.emit("send_message", {
      roomId: roomId,
      ...messageData,
    });

    setNewMessage("");

    // Cancel typing indicator when message is sent
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit("typing", {
        room: roomId,
        isTyping: false,
        user: senderId,
      });
    }
  };

  // Handle input change and trigger typing event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (socket && senderId) {
      socket.emit("typing", {
        room: roomId,
        isTyping: true,
        user: senderId,
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          room: roomId,
          isTyping: false,
          user: senderId,
        });
      }, 2000);
    }
  };

  // Minimize/maximize chat window
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // If chat is minimized, show only the header
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 w-64 bg-white rounded-t-lg shadow-lg z-50">
        <div
          className="bg-freeze-color text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer"
          onClick={toggleMinimize}
        >
          <span className="font-medium">Chat</span>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50 flex flex-col"
      style={{ height: "400px" }}
    >
      {/* Chat header */}
      <div className="bg-freeze-color text-white p-3 rounded-t-lg flex justify-between items-center">
        <span className="font-medium">{senderType == "Mechanic"? "User":"Mechanic"}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMinimize}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {onClose && (
            <button onClick={onClose} className="text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            // This is the fixed line - compare message senderId with current user senderId
            const isMine = msg.senderId === senderId;

            return (
              <div
                key={index}
                className={`flex mb-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs ${
                    isMine
                      ? "bg-freeze-color text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span
                    className={`block text-xs ${
                      isMine ? "text-blue-100" : "text-gray-500"
                    } mt-1`}
                  >
                    {new Date(msg.sendAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="text-gray-500 text-sm ml-2">
            {typingUser === mechanicId ? "Mechanic" : "User"} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-freeze-color text-white px-4 focus:outline-none hover:bg-blue-700"
            disabled={!senderId}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;