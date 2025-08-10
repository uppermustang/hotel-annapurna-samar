import React, { useEffect, useState } from "react";

const RoomsManager: React.FC = () => {
  const [homeContent, setHomeContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const DEFAULT_ITEMS = [
    {
      title: "King Bed • Mountain View",
      beds: "1 King",
      view: "Mountain View",
      capacity: 2,
      tags: ["Suitable for children"],
      images: ["/himalayas-bg.jpg"],
    },
    {
      title: "Double Bed • Forest View",
      beds: "1 Double",
      view: "Forest View",
      capacity: 2,
      tags: ["Suitable for infants"],
      images: ["/himalayas-bg.jpg"],
    },
    {
      title: "Two Queens • View of Trees",
      beds: "2 Queen",
      view: "Forest View",
      capacity: 4,
      tags: ["Family favorite"],
      images: ["/himalayas-bg.jpg"],
    },
  ];

  const setWithDefaults = (data: any) => {
    const existingItems = Array.isArray(data?.rooms?.items)
      ? data.rooms.items.map((it: any) => ({
          title: it.title || "",
          beds: it.beds || "",
          view: it.view || "",
          capacity: Number(it.capacity || 2),
          tags: Array.isArray(it.tags) ? it.tags : [],
          images: Array.isArray(it.images) ? it.images : [],
        }))
      : [];
    setHomeContent({
      ...(data || {}),
      rooms: {
        title: data?.rooms?.title || "Our Rooms",
        items: existingItems.length ? existingItems : DEFAULT_ITEMS,
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        // Test if backend is reachable
        console.log("Testing backend connection...");
        const res = await fetch("http://localhost:5000/api/home");
        console.log("Home content response status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("Home content loaded:", data);
          setWithDefaults(data);
        } else {
          console.log("Home content response not ok:", res.status);
          setWithDefaults({});
        }
      } catch (e) {
        console.error("Failed to load home content", e);
        console.error(
          "Error details:",
          e instanceof Error ? e.message : String(e)
        );
        setWithDefaults({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openMediaPicker = async (roomIdx: number) => {
    setPickerIndex(roomIdx);
    setIsPickerOpen(true);
    setMediaLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/media");
      if (res.ok) {
        const items = await res.json();
        console.log("Media items loaded:", items);
        setMediaItems(Array.isArray(items) ? items : []);
      } else {
        console.log("Media response not ok:", res.status);
        setMediaItems([]);
      }
    } catch (e) {
      console.error("Failed to load media library", e);
      setMediaItems([]);
    } finally {
      setMediaLoading(false);
    }
  };

  const normalizePath = (path: string) => {
    if (!path) return "";
    const normalized = path.replace(/\\/g, "/");
    return `http://localhost:5000${
      normalized.startsWith("/") ? normalized : `/${normalized}`
    }`;
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  const saveRooms = async () => {
    setSaving(true);
    try {
      console.log("Saving rooms content:", homeContent);
      const res = await fetch("http://localhost:5000/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeContent || {}),
      });
      console.log("Save response status:", res.status);
      if (res.ok) {
        const saved = await res.json();
        console.log("Rooms content saved:", saved);
        setWithDefaults(saved);
        alert("Rooms content saved!");
      } else {
        const err = await res.json();
        console.error("Save failed:", err);
        alert(err.message || "Failed to save rooms content");
      }
    } catch (e) {
      console.error("Save error:", e);
      alert("Failed to save rooms content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-deep-blue">Rooms Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Rooms Title
          </label>
          <input
            type="text"
            value={homeContent?.rooms?.title || ""}
            onChange={(e) =>
              setHomeContent((prev: any) => ({
                ...prev,
                rooms: { ...(prev?.rooms || {}), title: e.target.value },
              }))
            }
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {(homeContent?.rooms?.items || []).map((it: any, idx: number) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title"
                value={it.title || ""}
                onChange={(e) =>
                  setHomeContent((prev: any) => {
                    const items = [...(prev?.rooms?.items || [])];
                    items[idx] = {
                      ...(items[idx] || {}),
                      title: e.target.value,
                    };
                    return {
                      ...prev,
                      rooms: { ...(prev?.rooms || {}), items },
                    };
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="Beds (e.g., 1 King)"
                value={it.beds || ""}
                onChange={(e) =>
                  setHomeContent((prev: any) => {
                    const items = [...(prev?.rooms?.items || [])];
                    items[idx] = {
                      ...(items[idx] || {}),
                      beds: e.target.value,
                    };
                    return {
                      ...prev,
                      rooms: { ...(prev?.rooms || {}), items },
                    };
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="text"
                placeholder="View (e.g., Mountain View)"
                value={it.view || ""}
                onChange={(e) =>
                  setHomeContent((prev: any) => {
                    const items = [...(prev?.rooms?.items || [])];
                    items[idx] = {
                      ...(items[idx] || {}),
                      view: e.target.value,
                    };
                    return {
                      ...prev,
                      rooms: { ...(prev?.rooms || {}), items },
                    };
                  })
                }
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={it.capacity || 2}
                onChange={(e) =>
                  setHomeContent((prev: any) => {
                    const items = [...(prev?.rooms?.items || [])];
                    items[idx] = {
                      ...(items[idx] || {}),
                      capacity: Number(e.target.value || 2),
                    };
                    return {
                      ...prev,
                      rooms: { ...(prev?.rooms || {}), items },
                    };
                  })
                }
                className="border rounded p-2"
              />
            </div>

            {/* Tags */}
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={(it.tags || []).join(", ")}
                onChange={(e) =>
                  setHomeContent((prev: any) => {
                    const items = [...(prev?.rooms?.items || [])];
                    items[idx] = {
                      ...(items[idx] || {}),
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    };
                    return {
                      ...prev,
                      rooms: { ...(prev?.rooms || {}), items },
                    };
                  })
                }
                className="w-full border rounded p-2"
              />
            </div>

            {/* Images */}
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">
                Main Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={(it.images && it.images[0]) || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => {
                      const items = [...(prev?.rooms?.items || [])];
                      const imgs = [...(items[idx]?.images || [])];
                      imgs[0] = e.target.value;
                      items[idx] = { ...(items[idx] || {}), images: imgs };
                      return {
                        ...prev,
                        rooms: { ...(prev?.rooms || {}), items },
                      };
                    })
                  }
                  className="flex-1 border rounded p-2"
                />
                <button
                  type="button"
                  onClick={() => openMediaPicker(idx)}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                >
                  📚 Choose from Media
                </button>
              </div>
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-red-600"
                onClick={() => {
                  const isConfirmed = window.confirm("Remove this room?");
                  if (!isConfirmed) return;
                  setHomeContent((prev: any) => ({
                    ...prev,
                    rooms: {
                      ...(prev?.rooms || {}),
                      items: (prev?.rooms?.items || []).filter(
                        (_: any, i: number) => i !== idx
                      ),
                    },
                  }));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600"
          onClick={() =>
            setHomeContent((prev: any) => ({
              ...prev,
              rooms: {
                ...(prev?.rooms || {}),
                items: [
                  ...(prev?.rooms?.items || []),
                  {
                    title: "",
                    beds: "",
                    view: "",
                    capacity: 2,
                    tags: [],
                    images: [],
                  },
                ],
              },
            }))
          }
        >
          + Add Room
        </button>
      </div>

      {/* Media Picker Modal */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Image from Media</h3>
              <button
                className="text-gray-600"
                onClick={() => setIsPickerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-auto">
              {mediaLoading ? (
                <div className="py-10 text-center text-gray-500">
                  Loading media…
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No media found. Upload images in Media Gallery tab.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mediaItems
                    .filter(
                      (m) =>
                        typeof m.mimetype === "string" &&
                        m.mimetype.startsWith("image/")
                    )
                    .map((m) => {
                      const src = normalizePath(m.path);
                      return (
                        <button
                          key={m._id || src}
                          type="button"
                          className="border rounded overflow-hidden hover:ring-2 hover:ring-vibrant-pink"
                          onClick={() => {
                            if (pickerIndex == null) return;
                            setHomeContent((prev: any) => {
                              const items = [...(prev?.rooms?.items || [])];
                              const imgs = [
                                ...(items[pickerIndex]?.images || []),
                              ];
                              imgs[0] = m.path; // Store the relative path, not the full URL
                              items[pickerIndex] = {
                                ...(items[pickerIndex] || {}),
                                images: imgs,
                              };
                              return {
                                ...prev,
                                rooms: { ...(prev?.rooms || {}), items },
                              };
                            });
                            setIsPickerOpen(false);
                          }}
                        >
                          <img
                            src={src}
                            alt={m.originalName || ""}
                            className="w-full h-28 object-cover"
                          />
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={saveRooms}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? "Saving…" : "Save Rooms Content"}
        </button>
      </div>
    </div>
  );
};

export default RoomsManager;
