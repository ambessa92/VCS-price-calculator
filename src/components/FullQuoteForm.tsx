import { useState } from 'react';

interface FormData {
  // Step 1: Who You Are
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sendTextReminders: boolean;

  // Step 2: Your Home
  address: string;
  city: string;
  province: string;
  postalCode: string;

  // Step 3: Choose Your Service
  serviceType: string;
  cleaningType: string;
  homeSize: string;
  bedrooms: string;
  bathrooms: string;
  halfBaths: string;
  basement: string;
  dateTime: string;

  // Step 4: Select Extras
  extras: {
    deepClean: boolean;
    moveInOut: boolean;
    renovation: boolean;
    studentProperty: boolean;
    airbnb: boolean;
    pets: boolean;
    insideFridge: boolean;
    insideOven: boolean;
    insideCabinets: boolean;
    additionalKitchen: boolean;
    blinds: boolean;
    windowsUpTo6: boolean;
    windowsUpTo12: boolean;
    windowsUpTo24: boolean;
    changeBedSheets: boolean;
    loadDishwasher: boolean;
    sanitization: boolean;
  };

  // Additional info
  cleaningInstructions: string;
  accessInfo: string;
  parking: string;
  propertyType: 'house' | 'apartment' | 'commercial' | '';
  timeRestriction: {
    notFlexible: boolean;
    sameDayFine: boolean;
    nextDayFine: boolean;
    sameWeekFine: boolean;
  };

  // Step 5: Frequency and Payment
  frequency: string;
}

const defaultFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  sendTextReminders: false,

  address: '',
  city: '',
  province: '',
  postalCode: '',

  serviceType: 'House Cleaning - package',
  cleaningType: '',
  homeSize: '',
  bedrooms: '',
  bathrooms: '',
  halfBaths: '',
  basement: '',
  dateTime: '',

  extras: {
    deepClean: false,
    moveInOut: false,
    renovation: false,
    studentProperty: false,
    airbnb: false,
    pets: false,
    insideFridge: false,
    insideOven: false,
    insideCabinets: false,
    additionalKitchen: false,
    blinds: false,
    windowsUpTo6: false,
    windowsUpTo12: false,
    windowsUpTo24: false,
    changeBedSheets: false,
    loadDishwasher: false,
    sanitization: false,
  },

  cleaningInstructions: '',
  accessInfo: '',
  parking: '',
  propertyType: '',
  timeRestriction: {
    notFlexible: false,
    sameDayFine: false,
    nextDayFine: false,
    sameWeekFine: false,
  },

  frequency: 'One Time',
};

export function FullQuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [price, setPrice] = useState({
    subtotal: 89.00,
    tax: 11.57,
    finalPrice: 100.57,
  });

  const updatePrice = () => {
    // This would be a more complex calculation in a real implementation
    // For now, we're using a simplified version
    let basePrice = 89.00;

    // Adjust price based on home size
    switch(formData.homeSize) {
      case 'small':
        basePrice = 89.00;
        break;
      case 'medium':
        basePrice = 109.00;
        break;
      case 'large':
        basePrice = 129.00;
        break;
      case 'xlarge':
        basePrice = 149.00;
        break;
      case 'xxlarge':
        basePrice = 179.00;
        break;
    }

    // Add extras
    if (formData.extras.deepClean) basePrice += 60;
    if (formData.extras.moveInOut) basePrice += 80;
    if (formData.extras.insideFridge) basePrice += 25;
    if (formData.extras.insideOven) basePrice += 25;
    if (formData.extras.insideCabinets) basePrice += 30;

    // Calculate tax (13%)
    const tax = Number.parseFloat((basePrice * 0.13).toFixed(2));
    const finalPrice = Number.parseFloat((basePrice + tax).toFixed(2));

    setPrice({
      subtotal: basePrice,
      tax,
      finalPrice,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      if (parent === 'extras') {
        setFormData(prev => ({
          ...prev,
          extras: {
            ...prev.extras,
            [child]: checked,
          },
        }));
      } else if (parent === 'timeRestriction') {
        setFormData(prev => ({
          ...prev,
          timeRestriction: {
            ...prev.timeRestriction,
            [child]: checked,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Update price on form changes
    setTimeout(updatePrice, 100);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Booking submitted! In a real implementation, this would submit the booking to a backend server.');
    console.log('Form data:', formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Progress tracker */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`relative flex flex-col items-center ${currentStep >= step ? 'text-primary' : 'text-gray-400'}`}
              >
                <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                  currentStep >= step ? 'border-primary bg-primary text-white' : 'border-gray-400'
                }`}>
                  {step}
                </div>
                <div className="text-xs mt-2">
                  {step === 1 && "WHO YOU ARE"}
                  {step === 2 && "YOUR HOME"}
                  {step === 3 && "CHOOSE SERVICE"}
                  {step === 4 && "SELECT EXTRAS"}
                  {step === 5 && "FREQUENCY & PAYMENT"}
                </div>
              </div>
            ))}
          </div>
          <div className="relative flex h-0.5 mt-4">
            <div className="absolute h-0.5 bg-primary" style={{ width: `${(currentStep - 1) * 25}%` }}></div>
            <div className="absolute h-0.5 bg-gray-300 w-full"></div>
          </div>
        </div>

        {/* Step 1: Who You Are */}
        {currentStep === 1 && (
          <div className="step-1">
            <h2 className="text-xl font-bold mb-6">STEP 1: WHO YOU ARE</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name***</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name***</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email***</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cell Phone***</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sendTextReminders"
                  checked={formData.sendTextReminders}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Send me reminders about my booking via text message</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-text px-6 py-2 rounded font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Your Home */}
        {currentStep === 2 && (
          <div className="step-2">
            <h2 className="text-xl font-bold mb-6">STEP 2: YOUR HOME</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address***</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City***</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province***</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Province</option>
                  <option value="ON">Ontario</option>
                  <option value="BC">British Columbia</option>
                  <option value="AB">Alberta</option>
                  <option value="QC">Quebec</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="NB">New Brunswick</option>
                  <option value="MB">Manitoba</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="PE">Prince Edward Island</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code***</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-text px-6 py-2 rounded font-medium"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-text px-6 py-2 rounded font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Your Service */}
        {currentStep === 3 && (
          <div className="step-3">
            <h2 className="text-xl font-bold mb-6">STEP 3: CHOOSE YOUR SERVICE</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Cleaning - package</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                >
                  <option value="House Cleaning - package">House Cleaning - package</option>
                  <option value="House Cleaning - hourly">House Cleaning - hourly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Service *</label>
                <select
                  name="cleaningType"
                  value={formData.cleaningType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Standard House Cleaning">Standard House Cleaning</option>
                  <option value="Deep House Cleaning">Deep House Cleaning</option>
                  <option value="Move In/Out Cleaning">Move In/Out Cleaning</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Size</label>
                <select
                  name="homeSize"
                  value={formData.homeSize}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="small">500-999 Sqft</option>
                  <option value="medium">1000-1499 Sqft</option>
                  <option value="large">1500-1999 Sqft</option>
                  <option value="xlarge">2000-2499 Sqft</option>
                  <option value="xxlarge">2500+ Sqft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">No Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">0 Bathrooms</option>
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Half Baths</label>
                <select
                  name="halfBaths"
                  value={formData.halfBaths}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">0 Half Baths</option>
                  <option value="1">1 Half Bath</option>
                  <option value="2">2 Half Baths</option>
                  <option value="3">3+ Half Baths</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basement</label>
                <select
                  name="basement"
                  value={formData.basement}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">No Basement</option>
                  <option value="unfinished">Unfinished Basement</option>
                  <option value="finished">Finished Basement</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date / Time *</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-text px-6 py-2 rounded font-medium"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-text px-6 py-2 rounded font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Select Extras */}
        {currentStep === 4 && (
          <div className="step-4">
            <h2 className="text-xl font-bold mb-6">STEP 4: SELECT EXTRAS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.deepClean"
                    checked={formData.extras.deepClean}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Deep Clean Package</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.moveInOut"
                    checked={formData.extras.moveInOut}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Move In/Out Clean Package</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.renovation"
                    checked={formData.extras.renovation}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Renovation Clean Package</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.studentProperty"
                    checked={formData.extras.studentProperty}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Move In/Out Package (Student Property)</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.airbnb"
                    checked={formData.extras.airbnb}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>AirBnB Listing</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.pets"
                    checked={formData.extras.pets}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>I have Pets</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.insideFridge"
                    checked={formData.extras.insideFridge}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Inside Fridge</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.insideOven"
                    checked={formData.extras.insideOven}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Inside Oven</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.insideCabinets"
                    checked={formData.extras.insideCabinets}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Inside Cabinets</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="extras.additionalKitchen"
                    checked={formData.extras.additionalKitchen}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Additional Kitchen</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Instructions / Priorities:</label>
              <textarea
                name="cleaningInstructions"
                value={formData.cleaningInstructions}
                onChange={handleChange}
                placeholder="If you chose hourly cleaning, please provide your list of priorities here. If you chose a cleaning package, tell us what areas in your home need extra attention."
                className="w-full p-3 border border-gray-300 rounded h-32"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">ACCESS INFO: Please provide details on property access, anything we should be aware of</label>
              <textarea
                name="accessInfo"
                value={formData.accessInfo}
                onChange={handleChange}
                placeholder="Keypad code / key location / will you be home? / do about your pets etc."
                className="w-full p-3 border border-gray-300 rounded h-32"
              ></textarea>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Please select property type:</h3>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="propertyType"
                    value="house"
                    checked={formData.propertyType === 'house'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>House</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="propertyType"
                    value="apartment"
                    checked={formData.propertyType === 'apartment'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Apartment</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="propertyType"
                    value="commercial"
                    checked={formData.propertyType === 'commercial'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Commercial</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Do you have a service time restriction?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="timeRestriction.notFlexible"
                    checked={formData.timeRestriction.notFlexible}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Not flexible at all</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="timeRestriction.sameDayFine"
                    checked={formData.timeRestriction.sameDayFine}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Same day is fine</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="timeRestriction.nextDayFine"
                    checked={formData.timeRestriction.nextDayFine}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Next day is fine</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="timeRestriction.sameWeekFine"
                    checked={formData.timeRestriction.sameWeekFine}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Same week is fine</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-text px-6 py-2 rounded font-medium"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-text px-6 py-2 rounded font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Select Frequency and Payment */}
        {currentStep === 5 && (
          <div className="step-5">
            <h2 className="text-xl font-bold mb-6">STEP 5: SELECT FREQUENCY AND PAYMENT</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency of Service *</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              >
                <option value="One Time">One Time</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="mb-8 bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">WHAT HAPPENS NEXT?</h3>
              <p className="text-sm mb-2">We will not charge your card until AFTER your service is complete and you will receive an email receipt instantly.</p>
              <p className="text-sm mb-2">If you selected a recurring cleaning service, your ongoing discount will begin to apply after the first cleaning.</p>
              <p className="text-sm italic">By booking our services, you are agreeing to the terms and conditions.</p>
            </div>

            {/* Price calculation */}
            <div className="mb-8 bg-gray-800 text-white p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>SUB-TOTAL</span>
                <span>${price.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>SALES TAX</span>
                <span>${price.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>YOUR FINAL PRICE IS:</span>
                <span>${price.finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-text px-6 py-2 rounded font-medium"
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded font-medium"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
