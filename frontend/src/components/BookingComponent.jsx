import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaHotel } from "react-icons/fa";

import RoomCard from "./RoomCard";
import "./BookingComponent.css";

import deluxe1 from '../assets/images/deluxe1.jpg';
import deluxe2 from "../assets/images/deluxe2.jpg";
import family_suite1 from "../assets/images/family_suite1.jpg";
import family_suite2 from "../assets/images/family_suite2.webp";
import family_suite3 from "../assets/images/family_suite3.jpg";
import standard1 from "../assets/images/standard1.jpg";
import standard2 from "../assets/images/standard2.webp";

const BookingComponent = () => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roomData, setRoomData] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");

  // Dummy data for roomData
  // This data should be replaced with the actual data fetched from the backend
  // or from a local JSON file.
  let roomDataDummy = [
  {
    roomId: "101",
    roomName: "Deluxe Suite",
    roomType: "Suite",
    hotel: "Grand Plaza Hotel",
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
    hotel: "Grand Plaza Hotel",
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
    hotel: "Riverside Resort",
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
  {
    roomId: "301",
    roomName: "Luxury Penthouse",
    roomType: "Luxury",
    hotel: "Skyview Towers",
    isOccupied: false,
    occupiedDates: [],
    pricePerNight: 350,
    currency: "USD",
    maxOccupancy: 2,
    images: [deluxe1, deluxe2], // Reusing images for demo purposes
    description:
      "An exclusive penthouse with panoramic views, jacuzzi, and premium amenities for the discerning traveler.",
  },
];

  // TODO: Fetch room data from the backend
  useEffect(() => {
    // async function fetchRoomData() {
    //   try {
    //     const response = await fetch(
    //       "http://127.0.0.1:8000/rooms/",
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
    setRoomData(roomDataDummy);
    
    // Extract unique hotels for the dropdown
    const uniqueHotels = [...new Set(roomDataDummy.map(room => room.hotel))];
    setHotels(uniqueHotels);
  }, []);

  const handleDateClick = (day, monthOffset = 0) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    if (!selectedDates.startDate || selectedDates.endDate) {
      // If no dates are selected or both are already set, reset to a single date
      setSelectedDates({ startDate: selectedDate, endDate: null });
    } else if (selectedDate.getTime() === selectedDates.startDate.getTime()) {
      // If clicking the same date again, treat as a single-day selection
      setSelectedDates({ startDate: selectedDate, endDate: selectedDate });
    } else {
      // Set the endDate if selecting a valid range
      if (selectedDate > selectedDates.startDate) {
        setSelectedDates({ ...selectedDates, endDate: selectedDate });
      } else {
        setSelectedDates({
          startDate: selectedDate,
          endDate: selectedDates.startDate,
        });
      }
    }

    setError(""); // Clear any error message on date selection
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + increment)
    );
    setCurrentDate(new Date(newDate));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Add previous month days
    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    // Add current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    // Add next month days
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, monthOffset: 1 });
    }

    return days;
  };

  const isDateSelected = (day, monthOffset) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    return (
      // Check if startDate != null && is the tile, the startDate?
      (selectedDates.startDate &&
        selectedDates.startDate.getTime() === date.getTime()) ||
      // Check if endDate != null && is the tile, the endDate?
      (selectedDates.endDate &&
        selectedDates.endDate.getTime() === date.getTime()) ||
      // Check if startDate && endDate != null && is the tile between the two?
      (selectedDates.startDate &&
        selectedDates.endDate &&
        date >= selectedDates.startDate &&
        date <= selectedDates.endDate)
    );
  };

  const days = generateCalendarDays();

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
  };

  const handleFilterRooms = () => {
    if (!selectedDates.startDate) {
      setError("Please select a valid date.");
      setIsFiltered(false);
      return;
    }

    // If endDate is null, fall back to startDate for single-day booking
    const startDate = selectedDates.startDate;
    const endDate = selectedDates.endDate || selectedDates.startDate;

    const isDateInRange = (occupiedDate) => {
      const occupied = new Date(occupiedDate);
      occupied.setHours(0, 0, 0, 0);

      let fallsIntoRange = true;

      if (endDate.getTime() != startDate.getTime()) {
        fallsIntoRange = occupied >= startDate && occupied <= endDate;
      } else {
        fallsIntoRange = occupied.getTime() === startDate.getTime();
      }

      return fallsIntoRange;
    };

    // Filter by date availability
    let availableRooms = roomData.filter((room) =>
      room.occupiedDates.every((occ) => !isDateInRange(occ.date))
    );

    // Filter by selected hotel if not 'all'
    if (selectedHotel !== "all") {
      availableRooms = availableRooms.filter(room => room.hotel === selectedHotel);
    }

    setFilteredRooms(availableRooms);
    setIsFiltered(true);
    setError("");
  };

  return (
    <div className="booking-container">
      <div className="hotel-selector">
        <label htmlFor="hotel-select">
          <FaHotel /> Select Hotel:
        </label>
        <select 
          id="hotel-select" 
          value={selectedHotel} 
          onChange={handleHotelChange}
          className="hotel-dropdown"
        >
          <option value="all">All Hotels</option>
          {hotels.map((hotel, index) => (
            <option key={index} value={hotel}>{hotel}</option>
          ))}
        </select>
      </div>

      <div className="calendar-header">
        <button className="date-switcher" onClick={() => handleMonthChange(-1)}>
          <FaArrowLeft></FaArrowLeft>{" "}
        </button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="date-switcher" onClick={() => handleMonthChange(1)}>
          <FaArrowRight></FaArrowRight>
        </button>
      </div>

      <div className="calendar-day-labels">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={index} className="day-label">
                {day}
              </div>
            ))}
      </div>

      <div className="calendar-days">
        {days.map(({ day, monthOffset }, index) => (
          <div
            key={index}
            className={`calendar-day ${
              isDateSelected(day, monthOffset) ? "selected" : ""
            } ${monthOffset !== 0 ? "overflow" : ""}`}
            onClick={() => handleDateClick(day, monthOffset)}
          >
            {day}
          </div>
        ))}
      </div>

      <button className="search-available-rooms-button" onClick={handleFilterRooms}>
        Search Available Rooms
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="filtered-rooms">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              onBookingSuccess={() => {
                setSelectedDates({
                  startDate: null,
                  endDate: null,
                });
                setFilteredRooms([]);
                setSuccess("Booking Succesful!");
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                }, 5000);
              }}
              key={room.id || room.roomId}
              room={room}
              selectedDateRange={selectedDates}
            />
          ))
        ) : isFiltered && selectedDates.startDate ? (
          <p className="no-rooms-message">No available rooms for the selected dates{selectedHotel !== "all" ? ` at ${selectedHotel}` : ''}.</p>
        ) : success != "" ? (
          <p className="success-message">{success}</p>
        ) : error != "" ? (
          null
        ) : (
          <p className="select-dates-message">Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;
