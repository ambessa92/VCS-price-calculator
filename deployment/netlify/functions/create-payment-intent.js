// Test function to verify serverless function deployment
exports.handler = async function(event, context) {
  try {
    console.log('Test function called with method:', event.httpMethod);
    console.log('Test function body:', event.body);

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: ''
      };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: 'Method Not Allowed'
      };
    }

    // Parse the request body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { amount, email, description, currency = 'usd' } = data;

    // Validate required fields
    if (!amount || !email) {
      console.log('Missing required fields - amount:', amount, 'email:', email);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields: amount and email' })
      };
    }

    // Check if we have a valid Stripe secret key
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    console.log('Stripe secret key check - exists:', !!stripeSecretKey);

    if (!stripeSecretKey || stripeSecretKey.includes('YOUR_ACTUAL_SECRET_KEY_HERE') || stripeSecretKey.includes('your_secret_key_here') || stripeSecretKey === '') {
      console.log('No real Stripe secret key - returning demo payment intent for testing');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_secret: 'pi_demo_mock_payment_intent_secret',
          paymentIntentId: 'pi_demo_mock_payment_intent_id',
          note: 'Demo payment - Configure real Stripe keys for live payments',
          isDemoMode: true
        })
      };
    }

    // Try to use real Stripe if secret key is properly configured
    try {
      const stripe = require('stripe')(stripeSecretKey);
      console.log(`Creating payment intent for ${email}, amount: ${amount}, description: ${description}`);

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // amount should be in cents
        currency: currency,
        receipt_email: email,
        description: description || 'Cleaning Service',
        metadata: {
          customerEmail: email,
          serviceDescription: description || 'Cleaning Service'
        }
      });

      console.log('Payment intent created successfully:', paymentIntent.id);

      // Return the client secret to the frontend
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_secret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        })
      };
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: stripeError.message || 'Stripe payment processing failed',
          details: 'Please check your Stripe configuration and try again'
        })
      };
    }
  } catch (error) {
    console.error('Function error:', error);

    // Return error information with more debugging details
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Failed to create payment intent',
        debug: {
          errorType: error.constructor.name,
          errorStack: error.stack,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
};
