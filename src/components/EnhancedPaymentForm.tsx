import React, { useEffect, useRef, useState } from 'react';

interface EnhancedPaymentFormProps {
  amount: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  serviceDetails: {
    serviceType: string;
    frequency: string;
    addOns: string[];
  };
  onPaymentSuccess: () => void;
  onPaymentError?: (error: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function EnhancedPaymentForm(props: EnhancedPaymentFormProps) {
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Get PayPal Client ID from environment variables
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Only use demo mode if absolutely no Client ID is provided
  const isDemoMode = !PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.trim() === '';

  // Debug logging
  useEffect(() => {
    console.log('=== PayPal Configuration ===');
    console.log('Client ID present:', !!PAYPAL_CLIENT_ID);
    console.log('Client ID length:', PAYPAL_CLIENT_ID?.length || 0);
    console.log('Demo mode:', isDemoMode);
    console.log('============================');
  }, [PAYPAL_CLIENT_ID, isDemoMode]);

  const loadPayPalScript = async () => {
    if (isDemoMode || loadAttempts >= 3) return;

    try {
      console.log(`Loading PayPal SDK (attempt ${loadAttempts + 1})...`);

      // Remove any existing PayPal scripts
      const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
      existingScripts.forEach(script => script.remove());

      // Clear any existing PayPal objects
      if (window.paypal) {
        delete window.paypal;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons`;
      script.async = true;
      script.crossOrigin = 'anonymous';

      const loadPromise = new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('PayPal SDK loaded successfully');
          resolve(true);
        };

        script.onerror = (error) => {
          console.error('PayPal SDK load error:', error);
          reject(new Error('Failed to load PayPal SDK'));
        };

        // Timeout after 15 seconds
        setTimeout(() => {
          reject(new Error('PayPal SDK load timeout'));
        }, 15000);
      });

      document.head.appendChild(script);
      await loadPromise;

      // Wait a moment for PayPal to initialize
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (window.paypal) {
        setIsPayPalLoaded(true);
        setPaypalError(null);
        console.log('PayPal SDK ready');
      } else {
        throw new Error('PayPal SDK loaded but window.paypal not available');
      }

    } catch (error) {
      console.error('PayPal load error:', error);
      setLoadAttempts(prev => prev + 1);

      if (loadAttempts < 2) {
        setPaypalError('Retrying PayPal connection...');
        setTimeout(() => loadPayPalScript(), 3000);
      } else {
        setPaypalError('Failed to connect to PayPal. Please refresh the page and try again.');
      }
    }
  };

  useEffect(() => {
    if (!isDemoMode) {
      loadPayPalScript();
    }
  }, [isDemoMode]);

  const initializePayPalButtons = () => {
    if (!window.paypal || !paypalRef.current) return;

    console.log('Initializing PayPal buttons...');
    paypalRef.current.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          height: 45
        },
        createOrder: (data: any, actions: any) => {
          console.log('Creating PayPal order for amount:', props.amount);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: props.amount.toFixed(2),
                currency_code: 'USD'
              },
              description: `${props.serviceDetails.serviceType} - ${props.serviceDetails.frequency}`,
              custom_id: `VCS_${Date.now()}`,
              soft_descriptor: 'VCS Cleaning'
            }],
            application_context: {
              brand_name: 'VCS Cleaning Services',
              locale: 'en-US',
              user_action: 'PAY_NOW',
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: async (data: any, actions: any) => {
          console.log('PayPal payment approved:', data.orderID);
          setIsProcessing(true);

          try {
            const order = await actions.order.capture();
            console.log('Payment captured successfully:', order);
            props.onPaymentSuccess();
          } catch (error) {
            console.error('Payment capture error:', error);
            props.onPaymentError?.('Payment processing failed');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setPaypalError('Payment error occurred. Please try again.');
          setIsProcessing(false);
        },
        onCancel: (data: any) => {
          console.log('Payment cancelled:', data);
          setIsProcessing(false);
        }
      }).render(paypalRef.current);

    } catch (error) {
      console.error('PayPal button initialization error:', error);
      setPaypalError('Failed to initialize PayPal buttons');
    }
  };

  useEffect(() => {
    if (isPayPalLoaded && paypalRef.current) {
      initializePayPalButtons();
    }
  }, [isPayPalLoaded, props.amount]);

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      props.onPaymentSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  const handleRetry = () => {
    setPaypalError(null);
    setIsPayPalLoaded(false);
    setLoadAttempts(0);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>

      {/* Only show demo warning if truly no Client ID */}
      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> PayPal Client ID not configured. Add VITE_PAYPAL_CLIENT_ID to environment variables for real payments.
          </p>
        </div>
      )}

      {/* Error Display */}
      {paypalError && !isDemoMode && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">
            <strong>Error:</strong> {paypalError}
          </p>
          <div className="mt-2 space-x-2">
            <button
              onClick={handleRetry}
              className="text-red-600 underline text-sm hover:text-red-800"
            >
              Retry PayPal Loading
            </button>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="mb-4 space-y-2">
        <p><strong>Amount:</strong> ${props.amount.toFixed(2)}</p>
        <p><strong>Customer:</strong> {props.customerDetails.name}</p>
        <p><strong>Service:</strong> {props.serviceDetails.serviceType}</p>
        <p><strong>Frequency:</strong> {props.serviceDetails.frequency}</p>
      </div>

      {/* Payment Options */}
      {isDemoMode ? (
        <button
          onClick={handleDemoPayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Complete Payment (Demo)'}
        </button>
      ) : (
        <div>
          {/* Loading State */}
          {!isPayPalLoaded && !paypalError && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-600">Loading PayPal...</p>
              <p className="text-sm text-gray-500">Attempt {loadAttempts + 1} of 3</p>
            </div>
          )}

          {/* PayPal Buttons */}
          {isPayPalLoaded && !paypalError && (
            <div>
              <div ref={paypalRef} className="paypal-buttons-container min-h-[50px]"></div>
              {isProcessing && (
                <div className="text-center mt-3 p-3 bg-blue-50 rounded">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-700">Processing your payment...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
