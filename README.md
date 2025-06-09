# 🏠 Hellamaid Price Calculator

A professional cleaning service price calculator and booking system inspired by Hellamaid, featuring real-time price calculations, multi-step booking flow, and secure Stripe payment integration.

![Hellamaid Price Calculator](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Hellamaid+Price+Calculator)

## 🌟 Features

### 💰 Price Calculator
- **Real-time price calculations** based on home size and cleaning type
- **Detailed room-by-room customization** (bedrooms, bathrooms, kitchen, living areas)
- **Multiple cleaning types**: Regular, Deep Clean, Move-in/Move-out
- **Recurring cleaning discounts** (weekly, bi-weekly, monthly)
- **Square footage-based pricing** with customizable room counts

### 📅 Smart Booking System
- **Multi-step booking flow** with progress indicators
- **Interactive calendar** for date selection
- **Time slot availability** with morning/afternoon/evening options
- **Contact information collection** with validation
- **Booking summary** with itemized pricing

### 💳 Secure Payment Processing
- **Stripe Elements integration** for secure card collection
- **Real-time payment processing** with error handling
- **PCI-compliant payment flow** using Stripe's secure infrastructure
- **Payment confirmation** and receipt generation

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Professional color scheme** matching cleaning service branding
- **Smooth animations** and transitions
- **Accessibility-focused** with proper ARIA labels and keyboard navigation

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Payments**: Stripe Elements + Stripe.js
- **Backend**: Netlify Serverless Functions
- **Deployment**: Netlify
- **Package Manager**: Bun
- **Code Quality**: Biome (linting & formatting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Stripe account (for payment processing)
- Netlify account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ambessa92/hellamaid-price-calculator.git
   cd hellamaid-price-calculator
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Stripe Keys (get from https://dashboard.stripe.com/apikeys)
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

4. **Start the development server**
   ```bash
   bun run dev
   # or npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:5173` to see the application running.

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for frontend | `pk_test_51...` |
| `STRIPE_SECRET_KEY` | Stripe secret key for serverless functions | `sk_test_51...` |

### Getting Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers > API Keys**
3. Copy your **Publishable key** and **Secret key**
4. For production, use live keys (starting with `pk_live_` and `sk_live_`)

## 🌐 Deployment

### Netlify Deployment

1. **Fork or clone this repository**

2. **Connect to Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

3. **Configure build settings**
   - Build command: `bun run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Set environment variables**

   In Netlify dashboard > Site settings > Environment variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

5. **Deploy**

   Netlify will automatically build and deploy your site.

### Manual Deployment

```bash
# Build the project
bun run build

# Deploy to Netlify CLI (if installed)
netlify deploy --prod --dir=dist
```

## 📁 Project Structure

```
hellamaid-price-calculator/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Footer.tsx              # Site footer
│   │   ├── Home.tsx                # Landing page
│   │   ├── PriceCalculatorPage.tsx # Main calculator page
│   │   ├── PriceCalculator.tsx     # Price calculation logic
│   │   ├── QuickPriceCalculator.tsx # Simple price calculator
│   │   ├── FullQuoteForm.tsx       # Multi-step booking form
│   │   ├── StripePaymentForm.tsx   # Stripe payment integration
│   │   └── QuotePage.tsx           # Quote display page
│   ├── lib/
│   │   └── stripe.ts               # Stripe configuration
│   ├── assets/
│   │   ├── hellamaid-logo.gif      # Brand logo
│   │   └── cleaner-image.jpeg      # Hero image
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles
├── netlify/
│   └── functions/
│       └── create-payment-intent.js # Stripe payment processing
├── public/
│   └── _redirects                  # Netlify routing
├── netlify.toml                    # Netlify configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🎯 Key Components

### PriceCalculator
Handles all pricing logic including:
- Room count calculations
- Cleaning type multipliers
- Frequency discounts
- Base pricing tiers

### StripePaymentForm
Secure payment processing with:
- Stripe Elements integration
- Real-time validation
- Error handling
- Payment confirmation

### FullQuoteForm
Multi-step booking flow:
1. Service selection
2. Date/time picker
3. Contact information
4. Payment processing
5. Confirmation

## 🔒 Security Features

- **Environment variable protection** - Sensitive keys never exposed to frontend
- **Stripe Elements security** - PCI-compliant payment collection
- **Server-side payment processing** - Secure payment intent creation
- **Input validation** - All form inputs validated and sanitized

## 🧪 Testing

### Local Testing

```bash
# Run linting
bun run lint

# Type checking
bun run type-check

# Build test
bun run build
```

### Stripe Testing

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future date for expiry and any 3-digit CVC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [View on Netlify](https://hellamaid-price-calculator.netlify.app)
- **Repository**: [GitHub](https://github.com/ambessa92/hellamaid-price-calculator)
- **Stripe Documentation**: [Stripe Docs](https://stripe.com/docs)
- **Netlify Functions**: [Netlify Docs](https://docs.netlify.com/functions/overview/)

## 💡 Inspiration

This project was inspired by [Hellamaid](https://hellamaid.com), a professional cleaning service. The goal was to create a modern, user-friendly price calculator that provides instant quotes and seamless booking experience.

---

**Built with ❤️ using React, TypeScript, and PayPal**

## 🎉 New Payment System Features
- 💳 PayPal Integration with user-controlled Client ID
- 🎭 Demo Payment Mode for testing
- 📝 Manual Payment with contact information

*Updated: January 2025*
