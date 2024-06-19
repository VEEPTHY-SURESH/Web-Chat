const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/resolvai';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Message = mongoose.model('Message', messageSchema);

// Enable CORS
app.use(cors());

io.on('connection', async (socket) => {
    console.log('New client connected');

    try {
        // Retrieve message history and emit to the newly connected client
        const messages = await Message.find().sort('createdAt');
        socket.emit('message history', messages);
    } catch (err) {
        console.error('Error retrieving messages:', err);
    }

    socket.on('message', async (content) => {
        console.log('Message received:', content);
        try {
            // Save the message to the database
            const newMessage = new Message({ content: content, sender: 'Anonymous' });
            const savedMessage = await newMessage.save();
            // Emit the saved message to all clients including the sender
            io.emit('message', savedMessage);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
