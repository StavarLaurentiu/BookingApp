import React, { useState, useEffect, useRef } from "react";
import "./RoomImageSlider.css";

const RoomImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  
  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;
    
    const autoSlideInterval = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(autoSlideInterval);
  }, [currentIndex, isTransitioning, isPaused]);

  const handlePrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    // Reset transitioning flag after animation completes
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    // Reset transitioning flag after animation completes
    setTimeout(() => setIsTransitioning(false), 200);
  };

  // Handle swipe gestures
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    // Pause auto-sliding while user is interacting
    setIsPaused(true);
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum distance required for a swipe
    
    if (diffX > threshold) {
      // Swipe left, go next
      handleNext();
    } else if (diffX < -threshold) {
      // Swipe right, go prev
      handlePrev();
    }
    
    // Reset touch coordinates
    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume auto-sliding after a brief delay
    setTimeout(() => setIsPaused(false), 4000);
  };

  // Pause auto-sliding when hovering over the slider
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="image-slider"
      ref={sliderRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="slider-button prev-button" 
        onClick={() => {
          handlePrev();
          setIsPaused(true);
          // Resume auto-sliding after a delay
          setTimeout(() => setIsPaused(false), 4000);
        }} 
        aria-label="Previous image"
      >
        &#10094;
      </button>
      
      <div className="slider-container">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Room view ${index + 1}`}
            className={`slider-image ${index === currentIndex ? "active" : ""}`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              zIndex: index === currentIndex ? 1 : 0
            }}
          />
        ))}
      </div>
      
      <button 
        className="slider-button next-button" 
        onClick={() => {
          handleNext();
          setIsPaused(true);
          // Resume auto-sliding after a delay
          setTimeout(() => setIsPaused(false), 4000);
        }} 
        aria-label="Next image"
      >
        &#10095;
      </button>
      
      <div className="slider-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 200);
                setIsPaused(true);
                // Resume auto-sliding after a delay
                setTimeout(() => setIsPaused(false), 4000);
              }
            }}
          />
        ))}
      </div>
      
      {/* Progress bar to indicate auto-slide timing */}
      {!isPaused && (
        <div className="slider-progress-container">
          <div className="slider-progress"></div>
        </div>
      )}
    </div>
  );
};

export default RoomImageSlider;
