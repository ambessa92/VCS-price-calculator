import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface PayPalPaymentFormProps {
  amount: number;
  email: string;
  description: string;
  onPaymentSuccess: () => void;
  onPaymentError?: (error: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  amount,
  email,
  description,
  onPaymentSuccess,
  onPaymentError
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);

  // Load PayPal script
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsPayPalLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      // Use PayPal's demo client ID for testing - replace with real client ID in production
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD&intent=capture&components=buttons`;
      script.async = true;

      script.onload = () => {
        setIsPayPalLoaded(true);
        setIsLoading(false);
      };

      script.onerror = () => {
        setError('Failed to load PayPal');
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  // Initialize PayPal buttons
  useEffect(() => {
    if (!isPayPalLoaded || !window.paypal || !paypalRef.current) {
      return;
    }

    // Clear any existing buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 50
      },

      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: 'CAD'
            },
            description: description,
            custom_id: `cleaning-${Date.now()}`,
            invoice_id: `INV-${Date.now()}`
          }],
          payer: {
            email_address: email
          }
        });
      },

      onApprove: async (data: any, actions: any) => {
        try {
          const order = await actions.order.capture();
          console.log('PayPal payment successful:', order);

          // Check if payment was completed
          if (order.status === 'COMPLETED') {
            console.log(`✅ Payment completed for ${email}, amount: $${amount}`);
            onPaymentSuccess();
          } else {
            onPaymentError?.('Payment was not completed');
          }
        } catch (error) {
          console.error('PayPal payment error:', error);
          onPaymentError?.('Payment processing failed');
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
        onPaymentError?.('PayPal payment failed');
      },

      onCancel: (data: any) => {
        console.log('PayPal payment cancelled:', data);
        onPaymentError?.('Payment was cancelled');
      }
    }).render(paypalRef.current);
  }, [isPayPalLoaded, amount, email, description, onPaymentSuccess, onPaymentError]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">💳 Payment Information</h3>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading PayPal...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">💳 Payment Information</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">💳 Payment Information</h3>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">
            🚀 <strong>PayPal Payments:</strong> Secure payment processing with PayPal. You can pay with your PayPal account or any major credit/debit card.
          </p>
        </div>

        {/* Payment Amount Display */}
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Service: {description}
          </div>
        </div>

        {/* PayPal Buttons Container */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💰 Choose Payment Method
          </label>
          <div
            ref={paypalRef}
            className="min-h-[120px] border rounded-lg p-3 bg-gray-50"
          />
        </div>

        {/* Payment Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">💡 Payment Options Available:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 🅿️ <strong>PayPal Account:</strong> Log in and pay with your PayPal balance</li>
            <li>• 💳 <strong>Credit/Debit Cards:</strong> Pay directly without a PayPal account</li>
            <li>• 📱 <strong>Mobile Optimized:</strong> Works perfectly on all devices</li>
          </ul>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is secure and encrypted. PayPal handles all payment processing with industry-standard security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalPaymentForm;
