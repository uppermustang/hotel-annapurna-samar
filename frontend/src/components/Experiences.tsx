import React, { useEffect, useState, useCallback } from "react";

type ExperienceItem = { title: string; description: string; image?: string };

const MAX_PREVIEW_CHARS = 150;

const Experiences: React.FC = () => {
  const [title, setTitle] = useState<string | null>(null);
  const [items, setItems] = useState<ExperienceItem[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<ExperienceItem | null>(null);

  const openModal = (item: ExperienceItem) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalItem(null);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modalOpen, closeModal]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setTitle(data?.experiences?.title || null);
          const incoming: ExperienceItem[] = Array.isArray(
            data?.experiences?.items
          )
            ? data.experiences.items
            : [];
          setItems(incoming);
        }
      } catch {}
    })();
  }, []);

  const fallbackItems: ExperienceItem[] = [
    {
      title: "Mountain Trekking",
      description:
        "Guided treks through the beautiful Annapurna region with breathtaking views and cultural encounters.",
      image: "",
    },
    {
      title: "Cultural Tours",
      description:
        "Explore local villages, monasteries, and experience the rich cultural heritage of the Himalayas.",
      image: "",
    },
    {
      title: "Spa & Wellness",
      description:
        "Rejuvenate your body and mind with traditional healing therapies and modern wellness treatments.",
      image: "",
    },
    {
      title: "Adventure Sports",
      description:
        "Paragliding, white water rafting, and other thrilling activities for adventure enthusiasts.",
      image: "",
    },
    {
      title: "Photography Tours",
      description:
        "Capture stunning landscapes and wildlife with our expert photography guides.",
      image: "",
    },
    {
      title: "Yoga & Meditation",
      description:
        "Find inner peace with our yoga sessions and meditation retreats in serene mountain settings.",
      image: "",
    },
  ];

  const list: ExperienceItem[] = items.length > 0 ? items : fallbackItems;

  const getPreview = (desc: string) => {
    if (desc.length <= MAX_PREVIEW_CHARS) return desc;
    return desc.slice(0, MAX_PREVIEW_CHARS) + "…";
  };

  return (
    <section id="experiences" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-blue">
          {title || "Unique Experiences"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((it, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden shadow-lg group h-64 bg-gray-200"
            >
              {it.image ? (
                <img
                  src={
                    it.image.startsWith("http")
                      ? it.image
                      : `http://localhost:5000${it.image}`
                  }
                  alt={it.title}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105 group-hover:translate-y-1"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-forest-green" />
              )}

              {/* subtle gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              {/* transparent text overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-xl font-bold mb-2 text-white text-shadow">
                  {it.title}
                </h3>
                <p className="text-gray-200 text-sm leading-snug">
                  {getPreview(it.description)}
                  {it.description.length > MAX_PREVIEW_CHARS && (
                    <button
                      onClick={() => openModal(it)}
                      className="ml-1 underline text-gray-100 hover:text-white"
                    >
                      Read more
                    </button>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-deep-blue">
                {modalItem.title}
              </h3>
              <button
                aria-label="Close"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-5 overflow-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {modalItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experiences;
