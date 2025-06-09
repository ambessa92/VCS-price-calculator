import type React from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const [paypalClientId, setPaypalClientId] = useState('');
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [showClientIdInput, setShowClientIdInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'demo' | 'manual'>('paypal');
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

  const addDiagnostic = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnostics(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`PayPal Diagnostic: ${message}`);
  };

  // Load saved Client ID from localStorage
  useEffect(() => {
    const savedClientId = localStorage.getItem('vcs_paypal_client_id');
    if (savedClientId && savedClientId !== 'your-production-client-id-here') {
      setPaypalClientId(savedClientId);
      addDiagnostic(`Loaded saved Client ID: ${savedClientId.substring(0, 10)}...`);
    } else {
      addDiagnostic('No valid saved Client ID found');
      setShowClientIdInput(true);
    }
  }, []);

  const loadPayPalScript = async (clientId: string) => {
    if (!clientId || clientId.length < 10) {
      addDiagnostic('Invalid Client ID provided');
      setPaypalError('Please enter a valid PayPal Client ID');
      return;
    }

    try {
      addDiagnostic(`Attempting to load PayPal SDK with Client ID: ${clientId.substring(0, 10)}...`);

      // Remove any existing PayPal scripts
      const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
      for (const script of existingScripts) {
        script.remove();
      }

      // Clear any existing PayPal objects
      if (window.paypal) {
        window.paypal = undefined;
      }

      const script = document.createElement('script');
      const paypalUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons,funding-eligibility`;

      script.src = paypalUrl;
      script.async = true;
      script.crossOrigin = 'anonymous';

      const loadPromise = new Promise((resolve, reject) => {
        script.onload = () => {
          addDiagnostic('PayPal SDK script loaded successfully');
          setTimeout(() => {
            if (window.paypal) {
              addDiagnostic('PayPal object confirmed in window');
              resolve(true);
            } else {
              addDiagnostic('PayPal object not found after script load');
              reject(new Error('PayPal SDK loaded but window.paypal not available'));
            }
          }, 1000);
        };

        script.onerror = (error) => {
          addDiagnostic(`PayPal SDK script error: ${error}`);
          reject(new Error('Failed to load PayPal SDK - check Client ID'));
        };

        setTimeout(() => {
          addDiagnostic('PayPal SDK load timeout');
          reject(new Error('PayPal SDK load timeout'));
        }, 15000);
      });

      document.head.appendChild(script);
      await loadPromise;

      setIsPayPalLoaded(true);
      setPaypalError(null);
      setShowClientIdInput(false);

      // Save working Client ID
      localStorage.setItem('vcs_paypal_client_id', clientId);
      addDiagnostic('PayPal SDK loaded successfully and Client ID saved');

    } catch (error) {
      addDiagnostic(`PayPal SDK load failed: ${error}`);
      setPaypalError(`Failed to load PayPal: ${error}`);
      setShowClientIdInput(true);
    }
  };

  const handleClientIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paypalClientId.trim()) {
      loadPayPalScript(paypalClientId.trim());
    }
  };



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
    if (isPayPalLoaded && paypalRef.current && paymentMethod === 'paypal') {
      initializePayPalButtons();
    }
  }, [isPayPalLoaded, props.amount, paymentMethod]);

  // Auto-load PayPal if we have a saved Client ID
  useEffect(() => {
    if (paypalClientId && paypalClientId.length > 10 && !isPayPalLoaded && paymentMethod === 'paypal') {
      loadPayPalScript(paypalClientId);
    }
  }, [paypalClientId, paymentMethod]);

  const handleDemoPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      props.onPaymentSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  const handleManualPayment = () => {
    const paymentInfo = `
PayPal Manual Payment Information:
- Amount: ${props.amount.toFixed(2)}
- Customer: ${props.customerDetails.name}
- Email: ${props.customerDetails.email}
- Service: ${props.serviceDetails.serviceType}
- Booking Reference: VCS_${Date.now()}

Please send payment to: your-paypal-email@domain.com
Reference: VCS_${Date.now()}
    `;

    alert(paymentInfo);

    // Copy to clipboard
    navigator.clipboard.writeText(paymentInfo).then(() => {
      alert('Payment information copied to clipboard!');
    });
  };

  const clearSavedClientId = () => {
    localStorage.removeItem('vcs_paypal_client_id');
    setPaypalClientId('');
    setIsPayPalLoaded(false);
    setPaypalError(null);
    setShowClientIdInput(true);
    addDiagnostic('Cleared saved Client ID');
  };



  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>



      {/* Payment Details */}
      <div className="mb-4 space-y-2">
        <p><strong>Amount:</strong> ${props.amount.toFixed(2)}</p>
        <p><strong>Customer:</strong> {props.customerDetails.name}</p>
        <p><strong>Service:</strong> {props.serviceDetails.serviceType}</p>
        <p><strong>Frequency:</strong> {props.serviceDetails.frequency}</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Payment Method:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
              paymentMethod === 'paypal'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            💳 PayPal
          </button>
          <button
            onClick={() => setPaymentMethod('demo')}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
              paymentMethod === 'demo'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            🎭 Demo Payment
          </button>
          <button
            onClick={() => setPaymentMethod('manual')}
            className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
              paymentMethod === 'manual'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            📝 Manual/Contact
          </button>
        </div>
      </div>

      {/* PayPal Client ID Input */}
      {paymentMethod === 'paypal' && showClientIdInput && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">🔑 PayPal Configuration</h4>
          <form onSubmit={handleClientIdSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                PayPal Client ID:
              </label>
              <input
                type="text"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
                placeholder="Enter your PayPal Client ID (e.g., AQlFxG7KGFd6...)"
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-blue-600 mt-1">
                Get this from your PayPal Developer Dashboard at developer.paypal.com
              </p>
            </div>
            <button
              type="submit"
              disabled={!paypalClientId.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load PayPal Payment
            </button>
          </form>
        </div>
      )}

      {/* PayPal Payment */}
      {paymentMethod === 'paypal' && (
        <div>
          {/* PayPal Error Display */}
          {paypalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {paypalError}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => setShowClientIdInput(true)}
                  className="text-red-600 underline text-sm hover:text-red-800"
                >
                  Try Different Client ID
                </button>
                <button
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                  {showDiagnostics ? 'Hide' : 'Show'} Details
                </button>
                {paypalClientId && (
                  <button
                    onClick={clearSavedClientId}
                    className="text-gray-600 underline text-sm hover:text-gray-800"
                  >
                    Reset Configuration
                  </button>
                )}
              </div>

              {/* Diagnostics Panel */}
              {showDiagnostics && (
                <div className="mt-3 bg-gray-100 border rounded p-2 text-xs font-mono max-h-40 overflow-y-auto">
                  <p className="font-bold mb-2">Diagnostic Log:</p>
                  {diagnostics.map((log, index) => (
                    <p key={index} className="mb-1">{log}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {!isPayPalLoaded && !paypalError && !showClientIdInput && paypalClientId && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
              <p className="text-gray-600">Loading PayPal...</p>
            </div>
          )}

          {/* PayPal Buttons */}
          {isPayPalLoaded && !paypalError && (
            <div>
              <div ref={paypalRef} className="paypal-buttons-container min-h-[50px]" />
              {isProcessing && (
                <div className="text-center mt-3 p-3 bg-blue-50 rounded">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                  <span className="text-sm text-blue-700">Processing your payment...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Demo Payment */}
      {paymentMethod === 'demo' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> This will simulate a successful payment for testing purposes.
            </p>
          </div>
          <button
            onClick={handleDemoPayment}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Complete Payment (Demo)'}
          </button>
        </div>
      )}

      {/* Manual Payment */}
      {paymentMethod === 'manual' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">📝 Manual Payment Instructions</h4>
            <p className="text-purple-700 text-sm mb-3">
              Click below to get payment information that you can use to send payment manually or contact us directly.
            </p>
            <div className="space-y-2 text-sm text-purple-600">
              <p>• PayPal email: your-paypal-email@domain.com</p>
              <p>• Venmo: @your-venmo-handle</p>
              <p>• Phone: (555) 123-4567</p>
              <p>• Email: contact@vcscleaningservices.com</p>
            </div>
          </div>
          <button
            onClick={handleManualPayment}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            📋 Get Payment Information
          </button>
        </div>
      )}
    </div>
  );
}
