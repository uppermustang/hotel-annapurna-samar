import React from "react";

const Experiences: React.FC = () => {
  return (
    <section id="experiences" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-blue">
          Unique Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-deep-blue to-forest-green"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Mountain Trekking</h3>
              <p className="text-gray-600">
                Guided treks through the beautiful Annapurna region with
                breathtaking views and cultural encounters.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-forest-green to-warm-red"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Cultural Tours</h3>
              <p className="text-gray-600">
                Explore local villages, monasteries, and experience the rich
                cultural heritage of the Himalayas.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-warm-red to-vibrant-pink"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Spa & Wellness</h3>
              <p className="text-gray-600">
                Rejuvenate your body and mind with traditional healing therapies
                and modern wellness treatments.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-vibrant-pink to-deep-blue"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Adventure Sports</h3>
              <p className="text-gray-600">
                Paragliding, white water rafting, and other thrilling activities
                for adventure enthusiasts.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-deep-blue to-warm-red"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Photography Tours</h3>
              <p className="text-gray-600">
                Capture stunning landscapes and wildlife with our expert
                photography guides.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-forest-green to-vibrant-pink"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3">Yoga & Meditation</h3>
              <p className="text-gray-600">
                Find inner peace with our yoga sessions and meditation retreats
                in serene mountain settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
