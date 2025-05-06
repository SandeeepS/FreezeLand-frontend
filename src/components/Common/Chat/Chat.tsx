import React, { useState, useEffect, } from "react";
import io, { Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; // Your backend URL

interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

const Chat:React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    console.log("inintilised the socket in ");
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("receive_message", (data: Message) => {
      setMessages((prev: Message[]) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const joinRoom = () => {
    if (room !== "" && socket) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message !== "" && socket && joined) {
      const messageData = {
        room: room,
        author: socket.id || "Unknown",
        message: message,
        time: new Date(Date.now()).toLocaleTimeString(),
      };

      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container mt-64">
      {!joined ? (
        <div className="join-container">
          <h3>Join a Chat Room</h3>
          <input
            type="text"
            placeholder="Room ID..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chat-box">
          <h3>Chat Room: {room}</h3>
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.author === (socket?.id || "Unknown") ? "sent" : "received"
                }`}
              >
                <p>{msg.message}</p>
                <span>{msg.time}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
