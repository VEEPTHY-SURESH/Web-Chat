import React, { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

let socket;

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);
    useEffect(() => {
        // Connect to the server
        socket = io('http://localhost:5000');

        // Listen for incoming messages
        socket.on('message', (message) => {
            setMessages((msgs) => [...msgs, message]);
        });

        // Listen for message history
        socket.on('message history', (history) => {
            setMessages(history);
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollTop = endOfMessagesRef.current.scrollHeight;
        }
      }, [messages]);

    const sendMessage = () => {
        if (message) {
            console.log(message+" emitted");
            socket.emit('message', message);
            setMessage('');
        }
    };

    return (
        <div className='chatbox'>
            <div id="message-container" ref={endOfMessagesRef}>
                {messages.map((msg, index) => (
                    <div className='message' key={index}>
                        <p className='name'>New Message</p>
                        <p className='text'>{msg.content}</p>
                        <p className='date'>{msg.createdAt.slice(0,10)}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder='type here....'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
