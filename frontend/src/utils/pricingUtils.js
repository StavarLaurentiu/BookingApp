export const calculateDynamicPrice = (basePrice, checkInDate, checkOutDate) => {
	const startDate = new Date(checkInDate);
	const endDate = new Date(checkOutDate || checkInDate);
	
	// Calculate number of nights
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	const nights = Math.round(Math.abs((endDate - startDate) / oneDay)) || 1;
	
	let totalPrice = 0;
	let currentDate = new Date(startDate);
	let priceBreakdown = [];
	
	// Calculate price for each night with different rates
	for (let i = 0; i < nights; i++) {
	  let dailyPrice = parseFloat(basePrice);
	  let adjustmentFactors = [];
	  
	  // Weekend premium (Friday and Saturday nights)
	  const dayOfWeek = currentDate.getDay();
	  if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
		dailyPrice *= 1.25; // 25% premium for weekends
		adjustmentFactors.push('weekend');
	  }
	  
	  // Seasonal adjustments (higher in summer and winter holiday months)
	  const month = currentDate.getMonth();
	  if (month >= 5 && month <= 8) { // June to September
		dailyPrice *= 1.2; // 20% premium for summer
		adjustmentFactors.push('summer');
	  } else if (month === 11 || month === 0) { // December and January
		dailyPrice *= 1.15; // 15% premium for winter holidays
		adjustmentFactors.push('winter');
	  }
	  
	  // Add to price breakdown for each day
	  const formattedDate = currentDate.toLocaleDateString();
	  priceBreakdown.push({
		date: formattedDate,
		price: dailyPrice,
		adjustments: adjustmentFactors
	  });
	  
	  totalPrice += dailyPrice;
	  
	  // Move to next day
	  currentDate.setDate(currentDate.getDate() + 1);
	}
	
	// Length of stay discount
	let lengthDiscountApplied = false;
	let lengthDiscountRate = 0;
	
	if (nights >= 7) {
	  lengthDiscountRate = 0.1; // 10% discount
	  lengthDiscountApplied = true;
	} else if (nights >= 3) {
	  lengthDiscountRate = 0.05; // 5% discount
	  lengthDiscountApplied = true;
	}
	
	if (lengthDiscountApplied) {
	  const discountAmount = totalPrice * lengthDiscountRate;
	  totalPrice -= discountAmount;
	}
	
	return {
	  basePrice: parseFloat(basePrice),
	  totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
	  pricePerNight: Math.round((totalPrice / nights) * 100) / 100,
	  nights,
	  breakdown: priceBreakdown,
	  lengthDiscount: lengthDiscountApplied ? {
		rate: lengthDiscountRate * 100,
		amount: Math.round((totalPrice * lengthDiscountRate / (1 - lengthDiscountRate)) * 100) / 100
	  } : null
	};
  };