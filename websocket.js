const http = require('http');
const WebSocketServer = require('websocket').server;
const express = require('express');
let connections = [];



const app = express();

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "connect-src 'self' ws://localhost:8000");
    next();
  });
// Create HTTP server
const httpserver = http.createServer();

// Create WebSocket server
const websocket = new WebSocketServer({ httpServer: httpserver });

// Listen on port 8000
httpserver.listen(8000, () => console.log("My server is listening on port 8000"));

// Handle WebSocket requests
websocket.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  // Handle incoming messages
  connection.on('message', (message) => {
    connections.forEach((c) =>
      c.send(`User ${connection.socket.remotePort} says: ${message.utf8Data}`)
    );
  });

  // Add the new connection to the list
  connections.push(connection);

  console.log("connnections", connections)

  // Notify all connections about the new user
  connections.forEach((c) =>
    c.send(`User ${connection.socket.remotePort} just connected`)
  );
});
