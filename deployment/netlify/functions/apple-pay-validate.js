// Apple Pay Merchant Validation Function
const https = require('https');
const fs = require('fs');

exports.handler = async function(event, context) {
  try {
    console.log('Apple Pay merchant validation function called');

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

    const { validationURL, domainName } = data;

    // Validate required fields
    if (!validationURL || !domainName) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing validationURL or domainName' })
      };
    }

    // In production, you need to:
    // 1. Load your Apple Pay merchant certificate and key
    // 2. Make an HTTPS request to Apple's validation URL
    // 3. Return the merchant session

    // Production implementation example:
    /*
    const merchantCert = fs.readFileSync(process.env.APPLE_PAY_MERCHANT_CERT_PATH);
    const merchantKey = fs.readFileSync(process.env.APPLE_PAY_MERCHANT_KEY_PATH);

    const postData = JSON.stringify({
      merchantIdentifier: process.env.VITE_APPLE_MERCHANT_ID,
      domainName: domainName,
      displayName: 'Hellamaid Cleaning Service'
    });

    const options = {
      hostname: new URL(validationURL).hostname,
      port: 443,
      path: new URL(validationURL).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      cert: merchantCert,
      key: merchantKey
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: responseData
          });
        });
      });

      req.on('error', (error) => {
        reject({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Merchant validation failed' })
        });
      });

      req.write(postData);
      req.end();
    });
    */

    // For demo/development purposes, return a mock response
    console.log(`Apple Pay validation requested for domain: ${domainName}`);
    console.log(`Validation URL: ${validationURL}`);

    // Return mock merchant session for development
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        epochTimestamp: Date.now(),
        expiresAt: Date.now() + (1000 * 60 * 60), // 1 hour
        merchantSessionIdentifier: `demo_session_${Date.now()}`,
        nonce: Math.random().toString(36).substring(2),
        merchantIdentifier: process.env.VITE_APPLE_MERCHANT_ID || 'demo.merchant.id',
        domainName: domainName,
        displayName: 'Hellamaid Cleaning Service',
        signature: 'demo_signature_for_development'
      })
    };

  } catch (error) {
    console.error('Apple Pay validation error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to validate Apple Pay merchant',
        details: error.message
      })
    };
  }
};
