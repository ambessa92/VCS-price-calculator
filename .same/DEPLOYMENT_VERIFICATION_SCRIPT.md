# 🔍 Deployment Verification Script

## Quick Verification Commands

### 1. Test Basic Site Functionality
```bash
# Replace YOUR_NETLIFY_URL with your actual Netlify URL
curl -I https://YOUR_NETLIFY_URL.netlify.app

# Expected: 200 OK response with valid SSL
```

### 2. Test Payment Method Detection (Browser Console)
Open your Netlify site and run these commands in browser console:

```javascript
// Check if payment detection is working
console.log('Apple Pay available:', window.ApplePaySession && ApplePaySession.canMakePayments());
console.log('Google Pay available:', !!window.google?.payments);
console.log('PayPal SDK loaded:', !!window.paypal);

// Check environment variables (front-end only)
console.log('PayPal Client ID:', import.meta.env.VITE_PAYPAL_CLIENT_ID);
console.log('Apple Merchant ID:', import.meta.env.VITE_APPLE_MERCHANT_ID);
```

### 3. Test API Endpoints
```bash
# Test PayPal order creation endpoint
curl -X POST https://YOUR_NETLIFY_URL.netlify.app/.netlify/functions/create-paypal-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "email": "test@example.com", "description": "Test order"}'

# Expected: JSON response with order details

# Test Apple Pay validation endpoint (will work in demo mode)
curl -X POST https://YOUR_NETLIFY_URL.netlify.app/.netlify/functions/apple-pay-validate \
  -H "Content-Type: application/json" \
  -d '{"validationURL": "https://test.com", "domainName": "test.com"}'

# Expected: JSON response with merchant session (demo mode)
```

## Visual Verification Checklist

### Homepage Test
- [ ] **Logo loads correctly**
- [ ] **Navigation menu works**
- [ ] **"Get Quote" buttons function**
- [ ] **Footer displays properly**
- [ ] **Mobile responsive design**

### Price Calculator Test
- [ ] **Form fields populate correctly**
- [ ] **Real-time price updates work**
- [ ] **Add-ons calculator functions**
- [ ] **Frequency discounts display**
- [ ] **Animated transitions work**
- [ ] **"Calculate My Price" button works**

### Payment Method Detection Test
Open Developer Tools → Console, then test:

#### On Desktop Chrome:
```javascript
// Should see Google Pay + PayPal options
document.querySelectorAll('[data-payment-method]').forEach(el =>
  console.log('Payment method:', el.textContent)
);
```

#### On Safari (with Touch ID):
```javascript
// Should see Apple Pay + PayPal options
console.log('Apple Pay supported:', ApplePaySession?.canMakePayments());
```

### Quick Calculator Test
- [ ] **Form validation works**
- [ ] **Price calculation accurate**
- [ ] **Payment method selection displays**
- [ ] **Responsive on mobile**

## Environment Variables Verification

### Check in Netlify Dashboard
Go to Site Settings → Environment Variables and verify:

#### Required for Current Functionality:
```bash
NODE_VERSION = "18"
VITE_PAYPAL_CLIENT_ID = "sb" (or your sandbox client ID)
```

#### Required for Production PayPal:
```bash
VITE_PAYPAL_CLIENT_ID = "your-live-paypal-client-id"
PAYPAL_CLIENT_SECRET = "your-live-paypal-secret"
PAYPAL_ENVIRONMENT = "live"
```

#### Required for Apple Pay (when ready):
```bash
VITE_APPLE_MERCHANT_ID = "merchant.yourdomain.com"
APPLE_PAY_MERCHANT_CERT = "base64-encoded-cert"
APPLE_PAY_MERCHANT_KEY = "base64-encoded-key"
```

#### Required for Google Pay (when ready):
```bash
VITE_GOOGLE_MERCHANT_ID = "your-google-merchant-id"
VITE_GOOGLE_GATEWAY_MERCHANT_ID = "your-gateway-merchant-id"
GOOGLE_PAY_ENVIRONMENT = "PRODUCTION"
```

## Common Issues & Solutions

### Issue: PayPal Button Not Loading
**Symptoms:** Empty payment section, console errors about PayPal
**Solution:**
1. Check `VITE_PAYPAL_CLIENT_ID` environment variable
2. Verify PayPal client ID format (starts with "A" for live, "sb" for sandbox)
3. Check network connectivity to paypal.com

### Issue: Apple Pay Not Showing
**Symptoms:** Only PayPal visible on Safari/iOS
**Expected:** This is normal without merchant certificate
**Future Fix:** Add Apple Pay merchant ID to environment variables

### Issue: Google Pay Not Showing
**Symptoms:** Only PayPal visible on Chrome
**Expected:** This is normal without merchant configuration
**Future Fix:** Configure Google Pay merchant account

### Issue: Calculator Not Updating
**Symptoms:** Price doesn't change when selecting options
**Solution:**
1. Check browser console for JavaScript errors
2. Verify form field names match component props
3. Test on different browsers

### Issue: Forms Not Submitting
**Symptoms:** Can't proceed past contact information
**Solution:**
1. Check all required fields are filled
2. Verify email format validation
3. Check phone number format

## Performance Verification

### Page Speed Test
```bash
# Use online tools to test performance
# - Google PageSpeed Insights
# - GTmetrix
# - WebPageTest

# Target metrics:
# - Page load time: <3 seconds
# - First Contentful Paint: <2 seconds
# - Cumulative Layout Shift: <0.1
```

### Mobile Performance Test
```bash
# Test on real devices:
# - iPhone (Safari) - Apple Pay should appear
# - Android (Chrome) - Google Pay should appear
# - Various screen sizes for responsiveness
```

## Security Verification

### SSL Certificate Test
```bash
# Check SSL certificate
openssl s_client -connect YOUR_NETLIFY_URL.netlify.app:443 -servername YOUR_NETLIFY_URL.netlify.app

# Verify:
# - Certificate is valid
# - No mixed content warnings
# - HTTPS enforced
```

### CSP Headers Test
```bash
# Check Content Security Policy
curl -I https://YOUR_NETLIFY_URL.netlify.app | grep -i content-security

# Should allow PayPal, Google Pay, and Apple Pay domains
```

## Next Steps After Verification

### If Everything Works:
1. ✅ **Celebrate!** Your enhanced payment system is live
2. 📊 **Monitor analytics** for user engagement
3. 💳 **Plan production payment setup** when ready
4. 📱 **Test on real mobile devices**

### If Issues Found:
1. 🔧 **Check environment variables** in Netlify
2. 🐛 **Review browser console** for errors
3. 📞 **Use emergency rollback** if critical issues
4. 📝 **Document issues** for resolution

---

**Verification Status**: Pending
**Next Action**: Run verification steps on your live Netlify URL
**Support**: Use this guide to systematically check each component
