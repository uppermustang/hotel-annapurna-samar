import React, { useEffect, useMemo, useState } from "react";

const OSM_NODE = {
  id: 1902458720,
  name: "Hotel Annapurna",
  lat: 28.9616501,
  lon: 83.8014893,
};
const DEFAULT_COORDS = { lat: OSM_NODE.lat, lon: OSM_NODE.lon };

const Map: React.FC = () => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [loading, setLoading] = useState(true);
  // Using exact OSM node coordinates

  useEffect(() => {
    setCoords({ lat: OSM_NODE.lat, lon: OSM_NODE.lon });
    setLoading(false);
  }, []);

  const bbox = useMemo(() => {
    const padLon = 0.008;
    const padLat = 0.006;
    return {
      left: coords.lon - padLon,
      right: coords.lon + padLon,
      bottom: coords.lat - padLat,
      top: coords.lat + padLat,
    };
  }, [coords]);

  const embedUrl = useMemo(() => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.left}%2C${bbox.bottom}%2C${bbox.right}%2C${bbox.top}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`;
  }, [bbox, coords]);

  const viewUrl = useMemo(() => {
    return `https://www.openstreetmap.org/node/${OSM_NODE.id}`;
  }, []);

  // Optional home-configured title/subtitle
  const [mapTitle, setMapTitle] = useState<string | null>(null);
  const [mapSubtitle, setMapSubtitle] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setMapTitle(data?.map?.title || null);
          setMapSubtitle(data?.map?.subtitle || null);
        }
      } catch {}
    })();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      {/* Full-width map container */}
      <div className="w-full">
        {/* Map header with content */}
        <div className="max-w-6xl mx-auto px-4 mb-8 animate-fadeIn">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-deep-blue mb-3">
              {mapTitle || "Find Us"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {mapSubtitle ||
                "Discover our location in the heart of the Himalayas"}
            </p>
          </div>
        </div>

        {/* Full-width map */}
        <div className="w-full h-[600px] relative bg-gray-100 animate-mapLoad">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-blue mx-auto mb-4"></div>
                <p className="text-lg">Loading map...</p>
              </div>
            </div>
          ) : (
            <iframe
              title="Hotel Annapurna Map"
              width="100%"
              height="100%"
              frameBorder={0}
              scrolling="no"
              src={embedUrl}
              className="w-full h-full"
            />
          )}

          {/* Modern floating location badge */}
          {!loading && (
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-deep-blue px-4 py-3 rounded-xl shadow-lg border border-gray-200 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-vibrant-pink rounded-full animate-pulse"></div>
                <div>
                  <p className="font-semibold text-sm">{OSM_NODE.name}</p>
                  <p className="text-xs text-gray-600">📍 Current Location</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map footer with external link */}
        <div className="max-w-6xl mx-auto px-4 mt-6 animate-fadeIn">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              View larger map on{" "}
              <a
                href={viewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-deep-blue hover:text-vibrant-pink font-medium transition-colors duration-200 underline decoration-2 underline-offset-2 hover:animate-shimmer"
              >
                OpenStreetMap
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
