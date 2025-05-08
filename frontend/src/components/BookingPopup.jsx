import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BookingPopup.css';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

const BookingPopup = ({ room, selectedDateRange, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'creditCard'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalRoot] = useState(() => {
    // Create a div for the portal if it doesn't exist
    let element = document.getElementById("booking-popup-root");
    if (!element) {
      element = document.createElement("div");
      element.id = "booking-popup-root";
      document.body.appendChild(element);
    }
    return element;
  });

  // Add scroll lock when component mounts
  useEffect(() => {
    // Save the current body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Handle clicks outside the modal
  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not the modal content
    if (e.target.classList.contains('booking-popup-overlay')) {
      onClose();
    }
  };

  // Calculate booking details
  const calculateBookingDetails = () => {
    if (!selectedDateRange || !selectedDateRange.startDate) {
      return { nights: 0, totalPrice: 0, startDate: null, endDate: null };
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

    return { 
      nights, 
      totalPrice, 
      startDate: startDate.toLocaleDateString(), 
      endDate: endDate.toLocaleDateString() 
    };
  };

  const { nights, totalPrice, startDate, endDate } = calculateBookingDetails();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        onConfirm({
          ...formData,
          room,
          dateRange: { startDate, endDate },
          totalPrice
        });
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Create the popup content
  const popupContent = (
    <div className="booking-popup-overlay" onClick={handleOverlayClick}>
      <div className="booking-popup">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="booking-popup-header">
          <h2>Complete Your Booking</h2>
          <h3>{room.roomName}</h3>
          <div className="hotel-name">{room.hotel}</div>
        </div>
        
        <div className="booking-details">
          <div className="booking-info-row">
            <div className="booking-info-label">
              <FaCalendarAlt />
              <span>Stay Period:</span>
            </div>
            <div className="booking-info-value">
              {startDate === endDate 
                ? startDate 
                : `${startDate} to ${endDate}`}
            </div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Room Type:</div>
            <div className="booking-info-value">{room.roomType}</div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Duration:</div>
            <div className="booking-info-value">{nights} night{nights !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Total Cost:</div>
            <div className="booking-info-value price">{room.currency} {totalPrice}</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <h3>Guest Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements?"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>
              <FaCreditCard /> Payment Method
            </label>
            <div className="payment-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === 'creditCard'}
                  onChange={handleChange}
                />
                <span>Credit Card</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                />
                <span>PayPal</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payAtHotel"
                  checked={formData.paymentMethod === 'payAtHotel'}
                  onChange={handleChange}
                />
                <span>Pay at Hotel</span>
              </label>
            </div>
          </div>
          
          <div className="booking-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use createPortal to render the popup outside the normal React flow
  return createPortal(popupContent, modalRoot);
};

export default BookingPopup;
