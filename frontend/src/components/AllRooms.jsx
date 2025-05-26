import React from "react";
import "./AllRooms.css";
import { useState, useEffect } from "react";
import RoomCard from "./RoomCard";

const AllRooms = () => {
  const [roomData, setRoomData] = useState([]);
  const [hotelData, setHotelData] = useState({});
  const [hotels, setHotels] = useState([]);
  
  // Fetch hotel data from the backend
  useEffect(() => {
    async function fetchHotelData() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/hotels/",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hotel data.");
        }

        const data = await response.json();
        console.log("Fetching hotel data successful:", data);
        
        // Extract unique hotels for the dropdown
        const uniqueHotels = [...new Set(data.map(item => item.name))];
        setHotels(uniqueHotels);
        
        // Create a mapping of hotel URLs to hotel names
        const hotelMapping = {};
        data.forEach(hotel => {
          hotelMapping[hotel.url] = hotel.name;
        });
        setHotelData(hotelMapping);
      } catch (error) {
        console.error("Error during hotel fetch:", error);
      }
    }
    fetchHotelData();
  }, []);

  useEffect(() => { 
    // Fetch room data from the backend
    async function fetchRoomData() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/rooms/",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room data.");
        }

        const data = await response.json();
        console.log("Fetching successful:", data);
        setRoomData(data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
    fetchRoomData();
  }, []);
  
  return (
    <div className="all-rooms-container">
      <h2>All Rooms</h2>
      <div className="rooms-list">
        {roomData.map((room) => {
          // Convert backend data structure to match RoomCard expectations
          const roomWithHotelName = { 
            ...room, 
            hotel: hotelData[room.hotel],
            images: room.images.map(imgObj => imgObj.image),
            // Map backend fields to expected frontend fields
            roomName: room.name,
            roomType: room.type,
            // Keep other fields as they are
          };
          return <RoomCard key={room.id || room.roomId} room={roomWithHotelName} />;
        })}
      </div>
    </div>
  );
};

export default AllRooms;