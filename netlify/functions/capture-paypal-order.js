const paypal = require('@paypal/checkout-server-sdk');

function getPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.log('PayPal credentials not found, using sandbox mode for testing');
    return new paypal.core.SandboxEnvironment('sb', 'sb');
  }
  
  const isProduction = process.env.NODE_ENV === 'production' && 
                       !clientId.includes('sb-') && 
                       !clientId.includes('ATJ');
  
  if (isProduction) {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(getPayPalEnvironment());
}

exports.handler = async function(event, context) {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { orderID, email } = JSON.parse(event.body);

    if (!orderID) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing orderID' })
      };
    }

    // Create capture request
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // Execute the capture
    const client = getPayPalClient();
    const response = await client.execute(request);

    console.log('PayPal order captured successfully:', {
      id: response.result.id,
      status: response.result.status,
      email: email,
      captureId: response.result.purchase_units[0]?.payments?.captures[0]?.id
    });

    // Extract payment details
    const captureDetails = response.result.purchase_units[0]?.payments?.captures[0];
    const payerInfo = response.result.payer;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: response.result.id,
        status: response.result.status,
        payer: {
          name: payerInfo?.name,
          email: payerInfo?.email_address
        },
        capture: {
          id: captureDetails?.id,
          amount: captureDetails?.amount,
          status: captureDetails?.status
        }
      })
    };

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    
    let errorMessage = 'Failed to capture PayPal order';
    let statusCode = 500;
    
    if (error.statusCode) {
      statusCode = error.statusCode;
      if (error.message) {
        errorMessage = error.message;
      }
    }

    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
EOF  
cd /home/project && cd hellamaid-quote-system/netlify/functions && cat > capture-paypal-order.js << 'EOF'
const paypal = require('@paypal/checkout-server-sdk');

function getPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.log('PayPal credentials not found, using sandbox mode for testing');
    return new paypal.core.SandboxEnvironment('sb', 'sb');
  }
  
  const isProduction = process.env.NODE_ENV === 'production' && 
                       !clientId.includes('sb-') && 
                       !clientId.includes('ATJ');
  
  if (isProduction) {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(getPayPalEnvironment());
}

exports.handler = async function(event, context) {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { orderID, email } = JSON.parse(event.body);

    if (!orderID) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing orderID' })
      };
    }

    // Create capture request
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // Execute the capture
    const client = getPayPalClient();
    const response = await client.execute(request);

    console.log('PayPal order captured successfully:', {
      id: response.result.id,
      status: response.result.status,
      email: email,
      captureId: response.result.purchase_units[0]?.payments?.captures[0]?.id
    });

    // Extract payment details
    const captureDetails = response.result.purchase_units[0]?.payments?.captures[0];
    const payerInfo = response.result.payer;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: response.result.id,
        status: response.result.status,
        payer: {
          name: payerInfo?.name,
          email: payerInfo?.email_address
        },
        capture: {
          id: captureDetails?.id,
          amount: captureDetails?.amount,
          status: captureDetails?.status
        }
      })
    };

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    
    let errorMessage = 'Failed to capture PayPal order';
    let statusCode = 500;
    
    if (error.statusCode) {
      statusCode = error.statusCode;
      if (error.message) {
        errorMessage = error.message;
      }
    }

    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};
