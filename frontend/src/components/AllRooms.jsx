import React from "react";
import "./AllRooms.css";
import { useState, useEffect } from "react";
import deluxe1 from "../assets/images/deluxe1.jpg";
import deluxe2 from "../assets/images/deluxe2.jpg";
import family_suite1 from "../assets/images/family_suite1.jpg";
import family_suite2 from "../assets/images/family_suite2.webp";
import family_suite3 from "../assets/images/family_suite3.jpg";
import standard1 from "../assets/images/standard1.jpg";
import standard2 from "../assets/images/standard2.webp";
import RoomCard from "./RoomCard";


const AllRooms = () => {
  const [roomData, setRoomData] = useState([]);
  


  let roomDataDummy = [
    {
      roomId: "101",
      roomName: "Deluxe Suite",
      roomType: "Suite",
      isOccupied: true,
      occupiedDates: [
        {
          date: "2024-11-10",
        },
        {
          date: "2024-11-11",
        },
      ],
      pricePerNight: 150,
      currency: "USD",
  
      maxOccupancy: 2,
      images: [deluxe1, deluxe2],
      description: "A spacious suite with a beautiful view.",
    },
    {
      roomId: "102",
      roomName: "Standard Room",
      roomType: "Standard",
      isOccupied: false,
      occupiedDates: [],
      pricePerNight: 100,
      currency: "USD",
  
      maxOccupancy: 2,
      images: [standard1, standard2],
      description: "A cozy room ideal for single travelers or couples.",
    },
    {
      roomId: "201",
      roomName: "Family Suite",
      roomType: "Suite",
      isOccupied: false,
      occupiedDates: [
        {
          date: "2024-11-25",
          occupierInfo: {
            uid: "guest789",
            name: "Jane Smith",
            contact: "janesmith@example.com",
          },
        },
      ],
      pricePerNight: 200,
      currency: "USD",
      maxOccupancy: 4,
      images: [family_suite1, family_suite2, family_suite3],
      description:
        "Perfect for families, with spacious living and a kitchenette.",
    },
  ];

  useEffect(() => {
    // async function fetchRoomData() {
    //   try {
    //     const response = await fetch(
    //       "https://booking-app-backend-4vb9.onrender.com/rooms/",
    //       {
    //         method: "GET",
    //       }
    //     );

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch room data.");
    //     }

    //     const data = await response.json(); // Parse the JSON response

    //     console.log("Fetching successful:", data);
    //     setRoomData(data);
    //   } catch (error) {
    //     console.error("Error during fetch:", error);
    //   }
    // }
    // fetchRoomData();
    setRoomData(roomDataDummy)
  }, []);
  return (
    <div className="all-rooms-container">
      <h2>All Rooms</h2>
      <div className="rooms-list">
        {roomData.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default AllRooms;
