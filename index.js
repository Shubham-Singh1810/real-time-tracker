const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-order", (orderId) => socket.join(orderId));

  socket.on("update-location", (data) => {
    const { orderId, lat, lng } = data;

    // Check if coordinates are valid
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      socket.to(orderId).emit("location-synced", data);
    } else {
      console.log("Invalid GPS data received");
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server live on port ${PORT}`));
