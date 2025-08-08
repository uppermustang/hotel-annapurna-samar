import React, { useEffect, useState } from "react";

const TrustBadges: React.FC = () => {
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [brands, setBrands] = useState<Array<{ name?: string; logo?: string }>>(
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setSubtitle(data?.trustBadges?.subtitle || null);
          setBrands(
            Array.isArray(data?.trustBadges?.brands)
              ? data.trustBadges.brands
              : []
          );
        }
      } catch {}
    })();
  }, []);

  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        {brands.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {brands.map((b, i) => (
              <div key={i} className="text-center">
                {b.logo ? (
                  <img
                    src={
                      b.logo.startsWith("http")
                        ? b.logo
                        : `http://localhost:5000${b.logo}`
                    }
                    alt={b.name || `brand-${i}`}
                    className="h-12 w-auto mx-auto object-contain"
                  />
                ) : (
                  <div className="h-12 w-24 mx-auto bg-gray-200 rounded" />
                )}
                {b.name && (
                  <p className="text-xs text-gray-600 mt-1">{b.name}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {subtitle || "Trusted by 2,500+ guests from around the world"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
