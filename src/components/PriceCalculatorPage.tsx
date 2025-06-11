import { useState } from 'react';
import PriceCalculator from './PriceCalculator';
import { QuickPriceCalculator } from './QuickPriceCalculator';

export function PriceCalculatorPage() {
  const [calculatorType, setCalculatorType] = useState<'quick' | 'detailed'>('detailed');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Cleaning Service Price Calculator</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto">
        Get an instant price estimate for your cleaning needs. Choose between our detailed calculator or quick calculator for simpler options.
      </p>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setCalculatorType('detailed')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              calculatorType === 'detailed'
                ? 'bg-yellow-400 text-gray-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Detailed Calculator
          </button>
          <button
            onClick={() => setCalculatorType('quick')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              calculatorType === 'quick'
                ? 'bg-yellow-400 text-gray-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-l-0 border-gray-300`}
          >
            Quick Calculator
          </button>
        </div>
      </div>

      {calculatorType === 'detailed' ? (
        <PriceCalculator />
      ) : (
        <QuickPriceCalculator />
      )}

      <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">How Our Pricing Works</h2>
        <p className="mb-4">
          Our pricing is based on several factors to ensure you get a fair and accurate quote for your cleaning needs:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Home Size:</strong> The larger your home, the more time and resources required to clean it.</li>
          <li><strong>Bedrooms & Bathrooms:</strong> These rooms typically require more detailed cleaning.</li>
          <li><strong>Type of Cleaning:</strong> Deep cleanings and move-in/move-out services are more thorough than standard cleanings.</li>
          <li><strong>Additional Services:</strong> Add-ons like inside fridge or oven cleaning require extra time and specialized cleaning products.</li>
        </ul>
        <p>
          All prices shown include applicable taxes. For the most accurate quote, we recommend using our detailed calculator which accounts for all these factors.
        </p>
      </div>
    </div>
  );
}
