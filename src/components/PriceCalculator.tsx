import { useState } from 'react';
import emailjs from '@emailjs/browser';
import EnhancedPaymentForm from './EnhancedPaymentForm';

interface PricingData {
  homeSize: string;
  bedrooms: string;
  bathrooms: string;
  cleaningType: string;
  frequency: string;
  extras: string[];
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface BookingDetails {
  date: string;
  time: string;
}

export default function PriceCalculator() {
  const [step, setStep] = useState(1);
  const [pricingData, setPricingData] = useState<PricingData>({
    homeSize: '',
    bedrooms: '',
    bathrooms: '',
    cleaningType: '',
    frequency: '',
    extras: []
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    time: ''
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState<{[key: string]: number}>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const homeSizeOptions = [
    { value: 'studio', label: '🏠 Studio (up to 600 sq ft)', price: 80 },
    { value: 'one-bedroom', label: '🏡 1 Bedroom (600-900 sq ft)', price: 100 },
    { value: 'two-bedroom', label: '🏘️ 2 Bedroom (900-1200 sq ft)', price: 120 },
    { value: 'three-bedroom', label: '🏠 3 Bedroom (1200-1600 sq ft)', price: 150 },
    { value: 'four-bedroom', label: '🏰 4 Bedroom (1600-2200 sq ft)', price: 180 },
    { value: 'five-bedroom', label: '🏛️ 5+ Bedroom (2200+ sq ft)', price: 220 }
  ];

  const bedroomOptions = [
    { value: '0', label: '0 Bedrooms', price: 0 },
    { value: '1', label: '1 Bedroom', price: 15 },
    { value: '2', label: '2 Bedrooms', price: 25 },
    { value: '3', label: '3 Bedrooms', price: 35 },
    { value: '4', label: '4 Bedrooms', price: 45 },
    { value: '5+', label: '5+ Bedrooms', price: 60 }
  ];

  const bathroomOptions = [
    { value: '1', label: '1 Bathroom', price: 0 },
    { value: '1.5', label: '1.5 Bathrooms', price: 10 },
    { value: '2', label: '2 Bathrooms', price: 20 },
    { value: '2.5', label: '2.5 Bathrooms', price: 30 },
    { value: '3', label: '3 Bathrooms', price: 40 },
    { value: '3.5', label: '3.5 Bathrooms', price: 50 },
    { value: '4+', label: '4+ Bathrooms', price: 60 }
  ];

  const cleaningTypeOptions = [
    { value: 'standard', label: '🧹 Standard Cleaning', multiplier: 1.0 },
    { value: 'deep', label: '🧽 Deep Cleaning', multiplier: 1.5 },
    { value: 'move-in', label: '📦 Move-in Cleaning', multiplier: 1.4 },
    { value: 'move-out', label: '🚚 Move-out Cleaning', multiplier: 1.4 },
    { value: 'post-construction', label: '🏗️ Post-Construction', multiplier: 2.0 }
  ];

  const frequencyOptions = [
    { value: 'one-time', label: '⭐ One-time', discount: 0, displayDiscount: 'No discount' },
    { value: 'weekly', label: '📅 Weekly', discount: 0.20, displayDiscount: '20% OFF' },
    { value: 'bi-weekly', label: '📆 Bi-weekly', discount: 0.15, displayDiscount: '15% OFF' },
    { value: 'monthly', label: '🗓️ Monthly', discount: 0.10, displayDiscount: '10% OFF' }
  ];

  const extrasOptions = [
    { value: 'inside-fridge', label: '❄️ Inside Fridge', price: 25 },
    { value: 'inside-oven', label: '🔥 Inside Oven', price: 25 },
    { value: 'inside-microwave', label: '📱 Inside Microwave', price: 15 },
    { value: 'inside-cabinets', label: '🗄️ Inside Cabinets', price: 40 },
    { value: 'windows-interior', label: '🪟 Interior Windows', price: 30 },
    { value: 'baseboards', label: '🧽 Baseboards', price: 20 },
    { value: 'garage', label: '🚗 Garage', price: 50 },
    { value: 'laundry', label: '👕 Laundry', price: 30 }
  ];

  const calculatePrice = () => {
    const basePrice = homeSizeOptions.find(option => option.value === pricingData.homeSize)?.price || 0;
    const bedroomPrice = bedroomOptions.find(option => option.value === pricingData.bedrooms)?.price || 0;
    const bathroomPrice = bathroomOptions.find(option => option.value === pricingData.bathrooms)?.price || 0;
    const cleaningMultiplier = cleaningTypeOptions.find(option => option.value === pricingData.cleaningType)?.multiplier || 1.0;
    const frequencyDiscount = frequencyOptions.find(option => option.value === pricingData.frequency)?.discount || 0;

    const extrasPrice = pricingData.extras.reduce((total, extra) => {
      const extraOption = extrasOptions.find(option => option.value === extra);
      return total + (extraOption?.price || 0);
    }, 0);

    const subtotal = (basePrice + bedroomPrice + bathroomPrice) * cleaningMultiplier + extrasPrice;

    // First cleaning price (no discount applied)
    const firstCleaningPrice = subtotal;

    // Recurring cleaning price (with frequency discount)
    const discount = (subtotal - extrasPrice) * frequencyDiscount; // Don't discount extras
    const recurringPrice = subtotal - discount;

    const breakdown = {
      'Base Price': basePrice,
      'Bedrooms': bedroomPrice,
      'Bathrooms': bathroomPrice,
      'Cleaning Type Multiplier': (subtotal - extrasPrice) - (basePrice + bedroomPrice + bathroomPrice),
      'Extras': extrasPrice,
      ...(frequencyDiscount > 0 && {
        'First Cleaning Total': firstCleaningPrice,
        'Recurring Discount': -discount,
        'Recurring Cleaning Price': recurringPrice
      })
    };

    setPriceBreakdown(breakdown);
    // Show first cleaning price as the main price
    setCalculatedPrice(firstCleaningPrice);
    setIsCalculated(true);
  };

  // Real-time price calculation
  const calculateLivePrice = () => {
    if (!pricingData.homeSize || !pricingData.bedrooms || !pricingData.bathrooms || !pricingData.cleaningType || !pricingData.frequency) {
      return { firstPrice: 0, recurringPrice: 0, discount: 0, extrasTotal: 0 };
    }

    const basePrice = homeSizeOptions.find(option => option.value === pricingData.homeSize)?.price || 0;
    const bedroomPrice = bedroomOptions.find(option => option.value === pricingData.bedrooms)?.price || 0;
    const bathroomPrice = bathroomOptions.find(option => option.value === pricingData.bathrooms)?.price || 0;
    const cleaningMultiplier = cleaningTypeOptions.find(option => option.value === pricingData.cleaningType)?.multiplier || 1.0;
    const frequencyDiscount = frequencyOptions.find(option => option.value === pricingData.frequency)?.discount || 0;

    const extrasTotal = pricingData.extras.reduce((total, extra) => {
      const extraOption = extrasOptions.find(option => option.value === extra);
      return total + (extraOption?.price || 0);
    }, 0);

    const subtotal = (basePrice + bedroomPrice + bathroomPrice) * cleaningMultiplier + extrasTotal;
    const discount = (subtotal - extrasTotal) * frequencyDiscount;
    const recurringPrice = subtotal - discount;

    return {
      firstPrice: subtotal,
      recurringPrice: pricingData.frequency === 'one-time' ? 0 : recurringPrice,
      discount: discount,
      extrasTotal: extrasTotal,
      baseSubtotal: (basePrice + bedroomPrice + bathroomPrice) * cleaningMultiplier
    };
  };

  const livePrice = calculateLivePrice();

  const handleExtrasChange = (extraValue: string) => {
    setPricingData(prev => ({
      ...prev,
      extras: prev.extras.includes(extraValue)
        ? prev.extras.filter(extra => extra !== extraValue)
        : [...prev.extras, extraValue]
    }));
    // Auto-calculate price when extras change
    setIsCalculated(false);
  };

  const handleNextStep = () => {
    if (step === 1 && !isCalculated) {
      calculatePrice();
      return; // Don't proceed to next step yet, just show the price
    }
    setStep(step + 1);
  };

  const handlePaymentSuccess = async () => {
    const newBookingNumber = `BK${Date.now()}`;
    setBookingNumber(newBookingNumber);
    setPaymentSuccess(true);

    // Send email notification
    setEmailStatus('sending');
    const emailSent = await sendEmailNotification(newBookingNumber);
    setEmailStatus(emailSent ? 'sent' : 'failed');

    setStep(5);
  };

  const sendEmailNotification = async (bookingNum: string): Promise<boolean> => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      console.error('EmailJS configuration missing. Please set up environment variables:', {
        serviceId: !!serviceId,
        templateId: !!templateId,
        userId: !!userId
      });
      return false;
    }

    try {
      // Format date nicely
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      // Calculate recurring savings for email
      const recurringPrice = livePrice.recurringPrice;
      const savings = pricingData.frequency !== 'one-time' ? calculatedPrice - recurringPrice : 0;

      const emailData = {
        booking_number: bookingNum,
        customer_name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        customer_email: contactInfo.email,
        customer_phone: contactInfo.phone,
        service_date: formatDate(bookingDetails.date),
        service_time: bookingDetails.time,
        service_address: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state} ${contactInfo.zipCode}`,
        cleaning_type: cleaningTypeOptions.find(option => option.value === pricingData.cleaningType)?.label || pricingData.cleaningType,
        frequency: frequencyOptions.find(option => option.value === pricingData.frequency)?.label || pricingData.frequency,
        total_price: calculatedPrice.toFixed(2),
        special_instructions: pricingData.extras.length > 0
          ? pricingData.extras.map(extra =>
              extrasOptions.find(option => option.value === extra)?.label || extra
            ).join(', ')
          : 'None',
        recurring_price: recurringPrice > 0 ? recurringPrice.toFixed(2) : 'N/A',
        savings_per_cleaning: savings > 0 ? savings.toFixed(2) : '0.00',
        home_details: `${homeSizeOptions.find(opt => opt.value === pricingData.homeSize)?.label}, ${pricingData.bedrooms} bedroom(s), ${pricingData.bathrooms} bathroom(s)`,
        booking_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      console.log('Sending email with data:', emailData);

      const response = await emailjs.send(serviceId, templateId, emailData, userId);

      console.log('✅ Email sent successfully:', response);
      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour += 3) {
      const endHour = Math.min(hour + 3, 20);
      const startTime = hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const endTime = endHour === 12 ? '12:00 PM' : endHour > 12 ? `${endHour - 12}:00 PM` : `${endHour}:00 AM`;
      slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
  };

  const renderStep1 = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">✨ Get Your Cleaning Quote</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">🏠 Home Size</label>
          <select
            value={pricingData.homeSize}
            onChange={(e) => setPricingData({...pricingData, homeSize: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select your home size</option>
            {homeSizeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">🛏️ Bedrooms</label>
          <select
            value={pricingData.bedrooms}
            onChange={(e) => setPricingData({...pricingData, bedrooms: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select number of bedrooms</option>
            {bedroomOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">🚿 Bathrooms</label>
          <select
            value={pricingData.bathrooms}
            onChange={(e) => setPricingData({...pricingData, bathrooms: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select number of bathrooms</option>
            {bathroomOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">🧹 Cleaning Type</label>
          <select
            value={pricingData.cleaningType}
            onChange={(e) => setPricingData({...pricingData, cleaningType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select cleaning type</option>
            {cleaningTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">📅 Frequency & Savings</label>

          {/* Frequency Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {frequencyOptions.map(option => (
              <div
                key={option.value}
                onClick={() => setPricingData({...pricingData, frequency: option.value})}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  pricingData.frequency === option.value
                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={pricingData.frequency === option.value}
                      onChange={() => {}} // Handled by div onClick
                      className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      {option.discount > 0 && (
                        <div className="text-sm text-gray-600">Save {(option.discount * 100).toFixed(0)}% after first cleaning</div>
                      )}
                    </div>
                  </div>
                  {option.discount > 0 && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {option.displayDiscount}
                    </div>
                  )}
                </div>
                {option.discount > 0 && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    💰 Recurring customers save big!
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Big Savings Banner */}
          {pricingData.frequency && pricingData.frequency !== 'one-time' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">🎉 Great Choice!</div>
                  <div className="text-sm opacity-90">
                    You'll save {frequencyOptions.find(opt => opt.value === pricingData.frequency)?.displayDiscount} on all cleanings after your first appointment
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {frequencyOptions.find(opt => opt.value === pricingData.frequency)?.displayDiscount}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Price Calculator */}
        {pricingData.homeSize && pricingData.bedrooms && pricingData.bathrooms && pricingData.cleaningType && pricingData.frequency && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg transform transition-all duration-500 ease-in-out animate-in slide-in-from-top">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-bounce">💰</span>
              <span>Live Price Calculator</span>
              <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">LIVE</span>
            </h3>

            {/* Base Price Breakdown */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">📋 Base Service</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🏠 {homeSizeOptions.find(opt => opt.value === pricingData.homeSize)?.label}</span>
                  <span className="font-medium">${homeSizeOptions.find(opt => opt.value === pricingData.homeSize)?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>🛏️ {pricingData.bedrooms} bedroom(s)</span>
                  <span className="font-medium">${bedroomOptions.find(opt => opt.value === pricingData.bedrooms)?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>🚿 {pricingData.bathrooms} bathroom(s)</span>
                  <span className="font-medium">${bathroomOptions.find(opt => opt.value === pricingData.bathrooms)?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>🧹 {cleaningTypeOptions.find(opt => opt.value === pricingData.cleaningType)?.label}</span>
                  <span className="font-medium">
                    {cleaningTypeOptions.find(opt => opt.value === pricingData.cleaningType)?.multiplier !== 1.0 &&
                      `×${cleaningTypeOptions.find(opt => opt.value === pricingData.cleaningType)?.multiplier}`
                    }
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Subtotal (before add-ons):</span>
                  <span className="text-blue-600 transition-all duration-300 ease-in-out animate-pulse">${(livePrice.baseSubtotal || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            {livePrice.extrasTotal > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200 transform transition-all duration-500 ease-in-out">
                <h4 className="font-semibold text-yellow-800 mb-3">✨ Selected Add-ons</h4>
                <div className="space-y-2 text-sm">
                  {pricingData.extras.map(extra => {
                    const extraOption = extrasOptions.find(opt => opt.value === extra);
                    return (
                      <div key={extra} className="flex justify-between animate-in slide-in-from-left">
                        <span>{extraOption?.label}</span>
                        <span className="font-medium text-yellow-700">+${extraOption?.price}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-yellow-300 pt-2 flex justify-between font-semibold">
                    <span>Add-ons Total:</span>
                    <span className="text-yellow-700 animate-pulse">+${livePrice.extrasTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Frequency & Pricing */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">
                📅 {frequencyOptions.find(opt => opt.value === pricingData.frequency)?.label} Pricing
              </h4>

              <div className="space-y-3">
                {/* First Cleaning */}
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium text-lg">First Cleaning:</span>
                    <div className="text-xs text-gray-500">Full price, no discount</div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 transition-all duration-500 ease-in-out transform hover:scale-105 animate-pulse">${livePrice.firstPrice.toFixed(2)}</span>
                </div>

                {/* Recurring Cleanings */}
                {pricingData.frequency !== 'one-time' && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 transform transition-all duration-500 ease-in-out">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-lg text-green-800">
                          {pricingData.frequency === 'weekly' ? 'Weekly' :
                           pricingData.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'} Cleanings:
                        </span>
                        <div className="text-xs text-green-600">
                          After first cleaning - {frequencyOptions.find(opt => opt.value === pricingData.frequency)?.displayDiscount} discount
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through transition-all duration-300">${livePrice.firstPrice.toFixed(2)}</div>
                        <div className="text-2xl font-bold text-green-600 transition-all duration-500 ease-in-out transform hover:scale-105 animate-pulse">${livePrice.recurringPrice.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">💰 You save per cleaning:</span>
                        <span className="font-bold text-green-700 transition-all duration-300 ease-in-out animate-bounce">${(livePrice.firstPrice - livePrice.recurringPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">📅 Annual savings:</span>
                        <span className="font-bold text-green-700">
                          ${((livePrice.firstPrice - livePrice.recurringPrice) *
                            (pricingData.frequency === 'weekly' ? 52 :
                             pricingData.frequency === 'bi-weekly' ? 26 : 12)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600 mb-2">
                💡 Add more services below to see instant price updates!
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">✨ Additional Services</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {extrasOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                  pricingData.extras.includes(option.value)
                    ? 'border-yellow-500 bg-yellow-50 shadow-md scale-[1.01] animate-in zoom-in-95'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pricingData.extras.includes(option.value)}
                    onChange={() => handleExtrasChange(option.value)}
                    className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-bold px-2 py-1 rounded transition-all duration-300 ease-in-out ${
                    pricingData.extras.includes(option.value)
                      ? 'bg-yellow-500 text-white scale-110 animate-pulse'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    +${option.price}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Add-ons Summary */}
          {pricingData.extras.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg transition-all duration-500 ease-in-out transform animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center">
                <span className="text-yellow-800 font-medium">
                  🛍️ Selected Add-ons ({pricingData.extras.length}):
                </span>
                <span className="text-yellow-900 font-bold animate-pulse">
                  +${pricingData.extras.reduce((total, extra) => {
                    const extraOption = extrasOptions.find(opt => opt.value === extra);
                    return total + (extraOption?.price || 0);
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {isCalculated && (
          <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg transform transition-all duration-500 ease-in-out animate-in fade-in">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-bounce">💰</span>
              <span>Price Breakdown</span>
            </h3>

            {/* Basic breakdown */}
            {Object.entries(priceBreakdown).filter(([key]) =>
              !['First Cleaning Total', 'Recurring Discount', 'Recurring Cleaning Price'].includes(key)
            ).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{key}:</span>
                <span className="text-gray-900">${value.toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-xl font-bold mb-2">
                <span>First Cleaning:</span>
                <span className="text-blue-600 animate-pulse">${calculatedPrice.toFixed(2)}</span>
              </div>

              {/* Show recurring savings if applicable */}
              {pricingData.frequency !== 'one-time' && priceBreakdown['Recurring Discount'] && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg transform transition-all duration-500 ease-in-out">
                  <div className="text-lg font-bold text-green-800 mb-2 flex items-center">
                    <span className="mr-2 text-xl animate-bounce">🎉</span>
                    <span>Recurring Cleaning Savings</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Regular Price:</span>
                      <span className="text-green-700">${calculatedPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-green-700">
                        {frequencyOptions.find(opt => opt.value === pricingData.frequency)?.displayDiscount} Discount:
                      </span>
                      <span className="text-green-600 font-semibold animate-pulse">
                        ${Math.abs(priceBreakdown['Recurring Discount'] || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-green-300 pt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-green-800">
                          {pricingData.frequency === 'weekly' ? 'Weekly' :
                           pricingData.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'} Price:
                        </span>
                        <span className="text-green-600 animate-pulse">
                          ${(priceBreakdown['Recurring Cleaning Price'] || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-center text-sm text-green-700 font-medium">
                      💰 You save ${Math.abs(priceBreakdown['Recurring Discount'] || 0).toFixed(2)} every cleaning after the first!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={isCalculated ? () => setStep(2) : calculatePrice}
          disabled={!pricingData.homeSize || !pricingData.bedrooms || !pricingData.bathrooms || !pricingData.cleaningType || !pricingData.frequency}
          className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
            isCalculated
              ? 'bg-green-500 text-white hover:bg-green-600 animate-pulse shadow-lg'
              : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isCalculated ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 text-xl">📞</span>
              <span>Book This Service</span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2 text-xl">💰</span>
              <span>Calculate My Price</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📞 Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">👤 First Name</label>
          <input
            type="text"
            value={contactInfo.firstName}
            onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">👤 Last Name</label>
          <input
            type="text"
            value={contactInfo.lastName}
            onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📧 Email</label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📱 Phone</label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">🏠 Address</label>
        <input
          type="text"
          value={contactInfo.address}
          onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">🏙️ City</label>
          <input
            type="text"
            value={contactInfo.city}
            onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Toronto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">🗺️ State/Province</label>
          <input
            type="text"
            value={contactInfo.state}
            onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="ON"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">📮 Zip/Postal Code</label>
          <input
            type="text"
            value={contactInfo.zipCode}
            onChange={(e) => setContactInfo({...contactInfo, zipCode: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="M5V 3A1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNextStep}
          disabled={!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone || !contactInfo.address || !contactInfo.city || !contactInfo.state || !contactInfo.zipCode}
          className="flex-1 bg-yellow-400 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          📅 Select Date & Time →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">📅 Select Date & Time</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">📅 Service Date</label>
        <input
          type="date"
          value={bookingDetails.date}
          onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">⏰ Preferred Time Slot</label>
        <div className="grid grid-cols-1 gap-3">
          {generateTimeSlots().map((slot) => (
            <label key={slot} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="timeSlot"
                value={slot}
                checked={bookingDetails.time === slot}
                onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                className="mr-3 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
              />
              <span>{slot}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNextStep}
          disabled={!bookingDetails.date || !bookingDetails.time}
          className="flex-1 bg-yellow-400 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          💳 Proceed to Payment →
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">💳 Payment</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Booking Summary</h3>
        <p><strong>🧹 Service:</strong> {cleaningTypeOptions.find(option => option.value === pricingData.cleaningType)?.label}</p>
        <p><strong>📅 Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> {bookingDetails.time}</p>
        <p><strong>📍 Address:</strong> {contactInfo.address}, {contactInfo.city}, {contactInfo.state}</p>
        <p><strong>💰 Total:</strong> ${calculatedPrice.toFixed(2)}</p>
      </div>

      <EnhancedPaymentForm
        amount={calculatedPrice}
        customerDetails={{
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address,
          city: contactInfo.city,
          state: contactInfo.state,
          zipCode: contactInfo.zipCode,
        }}
        serviceDetails={{
          serviceType: `${pricingData.homeSize} ${pricingData.cleaningType}`,
          frequency: pricingData.frequency,
          addOns: pricingData.extras,
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={(error: any) => console.error('Payment error:', error)}
      />

      <div className="mt-6">
        <button
          onClick={() => setStep(3)}
          className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          ← Back to Date Selection
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold mb-6 text-green-600">Booking Confirmed!</h2>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-lg mb-2"><strong>🎫 Booking Number:</strong> {bookingNumber}</p>

        {/* Email Status Display */}
        <div className="mt-4">
          {emailStatus === 'sending' && (
            <div className="flex items-center justify-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span>📧 Sending confirmation email...</span>
            </div>
          )}

          {emailStatus === 'sent' && (
            <div className="text-green-700">
              <p>✅ <strong>Confirmation email sent!</strong></p>
              <p className="text-sm">📧 Check your inbox at {contactInfo.email}</p>
              <p className="text-xs text-gray-600 mt-1">
                Don't see it? Check your spam folder or contact us directly.
              </p>
            </div>
          )}

          {emailStatus === 'failed' && (
            <div className="text-orange-700 bg-orange-50 border border-orange-200 rounded p-3">
              <p>⚠️ <strong>Email delivery issue</strong></p>
              <p className="text-sm">We couldn't send the confirmation email, but your booking is confirmed!</p>
              <p className="text-xs mt-1">
                Please save your booking number: <strong>{bookingNumber}</strong>
              </p>
              <p className="text-xs">
                We'll contact you at {contactInfo.phone} to confirm details.
              </p>
            </div>
          )}

          {emailStatus === 'idle' && (
            <p className="text-gray-700">📧 Confirmation details will be sent to {contactInfo.email}</p>
          )}
        </div>
      </div>

      <div className="text-left space-y-2 mb-6">
        <p><strong>🧹 Service:</strong> {cleaningTypeOptions.find(option => option.value === pricingData.cleaningType)?.label}</p>
        <p><strong>📅 Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> {bookingDetails.time}</p>
        <p><strong>📍 Address:</strong> {contactInfo.address}, {contactInfo.city}, {contactInfo.state}</p>
        <p><strong>💰 Total Paid:</strong> ${calculatedPrice.toFixed(2)}</p>
      </div>

      <button
        onClick={() => {
          setStep(1);
          setPricingData({ homeSize: '', bedrooms: '', bathrooms: '', cleaningType: '', frequency: '', extras: [] });
          setContactInfo({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '' });
          setBookingDetails({ date: '', time: '' });
          setCalculatedPrice(0);
          setIsCalculated(false);
          setPaymentSuccess(false);
          setBookingNumber('');
          setEmailStatus('idle');
        }}
        className="bg-yellow-400 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
      >
        Book Another Service
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber ? 'bg-yellow-400 text-gray-800' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-8 h-1 ${step > stepNumber ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>
    </div>
  );
}
