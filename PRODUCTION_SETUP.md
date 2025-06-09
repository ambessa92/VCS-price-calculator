# Production Setup Guide 🚀

## PayPal Production Configuration

### Step 1: Create PayPal Business Account
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal Business account (or create one at [PayPal Business](https://www.paypal.com/us/webapps/mpp/account-selection))
3. Click "Create App" in the developer dashboard

### Step 2: Generate Production API Keys
1. In the PayPal Developer Dashboard:
   - **App Name**: "Hellamaid Cleaning Service"
   - **Merchant**: Select your business account
   - **Features**: Check "Accept payments" and "Advanced Credit and Debit Card Payments"
   - **Environment**: Select **"Live"** for production

2. Copy your Production Credentials:
   - **Client ID**: `AY7xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxZ`
   - **Client Secret**: `EMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxR`

### Step 3: Configure Netlify Environment Variables

In your Netlify site dashboard:
1. Go to **Site Settings** → **Environment Variables**
2. Add these production variables:

```bash
# PayPal Production Settings
VITE_PAYPAL_CLIENT_ID=AY7xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxZ
PAYPAL_CLIENT_SECRET=EMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxR
PAYPAL_ENVIRONMENT=live
PAYPAL_BUSINESS_EMAIL=your-business-email@domain.com

# EmailJS Configuration (see EmailJS setup below)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_USER_ID=xxxxxxxxxxxxxxx

# Apple Pay (Optional - requires Apple Developer Account)
VITE_APPLE_MERCHANT_ID=merchant.hellamaid.com
APPLE_PAY_MERCHANT_CERT_PATH=/opt/build/certs/merchant.cert
APPLE_PAY_MERCHANT_KEY_PATH=/opt/build/certs/merchant.key

# Google Pay (Optional - requires Google Pay Business Console)
VITE_GOOGLE_MERCHANT_ID=your-google-merchant-id
VITE_GOOGLE_GATEWAY_MERCHANT_ID=your-gateway-merchant-id
GOOGLE_PAY_ENVIRONMENT=PRODUCTION
```

## EmailJS Configuration for Booking Confirmations

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. You get 200 free emails per month (upgrade for more)

### Step 2: Add Email Service
1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (most common)
   - **Outlook**
   - **Custom SMTP**

### Step 3: Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Use this template structure:

**Subject**: `🎉 Booking Confirmation - {{booking_number}}`

**Template Content**:
```html
<h2>🎉 Your Cleaning is Confirmed!</h2>

<div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>📋 Booking Details</h3>
  <p><strong>Booking Number:</strong> {{booking_number}}</p>
  <p><strong>Customer:</strong> {{customer_name}}</p>
  <p><strong>Email:</strong> {{customer_email}}</p>
  <p><strong>Phone:</strong> {{customer_phone}}</p>
</div>

<div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>🏠 Service Information</h3>
  <p><strong>Service Date:</strong> {{service_date}}</p>
  <p><strong>Service Time:</strong> {{service_time}}</p>
  <p><strong>Address:</strong> {{service_address}}</p>
  <p><strong>Cleaning Type:</strong> {{cleaning_type}}</p>
  <p><strong>Frequency:</strong> {{frequency}}</p>
</div>

<div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>💰 Payment Information</h3>
  <p><strong>Total Paid:</strong> ${{total_price}}</p>
  <p><strong>Payment Status:</strong> ✅ Confirmed</p>
</div>

{{#special_instructions}}
<div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>📝 Special Instructions</h3>
  <p>{{special_instructions}}</p>
</div>
{{/special_instructions}}

<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>📞 What's Next?</h3>
  <ul>
    <li>We'll call you 24 hours before your appointment to confirm</li>
    <li>Our team will arrive within your selected time window</li>
    <li>All cleaning supplies are provided</li>
    <li>Payment has been processed - no need to have cash ready</li>
  </ul>
</div>

<p>Thank you for choosing our cleaning service! 🧹✨</p>

<hr>
<p style="font-size: 12px; color: #666;">
If you need to make changes to your booking, please reply to this email or call us at (555) 123-4567.
</p>
```

### Step 4: Get EmailJS Credentials
1. In EmailJS Dashboard:
   - **Service ID**: Found in Email Services (e.g., `service_abc123`)
   - **Template ID**: Found in Email Templates (e.g., `template_xyz789`)
   - **User ID**: Found in Account → API Keys (e.g., `user_abc123xyz`)

## Testing the Setup

### Test PayPal Integration
1. Deploy with production keys
2. Try a small test payment ($1.00)
3. Check PayPal dashboard for transaction
4. Verify webhook notifications

### Test EmailJS Integration
1. Complete a booking on your site
2. Check if confirmation email is sent
3. Verify all variables populate correctly
4. Test from different email addresses

## Security Checklist ✅

- [ ] PayPal Client Secret is in server environment variables only (not VITE_)
- [ ] EmailJS User ID is using public key (safe for frontend)
- [ ] Test all payment flows before going live
- [ ] Set up monitoring for failed transactions
- [ ] Enable PayPal webhook notifications for order updates
- [ ] Test email templates with various booking scenarios
- [ ] Set up error logging for production issues

## Go-Live Process

1. **Update Environment Variables** in Netlify
2. **Deploy** with production build
3. **Test Payment Flow** with small amount
4. **Test Email Notifications**
5. **Monitor** for 24 hours
6. **Scale Up** marketing and customer acquisition

## Support & Monitoring

### PayPal
- Dashboard: [PayPal Business Dashboard](https://www.paypal.com/businessmanage/account/)
- Support: [PayPal Business Support](https://www.paypal.com/us/smarthelp/contact-us)

### EmailJS
- Dashboard: [EmailJS Dashboard](https://dashboard.emailjs.com/)
- Docs: [EmailJS Documentation](https://www.emailjs.com/docs/)

### Netlify
- Dashboard: [Netlify Sites](https://app.netlify.com/)
- Functions Logs: Site Dashboard → Functions tab

---

## Quick Setup Commands

```bash
# Update Netlify environment variables (replace with your actual values)
netlify env:set VITE_PAYPAL_CLIENT_ID "your-production-client-id"
netlify env:set PAYPAL_CLIENT_SECRET "your-production-secret"
netlify env:set VITE_EMAILJS_SERVICE_ID "service_xxxxxxx"
netlify env:set VITE_EMAILJS_TEMPLATE_ID "template_xxxxxxx"
netlify env:set VITE_EMAILJS_USER_ID "xxxxxxxxxxxxxxx"

# Redeploy site
netlify deploy --prod
```
