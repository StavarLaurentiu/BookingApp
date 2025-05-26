import React from "react";
import "./AllRooms.css";
import { useState, useEffect } from "react";
import RoomCard from "./RoomCard";

const AllRooms = () => {
  const [roomData, setRoomData] = useState([]);
  const [hotelData, setHotelData] = useState({});
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
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
        setError("Failed to load hotel information");
      }
    }
    fetchHotelData();
  }, []);

  useEffect(() => { 
    // Fetch room data from the backend
    async function fetchRoomData() {
      try {
        setLoading(true);
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
        console.log("Fetching room data successful:", data);
        setRoomData(data);
      } catch (error) {
        console.error("Error during room fetch:", error);
        setError("Failed to load room information");
      } finally {
        setLoading(false);
      }
    }
    fetchRoomData();
  }, []);

  if (loading) {
    return (
      <div className="all-rooms-container">
        <h2>All Rooms</h2>
        <div className="loading-message">Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-rooms-container">
        <h2>All Rooms</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="all-rooms-container">
      <h2>All Rooms</h2>
      <div className="rooms-list">
        {roomData.length > 0 ? (
          roomData.map((room) => {
            // Convert backend data structure to match RoomCard expectations
            const roomWithHotelName = { 
              ...room,
              // Map backend hotel URL to hotel name
              hotel: hotelData[room.hotel] || "Hotel",
              // Map backend images array (objects with image URLs) to simple array of URLs
              images: room.images && room.images.length > 0 
                ? room.images.map(imgObj => imgObj.image)
                : [],
              // Ensure we have proper field mappings for the RoomCard component
              roomName: room.name,
              roomType: room.type,
            };
            return <RoomCard key={room.id || room.roomId} room={roomWithHotelName} />;
          })
        ) : (
          <div className="no-rooms-message">No rooms available</div>
        )}
      </div>
    </div>
  );
};

export default AllRooms;
