import { FullQuoteForm } from './FullQuoteForm';

export function QuotePage() {
  return (
    <div className="min-h-screen">
      <main>
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 font-montserrat">
              View Pricing, Availability, and Book your Cleaning Below
            </h1>

            <FullQuoteForm />
          </div>
        </section>
      </main>
    </div>
  );
}
