// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS module

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/realtime-chart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Create schema and model for data
const DataSchema = new mongoose.Schema({
  value: Number,
});
const Data = mongoose.model("Data", DataSchema);

// Function to generate random data
const generateRandomData = () => {
  return Math.floor(Math.random() * 100); // Generates random numbers between 0 and 100
};

// Function to save data to database
const saveDataToDB = () => {
  const newValue = generateRandomData();
  const newData = new Data({ value: newValue });
  newData
    .save()
    .then(() => console.log("Data saved to database:", newValue))
    .catch((err) => console.error("Error saving data to database:", err));
};

io.on("connection", (socket) => {
  console.log("Client connected");

  // Emit data every second
  setInterval(async () => {
    const newData = await Data.findOne().sort({ $natural: -1 }).limit(1);
    socket.emit("data", newData.value); // Emitting only the value
  }, 1000);
});

// Save data to database every 5 seconds
setInterval(saveDataToDB, 1000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
