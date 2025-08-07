import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What's included in the 25% discount offer?",
      answer:
        "The 25% discount applies to your room rate for new bookings. It includes complimentary breakfast, free WiFi, and free airport transfer (within 50km). Additional services like spa treatments and guided tours are available at special rates.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "We offer free cancellation up to 48 hours before your check-in date. For bookings made with our special offers, free cancellation is available up to 24 hours before arrival. No penalties, full refund guaranteed.",
    },
    {
      question: "Do you provide airport transfer?",
      answer:
        "Yes! We provide complimentary airport transfer for all guests staying 2+ nights. For shorter stays, airport transfer is available at a nominal fee. Our drivers are English-speaking and can assist with your luggage and local recommendations.",
    },
    {
      question: "What activities and experiences do you offer?",
      answer:
        "We offer a wide range of activities including guided Himalayan treks, cultural village tours, white water rafting, paragliding, yoga sessions, spa treatments, and photography expeditions. All activities can be arranged through our concierge service.",
    },
    {
      question: "Is the hotel suitable for families with children?",
      answer:
        "Absolutely! We're family-friendly with connecting rooms, children's play areas, kid-friendly menu options, and baby cot rentals. Our staff can also arrange family-suitable activities and provide childcare recommendations.",
    },
    {
      question: "What safety measures do you have in place?",
      answer:
        "Your safety is our priority. We have 24/7 security, CCTV surveillance, fire safety systems, first aid facilities, and trained staff. For trekking activities, we provide experienced guides and safety equipment.",
    },
    {
      question: "Do you offer vegetarian and special dietary options?",
      answer:
        "Yes! Our restaurant offers extensive vegetarian, vegan, gluten-free, and other dietary options. We can accommodate most dietary restrictions with advance notice. Our chefs are experienced in preparing authentic Nepali vegetarian cuisine.",
    },
    {
      question: "What's the best time to visit?",
      answer:
        "The best time to visit is October-November and March-May for clear mountain views and pleasant weather. However, we're open year-round and each season offers unique experiences - from rhododendron blooms in spring to festive celebrations in winter.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-blue mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers! Here are the most common questions
            our guests ask.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-vibrant-pink focus:ring-opacity-50 rounded-lg"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </h3>
                  <div
                    className={`transform transition-transform duration-200 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-vibrant-pink"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-deep-blue mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our friendly team is here to help you 24/7. Get in touch and we'll
              respond within minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-vibrant-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-warm-red transition-colors">
                📞 Call: +977-123-456-789
              </button>
              <button className="bg-forest-green text-white font-bold py-3 px-6 rounded-lg hover:bg-deep-blue transition-colors">
                💬 Live Chat Support
              </button>
              <button className="bg-warm-red text-white font-bold py-3 px-6 rounded-lg hover:bg-vibrant-pink transition-colors">
                📧 Email: info@hotelannapurna.com
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
