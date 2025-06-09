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
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // Get PayPal Client ID from environment variables
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const isDemoMode = !PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'demo_client_id' || PAYPAL_CLIENT_ID === '';

  // Debug: Log the Client ID status
  useEffect(() => {
    console.log('PayPal Client ID:', PAYPAL_CLIENT_ID ? 'Present' : 'Missing');
    console.log('Demo Mode:', isDemoMode);
  }, [PAYPAL_CLIENT_ID, isDemoMode]);

  useEffect(() => {
    if (isDemoMode || scriptLoadedRef.current) return;

    const loadPayPalScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk"]`);
      if (existingScript) {
        existingScript.remove();
      }

      console.log('Loading PayPal SDK...');
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&components=buttons`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('PayPal SDK loaded successfully');
        scriptLoadedRef.current = true;
        setIsPayPalLoaded(true);
        setPaypalError(null);
      };

      script.onerror = (error) => {
        console.error('Failed to load PayPal SDK:', error);
        setPaypalError('Failed to load PayPal. Please refresh and try again.');
        scriptLoadedRef.current = false;
      };

      document.head.appendChild(script);
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadPayPalScript, 100);
    return () => clearTimeout(timer);
  }, [PAYPAL_CLIENT_ID, isDemoMode]);

  useEffect(() => {
    if (!isDemoMode && isPayPalLoaded && paypalRef.current && !isPayPalReady) {
      console.log('Initializing PayPal buttons...');

      // Clear any existing content
      paypalRef.current.innerHTML = '';

      if (window.paypal) {
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
              console.log('Creating PayPal order...');
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: props.amount.toFixed(2),
                    currency_code: 'USD'
                  },
                  description: `${props.serviceDetails.serviceType} - ${props.serviceDetails.frequency}`,
                  custom_id: `VCS_${Date.now()}`,
                  invoice_id: `INV_${Date.now()}`
                }],
                application_context: {
                  brand_name: 'VCS Cleaning Services',
                  locale: 'en-US',
                  user_action: 'PAY_NOW'
                }
              });
            },
            onApprove: async (data: any, actions: any) => {
              console.log('PayPal payment approved, capturing...');
              setIsProcessing(true);
              try {
                const order = await actions.order.capture();
                console.log('PayPal payment successful:', order);
                props.onPaymentSuccess();
              } catch (error) {
                console.error('PayPal capture error:', error);
                props.onPaymentError?.('Payment processing failed. Please try again.');
              } finally {
                setIsProcessing(false);
              }
            },
            onError: (err: any) => {
              console.error('PayPal button error:', err);
              setPaypalError('PayPal payment error. Please try again.');
              props.onPaymentError?.('Payment error occurred');
              setIsProcessing(false);
            },
            onCancel: (data: any) => {
              console.log('PayPal payment cancelled:', data);
              setIsProcessing(false);
            }
          }).render(paypalRef.current).then(() => {
            console.log('PayPal buttons rendered successfully');
            setIsPayPalReady(true);
          }).catch((error: any) => {
            console.error('PayPal render error:', error);
            setPaypalError('Failed to load PayPal buttons. Please refresh the page.');
          });
        } catch (error) {
          console.error('PayPal initialization error:', error);
          setPaypalError('PayPal initialization failed. Please refresh the page.');
        }
      } else {
        console.error('PayPal SDK not available');
        setPaypalError('PayPal is not available. Please refresh the page.');
      }
    }
  }, [isDemoMode, isPayPalLoaded, props, isPayPalReady]);

  const handleDemoPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      props.onPaymentSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  const retryPayPal = () => {
    setPaypalError(null);
    setIsPayPalLoaded(false);
    setIsPayPalReady(false);
    scriptLoadedRef.current = false;

    // Remove existing script
    const existingScript = document.querySelector(`script[src*="paypal.com/sdk"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Payment</h3>

      {isDemoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Set VITE_PAYPAL_CLIENT_ID in environment variables for real payments.
          </p>
        </div>
      )}

      {paypalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">
            <strong>Error:</strong> {paypalError}
          </p>
          <button
            onClick={retryPayPal}
            className="mt-2 text-red-600 underline text-sm hover:text-red-800"
          >
            Retry PayPal Loading
          </button>
        </div>
      )}

      <div className="mb-4 space-y-2">
        <p><strong>Amount:</strong> ${props.amount.toFixed(2)}</p>
        <p><strong>Customer:</strong> {props.customerDetails.name}</p>
        <p><strong>Service:</strong> {props.serviceDetails.serviceType}</p>
        <p><strong>Frequency:</strong> {props.serviceDetails.frequency}</p>
      </div>

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
          {!isPayPalLoaded && !paypalError && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Loading PayPal...</p>
            </div>
          )}

          {isPayPalLoaded && !paypalError && (
            <div>
              <div ref={paypalRef} className="min-h-[45px] paypal-buttons"></div>
              {isProcessing && (
                <div className="text-center mt-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <p className="text-sm text-gray-600 inline">Processing payment...</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
