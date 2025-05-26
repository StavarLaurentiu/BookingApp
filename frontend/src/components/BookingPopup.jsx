import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BookingPopup.css';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCreditCard, FaPercent, FaSun, FaSnowflake, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { calculateDynamicPrice } from '../utils/pricingUtils';

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
  const [showPriceDetails, setShowPriceDetails] = useState(false);
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

    // If dynamic pricing has already been calculated, use it
    if (room.dynamicPricing) {
      return {
        nights: room.dynamicPricing.nights,
        totalPrice: room.dynamicPricing.totalPrice,
        startDate: new Date(selectedDateRange.startDate).toLocaleDateString(),
        endDate: new Date(selectedDateRange.endDate || selectedDateRange.startDate).toLocaleDateString(),
        breakdown: room.dynamicPricing.breakdown,
        lengthDiscount: room.dynamicPricing.lengthDiscount
      };
    }

    // Otherwise calculate it
    const pricingDetails = calculateDynamicPrice(
      room.pricePerNight,
      selectedDateRange.startDate,
      selectedDateRange.endDate || selectedDateRange.startDate
    );

    return {
      nights: pricingDetails.nights,
      totalPrice: pricingDetails.totalPrice,
      startDate: new Date(selectedDateRange.startDate).toLocaleDateString(),
      endDate: new Date(selectedDateRange.endDate || selectedDateRange.startDate).toLocaleDateString(),
      breakdown: pricingDetails.breakdown,
      lengthDiscount: pricingDetails.lengthDiscount
    };
  };

  const { nights, totalPrice, startDate, endDate, breakdown, lengthDiscount } = calculateBookingDetails();

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
        <button className="close-button" onClick={onClose} disabled={isSubmitting}>
          <FaTimes />
        </button>
        
        <div className="booking-popup-header">
          <h2>Complete Your Booking</h2>
          <h3>{room.name}</h3>
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
            <div className="booking-info-value">{room.type}</div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Duration:</div>
            <div className="booking-info-value">{nights} night{nights !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Base Price:</div>
            <div className="booking-info-value">{room.currency} {room.pricePerNight} / night</div>
          </div>
          
          <div className="booking-info-row">
            <div className="booking-info-label">Total Cost:</div>
            <div className="booking-info-value price">{room.currency} {totalPrice.toFixed(2)}</div>
          </div>
          
          <button 
            className="price-details-toggle" 
            onClick={() => setShowPriceDetails(!showPriceDetails)}
          >
            {showPriceDetails ? 'Hide price details' : 'Show price details'}
          </button>
          
          {showPriceDetails && breakdown && (
            <div className="price-breakdown-details">
              <h4>Price Breakdown</h4>
              <ul>
                {breakdown.map((day, index) => (
                  <li key={index} className="day-price">
                    <span className="day-date">{day.date}:</span>
                    <span className="day-price-value">{room.currency} {day.price.toFixed(2)}</span>
                    <div className="day-factors">
                      {day.adjustments.map((factor, idx) => (
                        <span key={idx} className={`factor ${factor}`}>
                          {factor === 'weekend' && <><FaCalendarAlt /> Weekend</>}
                          {factor === 'summer' && <><FaSun /> Summer</>}
                          {factor === 'winter' && <><FaSnowflake /> Winter</>}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              
              {lengthDiscount && (
                <div className="stay-discount">
                  <FaPercent /> Stay discount ({lengthDiscount.rate}%): 
                  <span className="discount-amount">-{room.currency} {lengthDiscount.amount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
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
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements or requests?"
              rows="3"
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <span>Pay at Hotel</span>
              </label>
            </div>
          </div>
          
          <div className="booking-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" style={{animation: 'spin 1s linear infinite'}} />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Confirm Booking ({room.currency} {totalPrice.toFixed(2)})
                </>
              )}
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
