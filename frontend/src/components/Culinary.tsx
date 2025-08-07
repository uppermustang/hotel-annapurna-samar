import React from 'react';

const Culinary: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-blue">
          Culinary Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-forest-green">
              Traditional Nepali Cuisine
            </h3>
            <p className="text-gray-600 mb-6">
              Experience authentic flavors of Nepal with our carefully crafted menu 
              featuring traditional dishes made from locally sourced ingredients.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Dal Bhat - Traditional lentil curry with rice</li>
              <li>• Momos - Steamed dumplings with various fillings</li>
              <li>• Gundruk - Fermented leafy green vegetables</li>
              <li>• Sel Roti - Traditional ring-shaped bread</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-warm-red to-vibrant-pink h-64 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
          <div className="bg-gradient-to-br from-forest-green to-deep-blue h-64 rounded-lg"></div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-forest-green">
              International Flavors
            </h3>
            <p className="text-gray-600 mb-6">
              Our international menu offers a variety of cuisines to satisfy 
              every palate, prepared by our experienced chefs.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Continental breakfast buffet</li>
              <li>• Asian fusion dishes</li>
              <li>• Italian pasta and pizza</li>
              <li>• Fresh mountain trout</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Culinary;
