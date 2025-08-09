import React, { useEffect, useState } from "react";

const RoomsManager: React.FC = () => {
  const [homeContent, setHomeContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        const res = await fetch("/api/home");
        if (res.ok) {
          const data = await res.json();
          setWithDefaults(data);
        } else {
          setWithDefaults({});
        }
      } catch (e) {
        console.error("Failed to load home content", e);
        setWithDefaults({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  const saveRooms = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeContent || {}),
      });
      if (res.ok) {
        const saved = await res.json();
        setWithDefaults(saved);
        alert("Rooms content saved!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save rooms content");
      }
    } catch {
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
                Main Image URL
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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`rooms-image-upload-${idx}`}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("files", file);
                    try {
                      const resp = await fetch("/api/media/upload", {
                        method: "POST",
                        body: formData,
                      });
                      const data = await resp.json();
                      if (resp.ok && data && data[0]) {
                        const url = data[0].path?.startsWith("/")
                          ? data[0].path
                          : `/${data[0].path}`;
                        setHomeContent((prev: any) => {
                          const items = [...(prev?.rooms?.items || [])];
                          const imgs = [...(items[idx]?.images || [])];
                          imgs[0] = url;
                          items[idx] = { ...(items[idx] || {}), images: imgs };
                          return {
                            ...prev,
                            rooms: { ...(prev?.rooms || {}), items },
                          };
                        });
                        alert("Image uploaded successfully!");
                      } else {
                        alert("Failed to upload image");
                      }
                    } catch {
                      alert("Error uploading image");
                    }
                  }}
                />
                <label
                  htmlFor={`rooms-image-upload-${idx}`}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                >
                  📁 Upload
                </label>
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
