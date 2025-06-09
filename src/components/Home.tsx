import { GetPriceForm } from './GetPriceForm';
import cleanerImage from '../assets/cleaner-image.jpeg';

export function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <section className="bg-background py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 font-montserrat">
                Canada's Best Cleaning Service
              </h1>
              <p className="text-lg mb-8 text-gray-700">
                Book a quality cleaning service that values customer happiness more than anything.
                With our company, both you and your property are in good hands!
              </p>

              <GetPriceForm />
            </div>

            <div className="md:w-1/2">
              <img
                src={cleanerImage}
                alt="Professional Cleaner"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-montserrat">
              Our Home Cleaning Service Options
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 font-montserrat">1. Cleaning Package</h3>
                <p className="mb-4">
                  <strong>Best for:</strong> Full-home cleanings or detailed service. This option is designed for those who want a
                  <strong> comprehensive cleaning</strong> with clear expectations. Our team follows a standardized
                  checklist tailored to your selection: <strong>Standard, Deep, or Move-In/Out Cleaning</strong>.
                  Pricing is fixed, and you can easily add extras like inside oven & fridge cleaning.
                </p>
                <button className="bg-primary text-text px-4 py-2 rounded font-medium hover:bg-primary-dark transition duration-300">
                  Customize your Cleaning Package
                </button>
              </div>

              <div className="bg-background p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 font-montserrat">2. Hourly Cleaning</h3>
                <p className="mb-4">
                  <strong>Best for:</strong> Partial cleanings or targeted areas. This service is based on the duration you book
                  (minimum 3 hours). It's suitable for <strong>light tidying</strong>, <strong>specific rooms</strong>,
                  or situations where a full checklist isn't required. Our team will prioritize the areas or tasks
                  you request within the booked timeframe, using your custom instructions as a guide.
                </p>
                <button className="bg-primary text-text px-4 py-2 rounded font-medium hover:bg-primary-dark transition duration-300">
                  Customize your Hourly Cleaning
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
