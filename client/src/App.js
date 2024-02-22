import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Initialize Socket.io connection

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Set up event listener for 'data' event
    socket.on("data", handleData);

    // Clean up function to remove event listener when component unmounts
    return () => {
      socket.off("data", handleData);
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  // Function to handle incoming data
  const handleData = (newData) => {
    setData((prevData) => [...prevData, newData]);
  };

  return (
    <div>
      <h1>Real-time Chart</h1>
      <ul>
        {data.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
