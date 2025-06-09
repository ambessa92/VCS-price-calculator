# 🚀 Production Deployment Guide - Enhanced Payment System v43

## 📋 Pre-Deployment Checklist

### ✅ Required Accounts & Credentials
- [ ] PayPal Business Account (Production)
- [ ] Apple Developer Account (for Apple Pay)
- [ ] Google Pay Business Console Account
- [ ] Netlify Account
- [ ] Domain with SSL certificate

### ✅ Required Files & Certificates
- [ ] Apple Pay merchant certificate (.cert file)
- [ ] Apple Pay merchant private key (.key file)
- [ ] Apple Pay domain association file
- [ ] PayPal production client credentials
- [ ] Google Pay merchant configuration

## 🔧 Step-by-Step Deployment

### Step 1: Apple Pay Setup

#### 1.1 Apple Developer Console Configuration
1. **Log into Apple Developer Console**
   - Go to [developer.apple.com](https://developer.apple.com)
   - Navigate to "Certificates, Identifiers & Profiles"

2. **Create Merchant ID**
   - Select "Merchant IDs"
   - Click "+" to create new Merchant ID
   - Use format: `merchant.hellamaid.com`
   - Description: "Hellamaid Cleaning Service"

3. **Create Merchant Certificate**
   - Select your Merchant ID
   - Click "Create Certificate"
   - Upload Certificate Signing Request (CSR)
   - Download the certificate file

4. **Domain Verification**
   - In Merchant ID settings, add your domain
   - Download domain association file
   - Upload to `/.well-known/apple-developer-merchantid-domain-association`

#### 1.2 Certificate Installation
```bash
# Upload certificates to Netlify (in build settings)
# Or store securely in environment variables as base64
cat merchant.cert | base64 > merchant_cert_base64.txt
cat merchant.key | base64 > merchant_key_base64.txt
```

### Step 2: Google Pay Setup

#### 2.1 Google Pay Console
1. **Register Business**
   - Go to [pay.google.com/business/console](https://pay.google.com/business/console)
   - Complete business verification
   - Note your Merchant ID

2. **Integration Configuration**
   - Choose payment processor (e.g., Stripe, PayPal)
   - Configure gateway merchant ID
   - Test in sandbox environment first

#### 2.2 Environment Configuration
```bash
# Add to Netlify environment variables
VITE_GOOGLE_MERCHANT_ID=your-google-merchant-id
VITE_GOOGLE_GATEWAY_MERCHANT_ID=your-gateway-merchant-id
GOOGLE_PAY_ENVIRONMENT=PRODUCTION
```

### Step 3: PayPal Production Setup

#### 3.1 PayPal Business Account
1. **Upgrade to Business Account**
   - Ensure account is verified
   - Complete business verification if required

2. **Create Production App**
   - Go to [developer.paypal.com](https://developer.paypal.com)
   - Create new app for live environment
   - Note Client ID and Client Secret

#### 3.2 Webhooks Configuration
```bash
# Configure PayPal webhooks endpoint
Webhook URL: https://your-domain.com/.netlify/functions/paypal-webhook
Events: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED
```

### Step 4: Netlify Deployment

#### 4.1 Environment Variables Setup
In Netlify dashboard, set these environment variables:

```bash
# PayPal Production
VITE_PAYPAL_CLIENT_ID=AYour-Production-PayPal-Client-ID
PAYPAL_CLIENT_SECRET=EYour-Production-PayPal-Client-Secret
PAYPAL_ENVIRONMENT=live

# Apple Pay Production
VITE_APPLE_MERCHANT_ID=merchant.hellamaid.com
APPLE_PAY_MERCHANT_CERT=base64-encoded-certificate
APPLE_PAY_MERCHANT_KEY=base64-encoded-private-key

# Google Pay Production
VITE_GOOGLE_MERCHANT_ID=123456789012345
VITE_GOOGLE_GATEWAY_MERCHANT_ID=your-gateway-merchant-id
GOOGLE_PAY_ENVIRONMENT=PRODUCTION

# EmailJS (Optional)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_USER_ID=user_xxxxxxx
```

#### 4.2 Deploy to Netlify
1. **Upload Build**
   - Use the `enhanced-payment-production-v43.zip` file
   - Or connect GitHub repository for automatic deployments

2. **Configure Build Settings**
   ```bash
   Build command: bun run build
   Publish directory: dist
   Functions directory: netlify/functions
   ```

3. **Domain Configuration**
   - Point your domain to Netlify
   - Ensure SSL certificate is active
   - Configure custom domain

### Step 5: Domain Verification

#### 5.1 Apple Pay Domain Verification
1. **Upload Association File**
   - File location: `/.well-known/apple-developer-merchantid-domain-association`
   - Must be accessible via HTTPS
   - No modifications to Apple's file

2. **Verify in Apple Console**
   - Return to Apple Developer Console
   - Verify domain ownership
   - Status should show "Verified"

#### 5.2 SSL Certificate Verification
```bash
# Test SSL configuration
curl -I https://your-domain.com
# Should return 200 OK with valid SSL

# Test Apple Pay domain file
curl https://your-domain.com/.well-known/apple-developer-merchantid-domain-association
# Should return Apple's domain association content
```

### Step 6: Testing Production Environment

#### 6.1 Payment Method Detection Testing
**Test on different devices:**
- [ ] iOS Safari - Should show Apple Pay + PayPal
- [ ] Android Chrome - Should show Google Pay + PayPal
- [ ] Desktop Chrome - Should show Google Pay + PayPal
- [ ] Desktop Safari - Should show Apple Pay + PayPal
- [ ] Firefox - Should show PayPal only

#### 6.2 End-to-End Payment Testing
1. **Apple Pay Testing**
   ```bash
   # Test on real iOS device with Face ID/Touch ID
   - Add test cards to Wallet app
   - Complete payment flow
   - Verify merchant validation works
   ```

2. **Google Pay Testing**
   ```bash
   # Test on Android device or Chrome with saved cards
   - Ensure payment methods are saved in Google Pay
   - Complete payment flow
   - Verify tokenization works
   ```

3. **PayPal Testing**
   ```bash
   # Test with real PayPal account
   - Use production PayPal credentials
   - Test both PayPal balance and card payments
   - Verify order capture works
   ```

### Step 7: Monitoring & Analytics

#### 7.1 Error Monitoring Setup
```javascript
// Add to production build
window.addEventListener('error', (event) => {
  // Log payment errors to your monitoring service
  if (event.message.includes('payment')) {
    console.error('Payment Error:', event);
    // Send to Sentry, LogRocket, etc.
  }
});
```

#### 7.2 Analytics Configuration
```javascript
// Track payment method usage
gtag('event', 'payment_method_selected', {
  'payment_method': 'apple_pay', // or 'google_pay', 'paypal'
  'value': amount
});

// Track payment success/failure
gtag('event', 'purchase', {
  'transaction_id': orderId,
  'value': amount,
  'currency': 'USD'
});
```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### Apple Pay Issues
**Problem**: Apple Pay not showing
- **Check**: Device compatibility (iOS/Safari with Touch ID/Face ID)
- **Check**: Domain verification status in Apple Console
- **Check**: SSL certificate validity
- **Check**: Merchant validation endpoint functionality

**Problem**: Merchant validation fails
- **Check**: Certificate and key files are correctly uploaded
- **Check**: Merchant ID matches in all configurations
- **Check**: Domain association file is accessible

#### Google Pay Issues
**Problem**: Google Pay not loading
- **Check**: Browser compatibility (Chrome with saved payment methods)
- **Check**: Merchant ID configuration
- **Check**: Payment gateway setup
- **Check**: Production environment settings

#### PayPal Issues
**Problem**: PayPal buttons not rendering
- **Check**: Client ID is for production environment
- **Check**: Domain is approved in PayPal console
- **Check**: Network connectivity to PayPal servers

### Emergency Rollback Procedure

#### Quick Rollback Steps
1. **Revert Netlify Deployment**
   ```bash
   # Use Netlify dashboard or CLI
   netlify rollback
   ```

2. **Disable Payment Methods**
   ```bash
   # Set environment variables to disable specific methods
   DISABLE_APPLE_PAY=true
   DISABLE_GOOGLE_PAY=true
   # This forces PayPal-only mode
   ```

3. **Emergency Contact Information**
   - PayPal Support: merchant-technical-support@paypal.com
   - Apple Developer Support: developer.apple.com/contact
   - Google Pay Support: pay.google.com/business/support

## ✅ Success Verification

### Deployment Success Indicators
- [ ] All payment methods show on appropriate devices
- [ ] SSL certificate is valid and enforced
- [ ] Apple Pay domain verification passes
- [ ] Google Pay loads without errors
- [ ] PayPal production payments process successfully
- [ ] Email notifications work (if configured)
- [ ] Error monitoring is active
- [ ] Analytics tracking is working

### Performance Benchmarks
- **Page Load Time**: < 3 seconds
- **Payment SDK Load Time**: < 2 seconds
- **Payment Completion Rate**: > 95%
- **Error Rate**: < 1%

## 📞 Support & Maintenance

### Post-Deployment Tasks
- [ ] Monitor payment success rates for 48 hours
- [ ] Review error logs and analytics
- [ ] Test payment flows on different devices
- [ ] Collect user feedback
- [ ] Update documentation with any issues found

### Regular Maintenance Schedule
- **Weekly**: Check payment success rates and error logs
- **Monthly**: Review payment method performance analytics
- **Quarterly**: Update SDK versions and security patches
- **Annually**: Renew certificates and review configuration

---

**Deployment Package**: `enhanced-payment-production-v43.zip`
**Version**: 43 - Enhanced Payment Methods
**Last Updated**: [Current Date]
**Status**: Ready for Production
