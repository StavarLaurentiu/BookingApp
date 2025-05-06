import React from "react";
import RoomImageSlider from "./RoomImageSlider";
import { FaUsers, FaWifi, FaBed, FaThermometerHalf, FaTv, FaShower, FaCoffee } from "react-icons/fa";
import "./RoomDetails.css";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  // Calculate nights and total price
  const calculateBookingDetails = () => {
    if (!selectedDateRange || !selectedDateRange.startDate) {
      return { nights: 0, totalPrice: 0 };
    }

    const startDate = new Date(selectedDateRange.startDate);
    const endDate = selectedDateRange.endDate 
      ? new Date(selectedDateRange.endDate) 
      : new Date(selectedDateRange.startDate);
    
    // Calculate number of nights
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const nights = Math.round(Math.abs((endDate - startDate) / oneDay)) || 1;
    
    // Calculate total price
    const totalPrice = room.pricePerNight * nights;

    return { nights, totalPrice };
  };

  const { nights, totalPrice } = calculateBookingDetails();

  // Room features based on room type
  const getRoomFeatures = () => {
    const baseFeatures = [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaTv />, name: "Smart TV" },
      { icon: <FaThermometerHalf />, name: "Climate Control" }
    ];

    if (room.roomType === "Suite") {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "King Size Bed" },
        { icon: <FaShower />, name: "Rainfall Shower" },
        { icon: <FaCoffee />, name: "Coffee Machine" }
      ];
    } else {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "Queen Size Bed" }
      ];
    }
  };

  const handleBooking = async (roomId, selectedDateRange) => {
    const baseURL = "https://booking-app-backend-4vb9.onrender.com";
    const roomUrl = `${baseURL}/rooms/${roomId}/`;

    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }
    
    try {
      for (
        let currentDate = new Date(selectedDateRange.startDate);
        currentDate <= new Date(selectedDateRange.endDate);
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const response = await fetch(`${baseURL}/occupied-dates/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: roomUrl,
            date: currentDate
              .toLocaleDateString("hu")
              .replace(/\./g, "-")
              .replace(/\s+/g, "")
              .slice(0, -1),
          }),
        });
        
        if (!response.ok) {
          throw new Error("Booking failed");
        }
      }
      
      onBookingSuccess();
      console.log("Booking successful for all selected dates");
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  return (
    <div className="room-card">
      <RoomImageSlider images={room.images} />
      <div className="room-info">
        <h2>{room.roomName}</h2>
        <p>
          <strong>Type:</strong> {room.roomType}
        </p>
        
        <div className="room-features">
          <span className="feature-tag"><FaUsers /> {room.maxOccupancy} Guests</span>
          {getRoomFeatures().map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature.icon} {feature.name}
            </span>
          ))}
        </div>
        
        <div className="price-container">
          <span className="currency">{room.currency}</span>
          <span className="price">{room.pricePerNight}</span>
          <span className="per-night"> / night</span>
        </div>
        
        {selectedDateRange && selectedDateRange.startDate && (
          <div className="booking-details">
            <p>
              <strong>{nights} night{nights !== 1 ? 's' : ''}</strong> • Total: 
              <strong> {room.currency} {totalPrice}</strong>
            </p>
          </div>
        )}
        
        <p className="description">{room.description}</p>
      </div>
      
      {selectedDateRange && (
        <div className="booking-action">
          <button
            className="book-room-button"
            onClick={() => handleBooking(room.id || room.roomId, selectedDateRange)}
            disabled={!selectedDateRange.startDate}
          >
            {selectedDateRange.startDate ? `Book for ${room.currency} ${totalPrice}` : 'Select dates to book'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
