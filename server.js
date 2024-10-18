const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geolib = require('geolib');

let experiences = [
  {id: 1, location: {lat: 38.710712892523695, lng: -9.14116628132217}, minDistance: 10, name: 'Bertrand', image: '', nUsersIn: 0},
  {id: 2, location: {lat: 38.709899442837504, lng: -9.141786418367884}, minDistance: 10, name: 'Modelo', image: '', nUsersIn: 0},
  {id: 3, location: {lat: 38.71051049617013, lng: -9.142228602930569}, minDistance: 10, name: 'Estatua', image: '', nUsersIn: 0},
  {id: 4, location: {lat: 38.709363862713104, lng: -9.141031676168348}, minDistance: 10, name: 'MUP', image: '', nUsersIn: 0},
  {id: 5, location: {lat: 38.65109183413688, lng: -9.173760194424412}, minDistance: 20, name: 'Casa Teste', image: '', nUsersIn: 0}
]

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://reactgeolocation.netlify.app", // The frontend URL
    methods: ["GET", "POST"]
  }
});

io.emit('experiences', experiences);

io.on('connection', (socket) => {
  console.log('A user connected');

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
