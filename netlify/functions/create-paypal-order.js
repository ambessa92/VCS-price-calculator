// PayPal Order Creation Function
exports.handler = async function(event, context) {
  try {
    console.log('PayPal order creation function called');

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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Method Not Allowed' })
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

    const { amount, email, description, currency = 'USD' } = data;

    // Validate required fields
    if (!amount || !email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields: amount and email' })
      };
    }

    // For demo purposes, return a mock order ID
    // In production, you would integrate with PayPal's REST API
    const mockOrderId = `PAYPAL_ORDER_${Date.now()}`;

    console.log(`Created PayPal order for ${email}, amount: ${amount}, description: ${description}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: mockOrderId,
        status: 'CREATED',
        amount: amount,
        currency: currency,
        description: description,
        customerEmail: email
      })
    };

  } catch (error) {
    console.error('PayPal order creation error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to create PayPal order',
        details: error.message
      })
    };
  }
};
