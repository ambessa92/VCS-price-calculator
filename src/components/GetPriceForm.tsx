import { useState } from 'react';

type FormData = {
  postalCode: string;
  homeSize: string;
  cleaningType: string;
};

export function GetPriceForm() {
  const [formData, setFormData] = useState<FormData>({
    postalCode: '',
    homeSize: '',
    cleaningType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // In a real implementation, this would navigate to a results page or show a modal with pricing
    alert(`Based on your inputs, we've calculated a price for you! This would be connected to actual pricing logic.`);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            name="homeSize"
            value={formData.homeSize}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          >
            <option value="">Home Size</option>
            <option value="small">Small (500-999 Sqft)</option>
            <option value="medium">Medium (1000-1499 Sqft)</option>
            <option value="large">Large (1500-1999 Sqft)</option>
            <option value="xlarge">X-Large (2000-2499 Sqft)</option>
            <option value="xxlarge">XX-Large (2500+ Sqft)</option>
          </select>

          <select
            name="cleaningType"
            value={formData.cleaningType}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          >
            <option value="">Type of Cleaning</option>
            <option value="standard">Standard Cleaning</option>
            <option value="deep">Deep Cleaning</option>
            <option value="movein">Move In/Out Cleaning</option>
            <option value="airbnb">AirBnB Cleaning</option>
            <option value="office">Office Cleaning</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-text font-bold py-3 rounded uppercase hover:bg-primary-dark transition duration-300"
        >
          See My Price
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Insured Maids</span>
        </div>

        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Verified House Cleaners</span>
        </div>

        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>100% Canadian</span>
        </div>
      </div>
    </div>
  );
}
