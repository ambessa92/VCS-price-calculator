# EmailJS Template Setup Guide 📧

## EmailJS Template Configuration

### Template Name: `cleaning_booking_confirmation`

### Email Subject:
```
🎉 Booking Confirmed - {{booking_number}}
```

### Email Template (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .warning { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .success { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #6b7280; }
        h1, h2, h3 { margin-top: 0; }
        .booking-number { font-size: 24px; font-weight: bold; color: #059669; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; width: 150px; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Your Cleaning is Confirmed!</h1>
        <p class="booking-number">Booking #{{booking_number}}</p>
        <p>{{booking_date}}</p>
    </div>

    <div class="content">
        <div class="highlight">
            <h3>📋 Booking Summary</h3>
            <table>
                <tr><td class="label">Customer:</td><td>{{customer_name}}</td></tr>
                <tr><td class="label">Email:</td><td>{{customer_email}}</td></tr>
                <tr><td class="label">Phone:</td><td>{{customer_phone}}</td></tr>
                <tr><td class="label">Booking Number:</td><td><strong>{{booking_number}}</strong></td></tr>
            </table>
        </div>

        <div class="section">
            <h3>🏠 Service Details</h3>
            <table>
                <tr><td class="label">Property:</td><td>{{home_details}}</td></tr>
                <tr><td class="label">Service Date:</td><td><strong>{{service_date}}</strong></td></tr>
                <tr><td class="label">Service Time:</td><td><strong>{{service_time}}</strong></td></tr>
                <tr><td class="label">Address:</td><td>{{service_address}}</td></tr>
                <tr><td class="label">Cleaning Type:</td><td>{{cleaning_type}}</td></tr>
                <tr><td class="label">Frequency:</td><td>{{frequency}}</td></tr>
            </table>
        </div>

        <div class="success">
            <h3>💰 Payment Information</h3>
            <table>
                <tr><td class="label">First Cleaning:</td><td><strong>${{total_price}}</strong></td></tr>
                {{#recurring_price}}
                <tr><td class="label">Recurring Price:</td><td><strong>${{recurring_price}}</strong></td></tr>
                <tr><td class="label">You Save Each Time:</td><td><strong>${{savings_per_cleaning}}</strong></td></tr>
                {{/recurring_price}}
                <tr><td class="label">Payment Status:</td><td><span style="color: #059669;">✅ Paid & Confirmed</span></td></tr>
            </table>
        </div>

        {{#special_instructions}}
        <div class="warning">
            <h3>📝 Special Instructions</h3>
            <p>{{special_instructions}}</p>
        </div>
        {{/special_instructions}}

        <div class="section">
            <h3>📞 What Happens Next?</h3>
            <ul>
                <li><strong>24 Hours Before:</strong> We'll call to confirm your appointment</li>
                <li><strong>Day of Service:</strong> Our team arrives within your time window</li>
                <li><strong>All Supplies Included:</strong> We bring everything needed</li>
                <li><strong>No Cash Needed:</strong> Payment already processed</li>
                <li><strong>Quality Guarantee:</strong> 100% satisfaction or we'll make it right</li>
            </ul>
        </div>

        <div class="highlight">
            <h3>📱 Contact & Support</h3>
            <p><strong>Need to make changes?</strong> Reply to this email or call us at <strong>(555) 123-4567</strong></p>
            <p><strong>Questions?</strong> We're here to help Monday-Saturday, 8 AM - 6 PM</p>
            <p><strong>Emergency contact:</strong> Text us at <strong>(555) 123-4567</strong></p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:{{customer_email}}?subject=Booking%20{{booking_number}}%20Question" class="cta-button">
                📧 Contact Us About This Booking
            </a>
        </div>

        <div class="success">
            <h3>🌟 Thank You!</h3>
            <p>We're excited to make your home sparkle! Our professional cleaning team is looking forward to serving you.</p>
            <p><em>- The Cleaning Team</em></p>
        </div>
    </div>

    <div class="footer">
        <p>This is an automated confirmation for booking #{{booking_number}}</p>
        <p>Generated on {{booking_date}}</p>
        <p>© 2024 Hellamaid Cleaning Service | Professional Home Cleaning</p>
        <p style="margin-top: 15px; font-size: 10px;">
            <strong>Important:</strong> Please save this email for your records. This serves as your receipt and booking confirmation.
        </p>
    </div>
</body>
</html>
```

## Template Variables Reference

The following variables are automatically populated from your booking form:

### Customer Information
- `{{customer_name}}` - Full customer name
- `{{customer_email}}` - Customer email address
- `{{customer_phone}}` - Customer phone number

### Booking Details
- `{{booking_number}}` - Unique booking reference (e.g., BK1234567890)
- `{{booking_date}}` - Date and time when booking was made
- `{{service_date}}` - Scheduled cleaning date (formatted nicely)
- `{{service_time}}` - Scheduled time slot
- `{{service_address}}` - Complete service address

### Service Information
- `{{cleaning_type}}` - Type of cleaning (Standard, Deep, etc.)
- `{{frequency}}` - Service frequency (One-time, Weekly, etc.)
- `{{home_details}}` - Property details (size, bedrooms, bathrooms)
- `{{special_instructions}}` - Add-on services selected

### Pricing Information
- `{{total_price}}` - First cleaning total price
- `{{recurring_price}}` - Price for recurring cleanings (if applicable)
- `{{savings_per_cleaning}}` - Amount saved per recurring cleaning

## EmailJS Template Setup Steps

1. **Log into EmailJS Dashboard**
   - Go to [EmailJS Templates](https://dashboard.emailjs.com/admin/templates)

2. **Create New Template**
   - Click "Create New Template"
   - Template ID: `template_cleaning_booking`

3. **Configure Template**
   - **Subject**: `🎉 Booking Confirmed - {{booking_number}}`
   - **Content**: Paste the HTML template above

4. **Test Template**
   - Use the "Test" feature in EmailJS
   - Send a test email to yourself

5. **Get Template ID**
   - Copy the Template ID (e.g., `template_abc123xyz`)
   - Add to your Netlify environment variables as `VITE_EMAILJS_TEMPLATE_ID`

## Environment Variables Needed

Add these to your Netlify environment variables:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_USER_ID=xxxxxxxxxxxxxxx
```

## Testing Checklist

- [ ] Test with different cleaning types
- [ ] Test one-time vs recurring bookings
- [ ] Test with and without add-on services
- [ ] Test email delivery to different providers (Gmail, Yahoo, etc.)
- [ ] Check spam folders
- [ ] Verify all variables populate correctly
- [ ] Test mobile email display

## Troubleshooting

### Email not sending?
1. Check browser console for errors
2. Verify all environment variables are set
3. Check EmailJS dashboard for API usage/limits
4. Test with a simple template first

### Variables not populating?
1. Check variable names match exactly (case-sensitive)
2. Test with EmailJS template tester
3. Check browser network tab for API calls

### Email in spam?
1. Ask customers to whitelist your domain
2. Use a professional email address for EmailJS service
3. Avoid excessive emojis in subject line for production

---

**🎯 Pro Tip**: Test your email template thoroughly with different booking scenarios before going live!
