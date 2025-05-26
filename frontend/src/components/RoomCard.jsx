import React, { useState } from "react";
import RoomImageSlider from "./RoomImageSlider";
import BookingPopup from "./BookingPopup";
import { FaUsers, FaWifi, FaBed, FaThermometerHalf, FaTv, FaShower, FaCoffee, FaHotel, FaPercent, FaCalendarAlt, FaSun, FaSnowflake } from "react-icons/fa";
import "./RoomDetails.css";
import { calculateDynamicPrice } from "../utils/pricingUtils";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  
  // Normalize room data to handle both old and new structures
  const normalizedRoom = {
    id: room.id || room.roomId,
    name: room.name || room.roomName,
    type: room.type || room.roomType,
    hotel: room.hotel,
    pricePerNight: parseFloat(room.pricePerNight),
    currency: room.currency,
    maxOccupancy: room.maxOccupancy,
    description: room.description,
    images: room.images || [],
    // For backend integration
    url: room.url,
    bookings: room.bookings || []
  };
  
  // Calculate dynamic pricing using our utility function
  const calculateBookingDetails = () => {
    if (!selectedDateRange || !selectedDateRange.startDate) {
      return { 
        nights: 0, 
        totalPrice: normalizedRoom.pricePerNight, 
        pricePerNight: normalizedRoom.pricePerNight,
        breakdown: null,
        lengthDiscount: null 
      };
    }

    return calculateDynamicPrice(
      normalizedRoom.pricePerNight,
      selectedDateRange.startDate,
      selectedDateRange.endDate || selectedDateRange.startDate
    );
  };

  const pricingDetails = calculateBookingDetails();
  const { nights, totalPrice, pricePerNight, breakdown, lengthDiscount } = pricingDetails;

  // Room features based on room type
  const getRoomFeatures = () => {
    const baseFeatures = [
      { icon: <FaWifi />, name: "Free WiFi" },
      { icon: <FaTv />, name: "Smart TV" },
      { icon: <FaThermometerHalf />, name: "Climate Control" }
    ];

    const roomType = normalizedRoom.type.toLowerCase();
    
    if (roomType === "double" || roomType === "suite") {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "King Size Bed" },
        { icon: <FaShower />, name: "Rainfall Shower" },
        { icon: <FaCoffee />, name: "Coffee Machine" }
      ];
    } else if (roomType === "luxury" || roomType === "deluxe") {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "Super King Bed" },
        { icon: <FaShower />, name: "Jacuzzi" },
        { icon: <FaCoffee />, name: "Premium Mini Bar" }
      ];
    } else {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "Queen Size Bed" }
      ];
    }
  };

  const handleOpenBookingPopup = (e) => {
    e.stopPropagation();
    setShowBookingPopup(true);
  };
  
  const handleCloseBookingPopup = () => {
    setShowBookingPopup(false);
  };
  
  const handleConfirmBooking = async (bookingData) => {
    const baseURL = "http://127.0.0.1:8000";
    
    try {
      console.log("Booking data:", bookingData);

      const customerPayload = {
        name: bookingData.name,
        email: bookingData.email,
        phone_number: bookingData.phone,
      };

      const customerResponse = await fetch(`${baseURL}/customers/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerPayload),
        });
        
      if (!customerResponse.ok) {
        const errorData = await customerResponse.json();
        console.error("New customer creation failed:", errorData);
        throw new Error(`New customer failed: ${errorData.detail || customerResponse.statusText}`);
      }

      const newCustomerData = await customerResponse.json();
      console.log("Customer response:", newCustomerData);

      if (!newCustomerData || !newCustomerData.url) {
        console.error("Customer URL not found in response:", newCustomerData);
        throw new Error("Failed to retrieve customer URL after creation.");
      }

      const finalBookingData = {
        customer: newCustomerData.url,
        room: normalizedRoom.url,
        check_in_date: (() => {
          const [m, d, y] = bookingData.dateRange.startDate.split('/');
          return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        })(),
        check_out_date: (() => {
          const [m, d, y] = bookingData.dateRange.endDate.split('/');
          return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        })(),
        status: "confirmed",
        number_of_people: 1
      };

      console.log("transformed: ", finalBookingData)
      
      const response = await fetch(`${baseURL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalBookingData),
      });
      
      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const data = await response.json();
      console.log("Booking response:", data);
      
      setShowBookingPopup(false);
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      
      console.log("Booking successful with guest info:", bookingData);
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  return (
    <div className="room-card">
      <RoomImageSlider images={normalizedRoom.images} />
      <div className="room-info">
        <h2>{normalizedRoom.name}</h2>
        <div className="hotel-info">
          <FaHotel /> <span>{normalizedRoom.hotel || "Hotel"}</span>
        </div>
        
        <p>
          <strong>Type:</strong> {normalizedRoom.type}
        </p>
        
        <div className="room-features">
          <span className="feature-tag"><FaUsers /> {normalizedRoom.maxOccupancy} Guests</span>
          {getRoomFeatures().map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature.icon} {feature.name}
            </span>
          ))}
        </div>
        
        <div className="price-container">
          <span className="currency">{normalizedRoom.currency} </span>
          <span className="price">{normalizedRoom.pricePerNight}</span>
          <span className="per-night"> / night</span>
        </div>
        
        {selectedDateRange && selectedDateRange.startDate && (
          <div className="booking-details">
            <p>
              <strong>{nights} night{nights !== 1 ? 's' : ''}</strong>
              {nights > 0 && (
                <>
                  • Average rate: <strong> {normalizedRoom.currency} {pricePerNight.toFixed(2)}</strong> per night
                </>
              )}
            </p>
            <p>Total: <strong>{normalizedRoom.currency} {totalPrice.toFixed(2)}</strong></p>
            
            {breakdown && breakdown.length > 0 && (
              <>
                <button 
                  className="price-breakdown-toggle" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPricingDetails(!showPricingDetails);
                  }}
                >
                  {showPricingDetails ? 'Hide price details' : 'Show price details'}
                </button>
                
                {showPricingDetails && (
                  <div className="price-breakdown">
                    <h4>Price Breakdown</h4>
                    <ul className="breakdown-list">
                      {breakdown.map((day, index) => (
                        <li key={index} className="breakdown-item">
                          <span className="breakdown-date">{day.date}:</span>
                          <span className="breakdown-price">{normalizedRoom.currency} {day.price.toFixed(2)}</span>
                          {day.adjustments.length > 0 && (
                            <div className="adjustment-factors">
                              {day.adjustments.includes('weekend') && (
                                <span className="factor weekend"><FaCalendarAlt /> Weekend rate</span>
                              )}
                              {day.adjustments.includes('summer') && (
                                <span className="factor seasonal"><FaSun /> Summer season</span>
                              )}
                              {day.adjustments.includes('winter') && (
                                <span className="factor seasonal"><FaSnowflake /> Winter holiday</span>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    {lengthDiscount && (
                      <div className="length-discount">
                        <FaPercent /> <strong>{lengthDiscount.rate}% discount</strong> for {nights} night stay
                        <span className="discount-amount">-{normalizedRoom.currency} {lengthDiscount.amount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="total-price">
                      <strong>Total Price: {normalizedRoom.currency} {totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        <p className="description">{normalizedRoom.description}</p>
      </div>
      
      {selectedDateRange && selectedDateRange.startDate && (
        <div className="booking-action">
          <button
            className="book-room-button"
            onClick={handleOpenBookingPopup}
          >
            Book for {normalizedRoom.currency} {totalPrice.toFixed(2)}
          </button>
        </div>
      )}
      
      {showBookingPopup && (
        <BookingPopup
          room={{...normalizedRoom, dynamicPricing: pricingDetails}}
          selectedDateRange={selectedDateRange}
          onClose={handleCloseBookingPopup}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default RoomCard;
