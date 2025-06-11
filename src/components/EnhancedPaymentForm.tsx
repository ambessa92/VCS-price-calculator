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
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  // Get PayPal Client ID from environment variables
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Only use demo mode if absolutely no Client ID is provided
  const isDemoMode = !PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.trim() === '';

  const addDiagnostic = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnostics(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`PayPal Diagnostic: ${message}`);
  };

  // Debug logging
  useEffect(() => {
    addDiagnostic('=== PayPal Configuration ===');
    addDiagnostic(`Client ID present: ${!!PAYPAL_CLIENT_ID}`);
    addDiagnostic(`Client ID length: ${PAYPAL_CLIENT_ID?.length || 0}`);
    addDiagnostic(`Client ID preview: ${PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.substring(0, 10) + '...' : 'None'}`);
    addDiagnostic(`Demo mode: ${isDemoMode}`);
    addDiagnostic('============================');
  }, [PAYPAL_CLIENT_ID, isDemoMode]);

  const testPayPalURL = async () => {
    if (!PAYPAL_CLIENT_ID) return false;

    try {
      addDiagnostic('Testing PayPal SDK URL accessibility...');
      const testUrl = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=CAD`;

      // Try to fetch the URL to see if it's accessible
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors' // This will avoid CORS issues for testing
      });

      addDiagnostic('PayPal URL test completed (no-cors mode)');
      return true;
    } catch (error) {
      addDiagnostic(`PayPal URL test failed: ${error}`);
      return false;
    }
  };

  const loadPayPalScript = async () => {
    if (isDemoMode || loadAttempts >= 3) return;

    try {
      addDiagnostic(`Loading PayPal SDK (attempt ${loadAttempts + 1}/3)...`);

      // Test URL accessibility first
      await testPayPalURL();

      // Remove any existing PayPal scripts
      const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
      if (existingScripts.length > 0) {
        addDiagnostic(`Removing ${existingScripts.length} existing PayPal scripts`);
        existingScripts.forEach(script => script.remove());
      }

      // Clear any existing PayPal objects
      if (window.paypal) {
        addDiagnostic('Clearing existing PayPal object');
        delete window.paypal;
      }

      const script = document.createElement('script');
      const paypalUrl = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=CAD&intent=capture&components=buttons`;

      addDiagnostic(`PayPal SDK URL: ${paypalUrl.substring(0, 50)}...`);

      script.src = paypalUrl;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.type = 'text/javascript';

      const loadPromise = new Promise((resolve, reject) => {
        script.onload = () => {
          addDiagnostic('PayPal SDK script loaded successfully');
          resolve(true);
        };

        script.onerror = (error) => {
          addDiagnostic(`PayPal SDK script load error: ${error}`);
          reject(new Error('Failed to load PayPal SDK script'));
        };

        // Timeout after 20 seconds
        setTimeout(() => {
          addDiagnostic('PayPal SDK load timeout (20 seconds)');
          reject(new Error('PayPal SDK load timeout'));
        }, 20000);
      });

      addDiagnostic('Adding PayPal script to document head');
      document.head.appendChild(script);
      await loadPromise;

      addDiagnostic('Waiting for PayPal object initialization...');
      // Wait a moment for PayPal to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (window.paypal) {
        addDiagnostic('PayPal object found in window - SDK ready!');
        setIsPayPalLoaded(true);
        setPaypalError(null);
      } else {
        addDiagnostic('PayPal object NOT found in window after loading');
        throw new Error('PayPal SDK loaded but window.paypal not available');
      }

    } catch (error) {
      addDiagnostic(`PayPal load error: ${error}`);
      setLoadAttempts(prev => prev + 1);

      if (loadAttempts < 2) {
        addDiagnostic('Retrying in 4 seconds...');
        setPaypalError('Retrying PayPal connection...');
        setTimeout(() => loadPayPalScript(), 4000);
      } else {
        addDiagnostic('Max attempts reached - PayPal loading failed');
        setPaypalError('Failed to connect to PayPal. This may be due to network issues or an invalid Client ID.');
        setShowDiagnostics(true);
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

    addDiagnostic('Initializing PayPal buttons...');
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
          addDiagnostic(`Creating PayPal order for amount: $${props.amount}`);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: props.amount.toFixed(2),
                currency_code: 'CAD'
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
          addDiagnostic(`PayPal payment approved: ${data.orderID}`);
          setIsProcessing(true);

          try {
            const order = await actions.order.capture();
            addDiagnostic('Payment captured successfully');
            props.onPaymentSuccess();
          } catch (error) {
            addDiagnostic(`Payment capture error: ${error}`);
            props.onPaymentError?.('Payment processing failed');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          addDiagnostic(`PayPal button error: ${err}`);
          setPaypalError('Payment error occurred. Please try again.');
          setIsProcessing(false);
        },
        onCancel: (data: any) => {
          addDiagnostic('Payment cancelled by user');
          setIsProcessing(false);
        }
      }).render(paypalRef.current);

      addDiagnostic('PayPal buttons rendered successfully');
    } catch (error) {
      addDiagnostic(`PayPal button initialization error: ${error}`);
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
    addDiagnostic('User requested retry - resetting PayPal');
    setPaypalError(null);
    setIsPayPalLoaded(false);
    setLoadAttempts(0);
    setDiagnostics([]);
    setShowDiagnostics(false);

    // Small delay then retry
    setTimeout(() => {
      loadPayPalScript();
    }, 1000);
  };

  const handleForceDemo = () => {
    addDiagnostic('User forced demo mode');
    setPaypalError(null);
    setIsPayPalLoaded(false);
    // Temporarily override demo mode for this session
    handleDemoPayment();
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

      {/* Error Display with Diagnostics */}
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
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="text-blue-600 underline text-sm hover:text-blue-800"
            >
              {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
            </button>
            <button
              onClick={handleForceDemo}
              className="text-gray-600 underline text-sm hover:text-gray-800"
            >
              Use Demo Payment
            </button>
          </div>

          {/* Diagnostics Panel */}
          {showDiagnostics && (
            <div className="mt-3 bg-gray-100 border rounded p-2 text-xs font-mono">
              <p className="font-bold mb-2">Diagnostic Log:</p>
              {diagnostics.map((log, index) => (
                <p key={index} className="mb-1">{log}</p>
              ))}
            </div>
          )}
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
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="mt-2 text-xs text-gray-500 underline"
              >
                Show loading details
              </button>

              {showDiagnostics && diagnostics.length > 0 && (
                <div className="mt-3 bg-gray-100 border rounded p-2 text-xs font-mono text-left max-h-32 overflow-y-auto">
                  {diagnostics.slice(-5).map((log, index) => (
                    <p key={index} className="mb-1">{log}</p>
                  ))}
                </div>
              )}
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
