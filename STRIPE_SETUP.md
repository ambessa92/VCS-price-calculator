# 🔑 Stripe Payment Setup Guide

This guide will help you configure **real Stripe payments** for your cleaning service booking system.

## 📋 Prerequisites

1. **Business Information**: Legal business name, address, tax ID
2. **Bank Account**: Business bank account for receiving payments
3. **Identity Verification**: Government-issued ID for verification

## 🚀 Step-by-Step Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Verify your email address
4. Complete business verification process

### 2. Get Your API Keys
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Local Environment
Update your `.env` file:
```bash
# Replace with your actual Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 4. Configure Netlify Environment Variables
1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

### 5. Test Your Setup
1. Deploy your site
2. Go through the booking flow
3. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **More test cards**: [Stripe Testing Guide](https://stripe.com/docs/testing)

### 6. Go Live (Production)
1. Complete Stripe account verification
2. Replace test keys with live keys (`pk_live_` and `sk_live_`)
3. Test with real cards (small amounts)
4. Monitor payments in Stripe Dashboard

## 🔒 Security Best Practices

- ✅ **Never commit secret keys** to version control
- ✅ **Use environment variables** for all API keys
- ✅ **Test thoroughly** before going live
- ✅ **Monitor transactions** regularly
- ✅ **Set up webhooks** for payment confirmations

## 💰 Pricing & Fees

**Stripe Fees (as of 2024):**
- **2.9% + 30¢** per successful transaction
- **No monthly fees** or setup costs
- **No hidden fees** or minimum requirements

## 📞 Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available 24/7 through dashboard
- **Testing Guide**: [stripe.com/docs/testing](https://stripe.com/docs/testing)

## ⚠️ Important Notes

1. **Start with Test Mode**: Always test thoroughly before going live
2. **Verify Business**: Complete business verification to avoid account holds
3. **Understand Fees**: Factor Stripe fees into your pricing
4. **Monitor Disputes**: Set up notifications for chargebacks
5. **Backup Payment Method**: Consider adding PayPal as alternative

---

**🎉 Once configured, your cleaning service will accept real payments from customers worldwide!**
