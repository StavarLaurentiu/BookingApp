import React, { useState } from "react";
import RoomImageSlider from "./RoomImageSlider";
import BookingPopup from "./BookingPopup";
import { FaUsers, FaWifi, FaBed, FaThermometerHalf, FaTv, FaShower, FaCoffee, FaHotel, FaPercent, FaCalendarAlt, FaSun, FaSnowflake } from "react-icons/fa";
import "./RoomDetails.css";
import { calculateDynamicPrice } from "../utils/pricingUtils";

const RoomCard = ({ room, selectedDateRange, onBookingSuccess }) => {
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  
  // Calculate dynamic pricing using our utility function
  const calculateBookingDetails = () => {
    if (!selectedDateRange || !selectedDateRange.startDate) {
      return { nights: 0, totalPrice: 0, pricePerNight: room.pricePerNight };
    }

    return calculateDynamicPrice(
      room.pricePerNight,
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

    if (room.type === "double") {
      return [
        ...baseFeatures,
        { icon: <FaBed />, name: "King Size Bed" },
        { icon: <FaShower />, name: "Rainfall Shower" },
        { icon: <FaCoffee />, name: "Coffee Machine" }
      ];
    } else if (room.type === "Luxury" || room.type === "luxury") {
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

  // Handle opening the booking popup
  const handleOpenBookingPopup = (e) => {
    // Prevent any potential event bubbling
    e.stopPropagation();
    setShowBookingPopup(true);
  };
  
  // Handle closing the booking popup
  const handleCloseBookingPopup = () => {
    setShowBookingPopup(false);
  };
  
  // Handle confirming the booking
  const handleConfirmBooking = async (bookingData) => {
    const baseURL = "http://127.0.0.1:8000";
    
    try {
      // Create date range from the booking data
      const startDate = new Date(bookingData.dateRange.startDate);
      const endDate = new Date(bookingData.dateRange.endDate);
      
      // For this example, we'll just simulate a successful booking
      // In a real app, this would be an API call
      console.log("Booking data:", bookingData);

      const customerPayload = { // Renamed to avoid confusion with the response 'data'
        name: bookingData.name,
        email: bookingData.email,
        phone_number: bookingData.phone,
      };

      const customerResponse = await fetch(`${baseURL}/customers/`, { // Renamed response variable
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerPayload),
        });
        
      if (!customerResponse.ok) {
        const errorData = await customerResponse.json(); // Attempt to get error details
        console.error("New customer creation failed:", errorData);
        throw new Error(`New customer failed: ${errorData.detail || customerResponse.statusText}`);
      }

      const newCustomerData = await customerResponse.json(); // Renamed to be more specific
      console.log("Customer response:", newCustomerData);

      // Ensure newCustomerData has the URL. Adjust 'newCustomerData.url' if your backend returns it differently.
      if (!newCustomerData || !newCustomerData.url) {
        console.error("Customer URL not found in response:", newCustomerData);
        throw new Error("Failed to retrieve customer URL after creation.");
      }

      const finalBookingData = {
        customer: newCustomerData.url,
        room: bookingData.room.url,
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
      
      // Create the booking
      if (startDate <= endDate) {
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
      }
      
      // Close popup and notify success
      setShowBookingPopup(false);
      
      // Call the parent component's success handler
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      
      console.log("Booking successful for all selected dates with guest info:", bookingData);
    } catch (error) {
      console.error("Error during booking:", error);
      // Here you could show an error message to the user
    }
  };

  return (
    <div className="room-card">
      <RoomImageSlider images={room.images} />
      <div className="room-info">
        <h2>{room.name}</h2>
        <div className="hotel-info">
          <FaHotel /> <span>{room.hotel || "Grand Plaza Hotel"}</span>
        </div>
        
        <p>
          <strong>Type:</strong> {room.type}
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
          <span className="per-night"> / night (base price)</span>
        </div>
        
        {selectedDateRange && selectedDateRange.startDate && (
          <div className="booking-details">
            <p>
              <strong>{nights} night{nights !== 1 ? 's' : ''}</strong> • Average rate: 
              <strong> {room.currency} {pricePerNight}</strong> per night
            </p>
            <p>Total: <strong>{room.currency} {totalPrice}</strong></p>
            
            {/* Toggle button to show/hide price breakdown */}
            <button 
              className="price-breakdown-toggle" 
              onClick={(e) => {
                e.preventDefault();
                setShowPricingDetails(!showPricingDetails);
              }}
            >
              {showPricingDetails ? 'Hide price details' : 'Show price details'}
            </button>
            
            {/* Price breakdown details */}
            {showPricingDetails && (
              <div className="price-breakdown">
                <h4>Price Breakdown</h4>
                <ul className="breakdown-list">
                  {breakdown.map((day, index) => (
                    <li key={index} className="breakdown-item">
                      <span className="breakdown-date">{day.date}:</span>
                      <span className="breakdown-price">{room.currency} {day.price.toFixed(2)}</span>
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
                    <span className="discount-amount">-{room.currency} {lengthDiscount.amount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="total-price">
                  <strong>Total Price: {room.currency} {totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>
        )}
        
        <p className="description">{room.description}</p>
      </div>
      
      {selectedDateRange && (
        <div className="booking-action">
          <button
            className="book-button"
            onClick={handleOpenBookingPopup}
            disabled={!selectedDateRange.startDate}
          >
            <span className="text">Book Now</span>
            <span className="price">{room.currency} {totalPrice}</span>
          </button>
        </div>
      )}
      
      {/* BookingPopup using React Portal to avoid DOM hierarchy issues */}
      {showBookingPopup && (
        <BookingPopup
          room={{...room, dynamicPricing: pricingDetails}}
          selectedDateRange={selectedDateRange}
          onClose={handleCloseBookingPopup}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default RoomCard;