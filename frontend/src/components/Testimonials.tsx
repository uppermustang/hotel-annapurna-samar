import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "USA",
      text: "The most beautiful hotel I've ever stayed at. The views of Annapurna are absolutely breathtaking, and the service was exceptional.",
      rating: 5
    },
    {
      name: "David Chen",
      location: "Singapore",
      text: "Perfect location for trekking. The staff arranged everything for our Annapurna Circuit trek. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Wilson",
      location: "UK",
      text: "The traditional Nepali cuisine was incredible. Every meal was a culinary adventure. Will definitely return!",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-deep-blue text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Guests Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="font-bold">
                {testimonial.name}
              </div>
              <div className="text-sm opacity-75">
                {testimonial.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
