const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geolib = require('geolib');



const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://reactgeolocation.netlify.app", // The frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('feedback', (feedback) => {
    console.log(feedback);
  })

  // Listen for location updates from clients
  socket.on('send-location', (user_location, target_location, user) => {
    console.log('User location:', user_location);
    console.log('Target location:', target_location);
    console.log('user id:', user);
    
    const distanceInMeters = geolib.getDistance(user_location, target_location);

    console.log('Distance between user and target(m):', distanceInMeters);

    // Broadcast location to all other clients
    socket.broadcast.emit('user-location', user_location, user);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
