import React, { useEffect, useState } from "react";

const Culinary: React.FC = () => {
  const [title, setTitle] = useState<string | null>(null);
  const [section1Title, setSection1Title] = useState<string | null>(null);
  const [section1Text, setSection1Text] = useState<string | null>(null);
  const [section1Image, setSection1Image] = useState<string | null>(null);
  const [section2Title, setSection2Title] = useState<string | null>(null);
  const [section2Text, setSection2Text] = useState<string | null>(null);
  const [section2Image, setSection2Image] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setTitle(data?.culinary?.title || null);
          setSection1Title(data?.culinary?.section1Title || null);
          setSection1Text(data?.culinary?.section1Text || null);
          setSection2Title(data?.culinary?.section2Title || null);
          setSection2Text(data?.culinary?.section2Text || null);
          setSection1Image(data?.culinary?.section1Image || null);
          setSection2Image(data?.culinary?.section2Image || null);
        }
      } catch {}
    })();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-blue">
          {title || "Culinary Excellence"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-forest-green">
              {section1Title || "Traditional Nepali Cuisine"}
            </h3>
            <p className="text-gray-600 mb-6">
              {section1Text ||
                "Experience authentic flavors of Nepal with our carefully crafted menu featuring traditional dishes made from locally sourced ingredients."}
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Dal Bhat - Traditional lentil curry with rice</li>
              <li>• Momos - Steamed dumplings with various fillings</li>
              <li>• Gundruk - Fermented leafy green vegetables</li>
              <li>• Sel Roti - Traditional ring-shaped bread</li>
            </ul>
          </div>
          <div className="h-64 rounded-lg overflow-hidden">
            {section1Image ? (
              <img
                src={
                  section1Image.startsWith("http")
                    ? section1Image
                    : `http://localhost:5000${section1Image}`
                }
                alt="Culinary section 1"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-warm-red to-vibrant-pink" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
          <div className="h-64 rounded-lg overflow-hidden">
            {section2Image ? (
              <img
                src={
                  section2Image.startsWith("http")
                    ? section2Image
                    : `http://localhost:5000${section2Image}`
                }
                alt="Culinary section 2"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-forest-green to-deep-blue" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-forest-green">
              {section2Title || "International Flavors"}
            </h3>
            <p className="text-gray-600 mb-6">
              {section2Text ||
                "Our international menu offers a variety of cuisines to satisfy every palate, prepared by our experienced chefs."}
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
