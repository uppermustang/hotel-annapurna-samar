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
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-deep-blue mb-1">
          {mapTitle || "Find Us"}
        </h2>
        <p className="text-gray-600 mb-4">{mapSubtitle || "Hotel Annapurna"}</p>

        <div className="w-full h-[450px] rounded-lg overflow-hidden shadow relative bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Loading map...
            </div>
          ) : (
            <iframe
              title="Hotel Annapurna Map"
              width="100%"
              height="100%"
              frameBorder={0}
              scrolling="no"
              src={embedUrl}
            />
          )}
          {/* Visual label overlay for clarity (moved away from zoom controls) */}
          {!loading && (
            <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded shadow">
              {OSM_NODE.name}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          View larger map on {""}
          <a
            href={viewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenStreetMap
          </a>
          .
        </p>

        {/* Newsletter subscription moved from footer */}
        <div className="mt-8 bg-white border rounded-lg p-4 grid gap-3 md:grid-cols-[1fr_auto] items-center">
          <input
            type="email"
            placeholder="Subscribe to Newsletter"
            className="p-2 w-full bg-white text-gray-800 rounded border-2 border-gray-300 focus:border-vibrant-pink focus:outline-none"
          />
          <button className="bg-vibrant-pink text-white px-4 py-2 rounded">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Map;
