import React, { useState, useEffect } from "react";
import {
  FaImage,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

interface HeroContent {
  title: string;
  subtitle: string;
  mainDescription: string;
  tagline: string;
  callToAction: string;
  backgroundImage: string;
  benefits: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
}

interface SiteConfig {
  branding: {
    logo: string;
    textLogo: string;
    favicon: string;
    showLogo: boolean;
    showTextLogo: boolean;
    logoMaxHeight?: number;
    logoMaxWidth?: number;
  };
  navigation: {
    items: Array<{
      id: string;
      text: string;
      url: string;
      order: number;
      isActive: boolean;
    }>;
  };
}

// Defaults for Subscribe editor so fields are populated even if DB document lacks the section
const DEFAULT_SUBSCRIBE = {
  title: "Stay Connected",
  subtitle:
    "Get exclusive updates about our seasonal experiences, special offers, and the latest from the heart of the Himalayas delivered straight to your inbox.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  disclaimer: "🔒 We respect your privacy. Unsubscribe at any time.",
  theme: "light",
  benefits: [
    {
      icon: "📧",
      title: "Weekly Updates",
      description: "Stay informed about our latest offerings",
    },
    {
      icon: "🎁",
      title: "Exclusive Offers",
      description: "Special deals for our subscribers only",
    },
    {
      icon: "🏔️",
      title: "Mountain Stories",
      description: "Behind-the-scenes from the Himalayas",
    },
  ],
};

// Defaults for Unique Experiences (6 items)
const DEFAULT_EXPERIENCES = {
  title: "Unique Experiences",
  items: [
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
  ],
};

const HeroSectionManager: React.FC = () => {
  const [content, setContent] = useState<HeroContent>({
    title: "A Mountain Haven",
    subtitle: "",
    mainDescription:
      "Towering trees, a serene creek flowing through the heart of our lodge, cascading waterfalls, tranquil seclusion, and breathtaking mountain views exceeding 22,000 feet. The first and oldest lodge in the village, offering great local food and other varieties, with warm hospitality.",
    tagline: "⭐ Intimate Lodge • Authentic Experience • Stunning Views",
    callToAction:
      "Join us for an unforgettable stay in one of our carefully curated rooms",
    backgroundImage: "/himalayas-bg.jpg",
    benefits: [
      {
        id: "views",
        icon: "🏔️",
        title: "22,000+ ft Views",
        description:
          "Breathtaking mountain views exceeding 22,000 feet in elevation",
      },
      {
        id: "nature",
        icon: "🌿",
        title: "Natural Paradise",
        description: "Towering trees, serene creek, and cascading waterfalls",
      },
      {
        id: "cuisine",
        icon: "🍽️",
        title: "Local Cuisine",
        description:
          "Great local food and other varieties with warm hospitality",
      },
    ],
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>("");
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [homeContent, setHomeContent] = useState<any>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState<
    "heroBackground" | "backgroundImage" | "poster" | null
  >(null);
  const [libraryItems, setLibraryItems] = useState<
    {
      _id: string;
      filename: string;
      path: string;
      originalName: string;
      mimetype?: string;
    }[]
  >([]);

  // Site Configuration State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    branding: {
      logo: "/himalayas-bg.jpg",
      textLogo: "🏔️ Hotel Annapurna Samar",
      favicon: "/favicon.ico",
      showLogo: true,
      showTextLogo: true,
      logoMaxHeight: 40,
      logoMaxWidth: 100,
    },
    navigation: {
      items: [
        { id: "home", text: "Home", url: "/", order: 1, isActive: true },
        {
          id: "history",
          text: "History",
          url: "/history",
          order: 2,
          isActive: true,
        },
        { id: "blog", text: "Blog", url: "/blog", order: 3, isActive: true },
        { id: "rooms", text: "Rooms", url: "/rooms", order: 4, isActive: true },
        { id: "admin", text: "Admin", url: "/admin", order: 5, isActive: true },
      ],
    },
  });
  const [editingNavItem, setEditingNavItem] = useState<string | null>(null);
  const [tempNavItem, setTempNavItem] = useState<{
    text: string;
    url: string;
    order: number;
  }>({ text: "", url: "", order: 1 });

  // Load saved content when component mounts
  useEffect(() => {
    const loadSavedContent = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hero");
        if (response.ok) {
          const savedContent = await response.json();
          if (savedContent && Object.keys(savedContent).length > 0) {
            // Remove MongoDB specific fields
            const { _id, __v, updatedAt, ...cleanContent } = savedContent;
            setContent(cleanContent);
          }
        }
      } catch (error) {
        console.error("Error loading saved content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedContent();

    // Load site configuration
    (async () => {
      try {
        const configResponse = await fetch(
          "http://localhost:5000/api/site-config"
        );
        if (configResponse.ok) {
          const configData = await configResponse.json();
          if (configData && Object.keys(configData).length > 0) {
            setSiteConfig(configData);
          }
        }
      } catch (error) {
        console.log("Using default site configuration");
      }
    })();

    // Load home content
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          // Merge defaults so editors show meaningful values
          const incomingItems = Array.isArray(data?.experiences?.items)
            ? data.experiences.items
            : [];
          const merged = {
            ...data,
            subscribe: { ...DEFAULT_SUBSCRIBE, ...(data?.subscribe || {}) },
            experiences: {
              ...DEFAULT_EXPERIENCES,
              ...(data?.experiences || {}),
              items:
                incomingItems.length > 0
                  ? incomingItems
                  : DEFAULT_EXPERIENCES.items,
            },
          };
          setHomeContent(merged);
        }
      } catch (e) {
        console.error("Error loading home content:", e);
        // If fetch fails, still initialize editor defaults
        setHomeContent((prev: any) => ({
          ...(prev || {}),
          subscribe: DEFAULT_SUBSCRIBE,
          experiences: DEFAULT_EXPERIENCES,
        }));
      }
    })();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Starting image upload for file:", file.name);

    // Create FormData for image upload
    const formData = new FormData();
    formData.append("files", file);

    try {
      // First, ensure the uploads directory exists
      const response = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload response status:", response.status);

      const data = await response.json();
      console.log("Upload response data:", data);

      if (response.ok && data && data[0]) {
        // Always use the full URL for images
        const imageUrl = `http://localhost:5000/uploads/${data[0].filename}`;
        console.log("Setting new image URL:", imageUrl);

        setContent((prev) => {
          console.log("Updating content with new image URL");
          return { ...prev, backgroundImage: imageUrl };
        });

        // Force a re-render of the image
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          console.log("New image loaded successfully");
          alert("Image uploaded successfully!");
        };
        img.onerror = () => {
          console.error("Failed to load uploaded image");
          alert("Image uploaded but failed to load. Please try again.");
        };
      } else {
        console.error("Upload failed:", data?.message || "Unknown error");
        alert(`Failed to upload image: ${data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        "Error uploading image. Please check if the backend server is running and try again."
      );
    }
  };

  const openLibrary = async (
    target: "heroBackground" | "backgroundImage" | "poster" = "backgroundImage"
  ) => {
    try {
      const res = await fetch("http://localhost:5000/api/media");
      if (res.ok) {
        const data = await res.json();
        setLibraryItems(data);
        setLibraryTarget(target);
        setLibraryOpen(true);
      }
    } catch (e) {
      console.error("Failed to load media library", e);
    }
  };

  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setTempContent(value);
  };

  const saveEdit = () => {
    if (!editingField) return;

    setContent((prev) => ({
      ...prev,
      [editingField]: tempContent,
    }));
    setEditingField(null);
    setTempContent("");
  };

  const editBenefit = (benefitId: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit) =>
        benefit.id === benefitId ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  // Navigation Management Functions
  const startEditingNavItem = (itemId: string) => {
    const item = siteConfig.navigation.items.find((nav) => nav.id === itemId);
    if (item) {
      setEditingNavItem(itemId);
      setTempNavItem({
        text: item.text,
        url: item.url,
        order: item.order,
      });
    }
  };

  const saveNavItemEdit = () => {
    if (!editingNavItem) return;

    setSiteConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.map((item) =>
          item.id === editingNavItem ? { ...item, ...tempNavItem } : item
        ),
      },
    }));
    setEditingNavItem(null);
    setTempNavItem({ text: "", url: "", order: 1 });
  };

  const toggleNavItemVisibility = (itemId: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.map((item) =>
          item.id === itemId ? { ...item, isActive: !item.isActive } : item
        ),
      },
    }));
  };

  const addNavItem = () => {
    const newId = `nav-${Date.now()}`;
    const newItem = {
      id: newId,
      text: "New Menu Item",
      url: "/new-page",
      order: siteConfig.navigation.items.length + 1,
      isActive: true,
    };

    setSiteConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: [...prev.navigation.items, newItem],
      },
    }));
  };

  const removeNavItem = (itemId: string) => {
    if (itemId === "home") {
      alert("Cannot remove Home menu item");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to remove this menu item?"
    );
    if (!isConfirmed) return;

    setSiteConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.filter((item) => item.id !== itemId),
      },
    }));
  };

  const reorderNavItem = (itemId: string, direction: "up" | "down") => {
    const currentIndex = siteConfig.navigation.items.findIndex(
      (item) => item.id === itemId
    );
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= siteConfig.navigation.items.length) return;

    const newItems = [...siteConfig.navigation.items];
    [newItems[currentIndex], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[currentIndex],
    ];

    // Update order numbers
    newItems.forEach((item, index) => {
      item.order = index + 1;
    });

    setSiteConfig((prev) => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: newItems,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-form">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-deep-blue">
          Hero Section Manager
        </h2>

        {/* Site Branding & Navigation Management */}
        <div className="mb-8 admin-section">
          <h3 className="text-lg font-semibold mb-4 text-deep-blue">
            Site Branding & Navigation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            💡 <strong>Logo Display Options:</strong> You can choose to show
            only the image logo, only the text logo, or both together. Use the
            checkboxes below each section to control what appears in the header.
          </p>

          {/* Branding Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Logo */}
            <div>
              <label className="admin-label">Logo Image</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={siteConfig.branding.logo}
                  onChange={(e) =>
                    setSiteConfig((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, logo: e.target.value },
                    }))
                  }
                  className="w-full"
                  placeholder="/uploads/logo.png"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("files", file);
                    try {
                      const resp = await fetch(
                        "http://localhost:5000/api/media/upload",
                        { method: "POST", body: formData }
                      );
                      const data = await resp.json();
                      if (resp.ok && data && data[0]) {
                        // Use the path directly as it should already be a full URL or relative path
                        const url = data[0].path;
                        console.log("Logo upload response:", data[0]);
                        console.log("Setting logo URL:", url);
                        setSiteConfig((prev) => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            logo: url,
                            showLogo: true, // Automatically enable logo display when uploaded
                          },
                        }));
                        alert(
                          "Logo uploaded successfully! Logo display has been automatically enabled."
                        );
                      } else {
                        alert("Failed to upload logo");
                      }
                    } catch (err) {
                      alert("Error uploading logo");
                    }
                  }}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm block text-center"
                >
                  📁 Upload Logo
                </label>

                {/* Logo Display Controls */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={siteConfig.branding.showLogo}
                        onChange={(e) =>
                          setSiteConfig((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              showLogo: e.target.checked,
                            },
                          }))
                        }
                        className="rounded"
                      />
                      Show Logo Image
                    </label>
                    {siteConfig.branding.logo && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          siteConfig.branding.showLogo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {siteConfig.branding.showLogo
                          ? "✅ Visible"
                          : "❌ Hidden"}
                      </span>
                    )}
                  </div>

                  {/* Logo Size Controls */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Max Height (px)
                      </label>
                      <input
                        type="number"
                        value={siteConfig.branding.logoMaxHeight || 40}
                        onChange={(e) =>
                          setSiteConfig((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              logoMaxHeight: parseInt(e.target.value) || 40,
                            },
                          }))
                        }
                        className="w-full border rounded px-2 py-1"
                        min="20"
                        max="80"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">
                        Max Width (px)
                      </label>
                      <input
                        type="number"
                        value={siteConfig.branding.logoMaxWidth || 100}
                        onChange={(e) =>
                          setSiteConfig((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              logoMaxWidth: parseInt(e.target.value) || 100,
                            },
                          }))
                        }
                        className="w-full border rounded px-2 py-1"
                        min="40"
                        max="200"
                      />
                    </div>
                  </div>
                </div>

                {siteConfig.branding.logo && (
                  <div className="mt-2">
                    <img
                      src={
                        siteConfig.branding.logo.startsWith("http")
                          ? siteConfig.branding.logo
                          : `http://localhost:5000${siteConfig.branding.logo}`
                      }
                      alt="Logo Preview"
                      className="h-16 w-auto object-contain border rounded"
                      onError={(e) => {
                        console.error(
                          "Logo preview failed to load:",
                          siteConfig.branding.logo
                        );
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log(
                          "Logo preview loaded successfully:",
                          siteConfig.branding.logo
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Text Logo */}
            <div>
              <label className="admin-label">Text Logo</label>
              <input
                type="text"
                value={siteConfig.branding.textLogo}
                onChange={(e) =>
                  setSiteConfig((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, textLogo: e.target.value },
                  }))
                }
                className="w-full"
                placeholder="🏔️ Hotel Annapurna Samar"
              />

              {/* Text Logo Display Control */}
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={siteConfig.branding.showTextLogo}
                    onChange={(e) =>
                      setSiteConfig((prev) => ({
                        ...prev,
                        branding: {
                          ...prev.branding,
                          showTextLogo: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  Show Text Logo
                </label>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    siteConfig.branding.showTextLogo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {siteConfig.branding.showTextLogo
                    ? "✅ Visible"
                    : "❌ Hidden"}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Preview:{" "}
                <span className="font-semibold">
                  {siteConfig.branding.textLogo}
                </span>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="admin-label">Favicon</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={siteConfig.branding.favicon}
                  onChange={(e) =>
                    setSiteConfig((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, favicon: e.target.value },
                    }))
                  }
                  className="w-full"
                  placeholder="/uploads/favicon.ico"
                />
                <input
                  type="file"
                  accept="image/*,.ico"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("files", file);
                    try {
                      const resp = await fetch(
                        "http://localhost:5000/api/media/upload",
                        { method: "POST", body: formData }
                      );
                      const data = await resp.json();
                      if (resp.ok && data && data[0]) {
                        const url = `http://localhost:5000${data[0].path}`;
                        setSiteConfig((prev) => ({
                          ...prev,
                          branding: { ...prev.branding, favicon: url },
                        }));
                        alert("Favicon uploaded successfully!");
                      } else {
                        alert("Failed to upload favicon");
                      }
                    } catch (err) {
                      alert("Error uploading favicon");
                    }
                  }}
                  className="hidden"
                  id="favicon-upload"
                />
                <label
                  htmlFor="favicon-upload"
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm block text-center"
                >
                  📁 Upload Favicon
                </label>
                {siteConfig.branding.favicon && (
                  <div className="mt-2">
                    <img
                      src={
                        siteConfig.branding.favicon.startsWith("http")
                          ? siteConfig.branding.favicon
                          : `http://localhost:5000${siteConfig.branding.favicon}`
                      }
                      alt="Favicon Preview"
                      className="h-8 w-8 object-contain border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Management */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800">Navigation Menu</h4>
              <button
                onClick={addNavItem}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm flex items-center gap-2"
              >
                <FaPlus size={12} />
                Add Menu Item
              </button>
            </div>

            <div className="space-y-3">
              {siteConfig.navigation.items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Order Controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => reorderNavItem(item.id, "up")}
                            disabled={item.order === 1}
                            className="text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <span className="text-xs text-center font-mono bg-white px-2 py-1 rounded border">
                            {item.order}
                          </span>
                          <button
                            onClick={() => reorderNavItem(item.id, "down")}
                            disabled={
                              item.order === siteConfig.navigation.items.length
                            }
                            className="text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                        </div>

                        {/* Visibility Toggle */}
                        <button
                          onClick={() => toggleNavItemVisibility(item.id)}
                          className={`p-2 rounded ${
                            item.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                          title={
                            item.isActive ? "Hide menu item" : "Show menu item"
                          }
                        >
                          {item.isActive ? (
                            <FaEye size={14} />
                          ) : (
                            <FaEyeSlash size={14} />
                          )}
                        </button>

                        {/* Menu Item Content */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          {editingNavItem === item.id ? (
                            <>
                              <input
                                type="text"
                                value={tempNavItem.text}
                                onChange={(e) =>
                                  setTempNavItem((prev) => ({
                                    ...prev,
                                    text: e.target.value,
                                  }))
                                }
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Menu text"
                              />
                              <input
                                type="text"
                                value={tempNavItem.url}
                                onChange={(e) =>
                                  setTempNavItem((prev) => ({
                                    ...prev,
                                    url: e.target.value,
                                  }))
                                }
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="/page-url"
                              />
                              <input
                                type="number"
                                value={tempNavItem.order}
                                onChange={(e) =>
                                  setTempNavItem((prev) => ({
                                    ...prev,
                                    order: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="border rounded px-2 py-1 text-sm w-20"
                                min="1"
                              />
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-gray-800">
                                {item.text}
                              </span>
                              <span className="text-gray-600 text-sm">
                                {item.url}
                              </span>
                              <span className="text-gray-500 text-sm">
                                Order: {item.order}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {editingNavItem === item.id ? (
                            <>
                              <button
                                onClick={saveNavItemEdit}
                                className="text-green-600 hover:text-green-700 p-1"
                                title="Save changes"
                              >
                                <FaSave size={14} />
                              </button>
                              <button
                                onClick={() => setEditingNavItem(null)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Cancel editing"
                              >
                                <FaTimes size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditingNavItem(item.id)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Edit menu item"
                              >
                                <FaEdit size={14} />
                              </button>
                              {item.id !== "home" && (
                                <button
                                  onClick={() => removeNavItem(item.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="Remove menu item"
                                >
                                  <FaTrash size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Save Site Config Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={async () => {
                try {
                  console.log("Saving site config:", siteConfig);
                  const response = await fetch(
                    "http://localhost:5000/api/site-config",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(siteConfig),
                    }
                  );

                  if (response.ok) {
                    const result = await response.json();
                    console.log("Save successful:", result);
                    alert("Site configuration saved successfully!");

                    // Force a page reload to ensure the header updates
                    window.location.reload();
                  } else {
                    const errorData = await response.json();
                    console.error("Save failed:", errorData);
                    alert(`Failed to save: ${errorData.message}`);
                  }
                } catch (error) {
                  console.error("Error saving site config:", error);
                  alert("Error saving site configuration");
                }
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Save Site Configuration
            </button>
          </div>
        </div>

        {/* Background Image */}
        <div className="mb-8 admin-section">
          <h3 className="text-lg font-semibold mb-4">Landing Background</h3>
          {/* Type selector */}
          <div className="admin-grid-gap mb-4">
            <div>
              <label className="admin-label">Background Type</label>
              <select
                value={homeContent?.heroBackground?.type || "image"}
                onChange={(e) =>
                  setHomeContent((prev: any) => ({
                    ...prev,
                    heroBackground: {
                      ...(prev?.heroBackground || {}),
                      type: e.target.value,
                    },
                  }))
                }
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div className="flex items-end gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!homeContent?.heroBackground?.loop}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      heroBackground: {
                        ...(prev?.heroBackground || {}),
                        loop: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="text-sm text-gray-700">Loop video</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!homeContent?.heroBackground?.muted}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      heroBackground: {
                        ...(prev?.heroBackground || {}),
                        muted: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="text-sm text-gray-700">Mute sound</span>
              </label>
            </div>
          </div>

          {/* Source input */}
          <div className="mb-4">
            <label className="admin-label">Source (URL or /uploads/...)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={homeContent?.heroBackground?.src || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  // Auto-detect YouTube URLs and set type accordingly
                  const isYouTube =
                    value.includes("youtube.com") || value.includes("youtu.be");

                  // Validate and clean YouTube URLs
                  let cleanValue = value;
                  if (isYouTube) {
                    // Convert youtu.be to youtube.com/embed format
                    if (value.includes("youtu.be/")) {
                      const videoId = value
                        .split("youtu.be/")[1]
                        ?.split("?")[0];
                      if (videoId) {
                        cleanValue = `https://www.youtube.com/watch?v=${videoId}`;
                      }
                    }
                    // Ensure proper YouTube format
                    if (value.includes("youtube.com/watch?v=")) {
                      const videoId = value.split("v=")[1]?.split("&")[0];
                      if (videoId) {
                        cleanValue = `https://www.youtube.com/watch?v=${videoId}`;
                      }
                    }
                  }
                  const isVideo = value.match(
                    /\.(mp4|mov|avi|webm|mkv|m4v|3gp|flv|wmv)$/
                  );
                  const isImage = value.match(
                    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/
                  );

                  let detectedType =
                    homeContent?.heroBackground?.type || "image";

                  if (isYouTube) {
                    detectedType = "youtube";
                  } else if (isVideo) {
                    detectedType = "video";
                  } else if (isImage) {
                    detectedType = "image";
                  }

                  console.log(
                    "Auto-detected type:",
                    detectedType,
                    "for URL:",
                    value
                  );

                  setHomeContent((prev: any) => ({
                    ...prev,
                    heroBackground: {
                      ...(prev?.heroBackground || {}),
                      src: cleanValue,
                      type: detectedType,
                    },
                  }));

                  // Auto-save YouTube settings immediately
                  if (detectedType === "youtube") {
                    setTimeout(async () => {
                      try {
                        const updatedContent = {
                          ...homeContent,
                          heroBackground: {
                            ...(homeContent?.heroBackground || {}),
                            src: cleanValue,
                            type: detectedType,
                          },
                        };

                        const res = await fetch(
                          "http://localhost:5000/api/home",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedContent),
                          }
                        );

                        if (res.ok) {
                          const saved = await res.json();
                          setHomeContent(saved);
                          console.log(
                            "YouTube settings auto-saved successfully"
                          );
                          alert("YouTube video settings saved automatically!");
                        } else {
                          console.error("Failed to auto-save YouTube settings");
                        }
                      } catch (e) {
                        console.error("Error auto-saving YouTube settings:", e);
                      }
                    }, 100);
                  }
                }}
                className="flex-1"
                placeholder="Paste image/video URL or YouTube link"
              />
              <button
                type="button"
                onClick={() => openLibrary("heroBackground")}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
              >
                📁 Select from Gallery
              </button>
            </div>

            {/* YouTube detection status */}
            {homeContent?.heroBackground?.type === "youtube" && (
              <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ YouTube video detected and saved automatically
              </div>
            )}

            {/* Type indicator */}
            {homeContent?.heroBackground?.type && (
              <div className="mt-1 text-xs text-gray-500">
                Current type:{" "}
                <span className="font-medium">
                  {homeContent.heroBackground.type}
                </span>
              </div>
            )}
          </div>

          {/* Poster for videos */}
          {homeContent?.heroBackground?.type !== "image" && (
            <div className="mb-4">
              <label className="admin-label">Poster Image (optional)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={homeContent?.heroBackground?.poster || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      heroBackground: {
                        ...(prev?.heroBackground || {}),
                        poster: e.target.value,
                      },
                    }))
                  }
                  className="flex-1"
                  placeholder="/uploads/poster.jpg"
                />
                <button
                  type="button"
                  onClick={() => openLibrary("poster")}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                >
                  📁 Select from Gallery
                </button>
              </div>
            </div>
          )}

          {/* Legacy preview (image) retained below */}
          <div className="space-y-2 mt-4">
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              {content.backgroundImage ? (
                <img
                  src={
                    content.backgroundImage.startsWith("http")
                      ? content.backgroundImage
                      : content.backgroundImage.startsWith("/uploads")
                      ? `http://localhost:5000${content.backgroundImage}`
                      : content.backgroundImage
                  }
                  alt="Background"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      content.backgroundImage
                    );
                    e.currentTarget.src = "/himalayas-bg.jpg"; // Fallback image
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer group hover:bg-black/60 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-white text-center">
                  <FaImage size={24} className="mx-auto mb-2" />
                  <span>Change Background Image</span>
                </div>
              </label>
              <button
                type="button"
                onClick={() => openLibrary("backgroundImage")}
                className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded shadow hover:bg-white"
              >
                Choose from Library
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Current image path: {content.backgroundImage || "None"}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div className="admin-section">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Main Title</h3>
              {editingField === "title" ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("title", content.title)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            {editingField === "title" ? (
              <input
                type="text"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <p className="text-gray-700">{content.title}</p>
            )}
          </div>

          {/* Main Description */}
          <div className="admin-section">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Main Description</h3>
              {editingField === "mainDescription" ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    startEditing("mainDescription", content.mainDescription)
                  }
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            {editingField === "mainDescription" ? (
              <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full border rounded p-2 min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700">{content.mainDescription}</p>
            )}
          </div>

          {/* Tagline */}
          <div className="admin-section">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Tagline</h3>
              {editingField === "tagline" ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing("tagline", content.tagline)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            {editingField === "tagline" ? (
              <input
                type="text"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <p className="text-gray-700">{content.tagline}</p>
            )}
          </div>

          {/* Call To Action */}
          <div className="admin-section">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Call To Action</h3>
              {editingField === "callToAction" ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    startEditing("callToAction", content.callToAction)
                  }
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            {editingField === "callToAction" ? (
              <input
                type="text"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <p className="text-gray-700">{content.callToAction}</p>
            )}
          </div>

          {/* Benefits */}
          <div className="admin-section">
            <h3 className="font-semibold mb-4">Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.benefits.map((benefit) => (
                <div key={benefit.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-4xl">{benefit.icon}</div>
                    <button
                      onClick={() => setSelectedBenefit(benefit.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                  {selectedBenefit === benefit.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={benefit.icon}
                        onChange={(e) =>
                          editBenefit(benefit.id, "icon", e.target.value)
                        }
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Icon (emoji)"
                      />
                      <input
                        type="text"
                        value={benefit.title}
                        onChange={(e) =>
                          editBenefit(benefit.id, "title", e.target.value)
                        }
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Title"
                      />
                      <textarea
                        value={benefit.description}
                        onChange={(e) =>
                          editBenefit(benefit.id, "description", e.target.value)
                        }
                        className="w-full border rounded p-2"
                        placeholder="Description"
                      />
                      <button
                        onClick={() => setSelectedBenefit(null)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-800">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save All Changes */}
          <div className="flex justify-end mt-8">
            <button
              onClick={async () => {
                try {
                  console.log("Attempting to save content:", content);

                  // Normalize background image to relative URL if it is an absolute uploads URL
                  const normalized = { ...content };
                  if (
                    normalized.backgroundImage.startsWith(
                      "http://localhost:5000/uploads/"
                    )
                  ) {
                    normalized.backgroundImage =
                      normalized.backgroundImage.replace(
                        "http://localhost:5000",
                        ""
                      );
                  }

                  const response = await fetch(
                    "http://localhost:5000/api/hero",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(normalized),
                      credentials: "include",
                    }
                  );

                  console.log("Save response status:", response.status);

                  if (response.ok) {
                    const savedContent = await response.json();
                    console.log("Content saved successfully:", savedContent);
                    alert("Changes saved successfully!");
                  } else {
                    let errorMessage = "Failed to save changes.";
                    try {
                      const errorData = await response.json();
                      console.error("Server error response:", errorData);
                      errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                      console.error("Could not parse error response:", e);
                    }
                    alert(`Failed to save: ${errorMessage}`);
                  }
                } catch (error) {
                  console.error("Network or parsing error:", error);
                  alert(
                    "Error saving changes. Please check if the backend server is running (http://localhost:5000) and try again."
                  );
                }
              }}
              className="btn btn-primary"
            >
              Save All Changes
            </button>
          </div>

          {/* Home Page Editor */}
          <div className="admin-section mt-12">
            <h3 className="text-lg font-semibold mb-4">Home Page Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Trust Badges Subtitle
                </label>
                <input
                  type="text"
                  value={homeContent?.trustBadges?.subtitle || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      trustBadges: {
                        ...(prev?.trustBadges || {}),
                        subtitle: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              {/* Trust brands editable list */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">
                  Trust Brands
                </label>
                <div className="space-y-3">
                  {(homeContent?.trustBadges?.brands || []).map(
                    (b: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Brand name"
                          value={b.name || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => {
                              const brands = [
                                ...(prev?.trustBadges?.brands || []),
                              ];
                              brands[idx] = {
                                ...(brands[idx] || {}),
                                name: e.target.value,
                              };
                              return {
                                ...prev,
                                trustBadges: {
                                  ...(prev?.trustBadges || {}),
                                  brands,
                                },
                              };
                            })
                          }
                          className="w-48 border rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Logo URL or /uploads/..."
                          value={b.logo || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => {
                              const brands = [
                                ...(prev?.trustBadges?.brands || []),
                              ];
                              brands[idx] = {
                                ...(brands[idx] || {}),
                                logo: e.target.value,
                              };
                              return {
                                ...prev,
                                trustBadges: {
                                  ...(prev?.trustBadges || {}),
                                  brands,
                                },
                              };
                            })
                          }
                          className="flex-1 border rounded p-2"
                        />
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              "Are you sure you want to remove this brand?"
                            );
                            if (!isConfirmed) return;
                            setHomeContent((prev: any) => ({
                              ...prev,
                              trustBadges: {
                                ...(prev?.trustBadges || {}),
                                brands: (
                                  prev?.trustBadges?.brands || []
                                ).filter((_: any, i: number) => i !== idx),
                              },
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="text-blue-600"
                    onClick={() =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        trustBadges: {
                          ...(prev?.trustBadges || {}),
                          brands: [
                            ...(prev?.trustBadges?.brands || []),
                            { name: "", logo: "" },
                          ],
                        },
                      }))
                    }
                  >
                    + Add Brand
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Experiences Title
                </label>
                <input
                  type="text"
                  value={homeContent?.experiences?.title || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      experiences: {
                        ...(prev?.experiences || {}),
                        title: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Rooms Editor moved to dedicated tab */}
              {/* Unique Experiences Items (6 boxes) */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-3">
                  Experiences Items
                </h4>
                <div className="space-y-4">
                  {(homeContent?.experiences?.items || []).map(
                    (exp: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Title */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Title
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={exp.title || ""}
                                onChange={(e) =>
                                  setHomeContent((prev: any) => {
                                    const items = [
                                      ...(prev?.experiences?.items || []),
                                    ];
                                    items[idx] = {
                                      ...(items[idx] || {}),
                                      title: e.target.value,
                                    };
                                    return {
                                      ...prev,
                                      experiences: {
                                        ...(prev?.experiences || {}),
                                        items,
                                      },
                                    };
                                  })
                                }
                                className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                              />
                              <button
                                onClick={() => {
                                  const current = exp.title || "";
                                  const next = prompt(
                                    "Edit Experience Title:",
                                    current
                                  );
                                  if (next !== null) {
                                    setHomeContent((prev: any) => {
                                      const items = [
                                        ...(prev?.experiences?.items || []),
                                      ];
                                      items[idx] = {
                                        ...(items[idx] || {}),
                                        title: next,
                                      };
                                      return {
                                        ...prev,
                                        experiences: {
                                          ...(prev?.experiences || {}),
                                          items,
                                        },
                                      };
                                    });
                                  }
                                }}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">
                              Description
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={exp.description || ""}
                                onChange={(e) =>
                                  setHomeContent((prev: any) => {
                                    const items = [
                                      ...(prev?.experiences?.items || []),
                                    ];
                                    items[idx] = {
                                      ...(items[idx] || {}),
                                      description: e.target.value,
                                    };
                                    return {
                                      ...prev,
                                      experiences: {
                                        ...(prev?.experiences || {}),
                                        items,
                                      },
                                    };
                                  })
                                }
                                className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                              />
                              <button
                                onClick={() => {
                                  const current = exp.description || "";
                                  const next = prompt(
                                    "Edit Experience Description:",
                                    current
                                  );
                                  if (next !== null) {
                                    setHomeContent((prev: any) => {
                                      const items = [
                                        ...(prev?.experiences?.items || []),
                                      ];
                                      items[idx] = {
                                        ...(items[idx] || {}),
                                        description: next,
                                      };
                                      return {
                                        ...prev,
                                        experiences: {
                                          ...(prev?.experiences || {}),
                                          items,
                                        },
                                      };
                                    });
                                  }
                                }}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <FaEdit />
                              </button>
                            </div>
                          </div>

                          {/* Image URL + Upload */}
                          <div className="md:col-span-3">
                            <label className="block text-sm text-gray-600 mb-1">
                              Image
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Image URL or /uploads/..."
                                value={exp.image || ""}
                                onChange={(e) =>
                                  setHomeContent((prev: any) => {
                                    const items = [
                                      ...(prev?.experiences?.items || []),
                                    ];
                                    items[idx] = {
                                      ...(items[idx] || {}),
                                      image: e.target.value,
                                    };
                                    return {
                                      ...prev,
                                      experiences: {
                                        ...(prev?.experiences || {}),
                                        items,
                                      },
                                    };
                                  })
                                }
                                className="flex-1 border border-gray-300 bg-white text-gray-800 rounded p-2"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append("files", file);
                                  try {
                                    const resp = await fetch(
                                      "http://localhost:5000/api/media/upload",
                                      { method: "POST", body: formData }
                                    );
                                    const data = await resp.json();
                                    if (resp.ok && data && data[0]) {
                                      const imageUrl = `http://localhost:5000${data[0].path}`;
                                      setHomeContent((prev: any) => {
                                        const items = [
                                          ...(prev?.experiences?.items || []),
                                        ];
                                        items[idx] = {
                                          ...(items[idx] || {}),
                                          image: imageUrl,
                                        };
                                        return {
                                          ...prev,
                                          experiences: {
                                            ...(prev?.experiences || {}),
                                            items,
                                          },
                                        };
                                      });
                                      alert("Image uploaded successfully!");
                                    } else {
                                      alert("Failed to upload image");
                                    }
                                  } catch (err) {
                                    alert("Error uploading image");
                                  }
                                }}
                                className="hidden"
                                id={`experience-image-upload-${idx}`}
                              />
                              <label
                                htmlFor={`experience-image-upload-${idx}`}
                                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                              >
                                📁 Upload
                              </label>
                              <button
                                type="button"
                                className="text-red-600"
                                onClick={() => {
                                  const isConfirmed = window.confirm(
                                    "Remove this experience item?"
                                  );
                                  if (!isConfirmed) return;
                                  setHomeContent((prev: any) => ({
                                    ...prev,
                                    experiences: {
                                      ...(prev?.experiences || {}),
                                      items: (
                                        prev?.experiences?.items || []
                                      ).filter(
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
                        </div>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="text-blue-600"
                    onClick={() =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        experiences: {
                          ...(prev?.experiences || {}),
                          items: [
                            ...(prev?.experiences?.items || []),
                            { title: "", description: "", image: "" },
                          ],
                        },
                      }))
                    }
                  >
                    + Add Experience
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Social Proof Heading
                </label>
                <input
                  type="text"
                  value={homeContent?.socialProof?.heading || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      socialProof: {
                        ...(prev?.socialProof || {}),
                        heading: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Social Proof Subheading
                </label>
                <input
                  type="text"
                  value={homeContent?.socialProof?.subheading || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      socialProof: {
                        ...(prev?.socialProof || {}),
                        subheading: e.target.value,
                      },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Title
                </label>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={homeContent?.culinary?.title || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const currentValue = homeContent?.culinary?.title || "";
                      const newValue = prompt(
                        "Edit Culinary Title:",
                        currentValue
                      );
                      if (newValue !== null) {
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            title: newValue,
                          },
                        }));
                      }
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 1 Title
                </label>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={homeContent?.culinary?.section1Title || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section1Title: e.target.value,
                          },
                        }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const currentValue =
                        homeContent?.culinary?.section1Title || "";
                      const newValue = prompt(
                        "Edit Section 1 Title:",
                        currentValue
                      );
                      if (newValue !== null) {
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section1Title: newValue,
                          },
                        }));
                      }
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 1 Text
                </label>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <textarea
                      value={homeContent?.culinary?.section1Text || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section1Text: e.target.value,
                          },
                        }))
                      }
                      className="w-full border rounded p-2"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const currentValue =
                        homeContent?.culinary?.section1Text || "";
                      const newValue = prompt(
                        "Edit Section 1 Text:",
                        currentValue
                      );
                      if (newValue !== null) {
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section1Text: newValue,
                          },
                        }));
                      }
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 2 Title
                </label>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={homeContent?.culinary?.section2Title || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section2Title: e.target.value,
                          },
                        }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const currentValue =
                        homeContent?.culinary?.section2Title || "";
                      const newValue = prompt(
                        "Edit Section 2 Title:",
                        currentValue
                      );
                      if (newValue !== null) {
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section2Title: newValue,
                          },
                        }));
                      }
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 2 Text
                </label>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <textarea
                      value={homeContent?.culinary?.section2Text || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section2Text: e.target.value,
                          },
                        }))
                      }
                      className="w-full border rounded p-2"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const currentValue =
                        homeContent?.culinary?.section2Text || "";
                      const newValue = prompt(
                        "Edit Section 2 Text:",
                        currentValue
                      );
                      if (newValue !== null) {
                        setHomeContent((prev: any) => ({
                          ...prev,
                          culinary: {
                            ...(prev?.culinary || {}),
                            section2Text: newValue,
                          },
                        }));
                      }
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>

              {/* Culinary images */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 1 Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={homeContent?.culinary?.section1Image || ""}
                    onChange={(e) =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        culinary: {
                          ...(prev?.culinary || {}),
                          section1Image: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 border rounded p-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("files", file);
                        try {
                          const response = await fetch(
                            "http://localhost:5000/api/media/upload",
                            {
                              method: "POST",
                              body: formData,
                            }
                          );
                          const data = await response.json();
                          if (response.ok && data && data[0]) {
                            const imageUrl = `http://localhost:5000${data[0].path}`;
                            setHomeContent((prev: any) => ({
                              ...prev,
                              culinary: {
                                ...(prev?.culinary || {}),
                                section1Image: imageUrl,
                              },
                            }));
                            alert("Image uploaded successfully!");
                          } else {
                            alert("Failed to upload image");
                          }
                        } catch (error) {
                          console.error("Error uploading image:", error);
                          alert("Error uploading image");
                        }
                      }
                    }}
                    className="hidden"
                    id="culinary-section1-upload"
                  />
                  <label
                    htmlFor="culinary-section1-upload"
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                  >
                    📁 Upload
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Culinary Section 2 Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={homeContent?.culinary?.section2Image || ""}
                    onChange={(e) =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        culinary: {
                          ...(prev?.culinary || {}),
                          section2Image: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 border rounded p-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("files", file);
                        try {
                          const response = await fetch(
                            "http://localhost:5000/api/media/upload",
                            {
                              method: "POST",
                              body: formData,
                            }
                          );
                          const data = await response.json();
                          if (response.ok && data && data[0]) {
                            const imageUrl = `http://localhost:5000${data[0].path}`;
                            setHomeContent((prev: any) => ({
                              ...prev,
                              culinary: {
                                ...(prev?.culinary || {}),
                                section2Image: imageUrl,
                              },
                            }));
                            alert("Image uploaded successfully!");
                          } else {
                            alert("Failed to upload image");
                          }
                        } catch (error) {
                          console.error("Error uploading image:", error);
                          alert("Error uploading image");
                        }
                      }
                    }}
                    className="hidden"
                    id="culinary-section2-upload"
                  />
                  <label
                    htmlFor="culinary-section2-upload"
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                  >
                    📁 Upload
                  </label>
                </div>
              </div>
              {/* Testimonials title already handled, add map titles */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Map Title
                </label>
                <input
                  type="text"
                  value={homeContent?.map?.title || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      map: { ...(prev?.map || {}), title: e.target.value },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Map Subtitle
                </label>
                <input
                  type="text"
                  value={homeContent?.map?.subtitle || ""}
                  onChange={(e) =>
                    setHomeContent((prev: any) => ({
                      ...prev,
                      map: { ...(prev?.map || {}), subtitle: e.target.value },
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Subscribe Section */}
            <div className="admin-section mt-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Subscribe Section
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Title
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={homeContent?.subscribe?.title || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          subscribe: {
                            ...(prev?.subscribe || {}),
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                    />
                    <button
                      onClick={() => {
                        const current = homeContent?.subscribe?.title || "";
                        const next = prompt("Edit Subscribe Title:", current);
                        if (next !== null) {
                          setHomeContent((prev: any) => ({
                            ...prev,
                            subscribe: {
                              ...(prev?.subscribe || {}),
                              title: next,
                            },
                          }));
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Subtitle
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={homeContent?.subscribe?.subtitle || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          subscribe: {
                            ...(prev?.subscribe || {}),
                            subtitle: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                    />
                    <button
                      onClick={() => {
                        const current = homeContent?.subscribe?.subtitle || "";
                        const next = prompt(
                          "Edit Subscribe Subtitle:",
                          current
                        );
                        if (next !== null) {
                          setHomeContent((prev: any) => ({
                            ...prev,
                            subscribe: {
                              ...(prev?.subscribe || {}),
                              subtitle: next,
                            },
                          }));
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email Placeholder
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={homeContent?.subscribe?.placeholder || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          subscribe: {
                            ...(prev?.subscribe || {}),
                            placeholder: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                    />
                    <button
                      onClick={() => {
                        const current =
                          homeContent?.subscribe?.placeholder || "";
                        const next = prompt("Edit Email Placeholder:", current);
                        if (next !== null) {
                          setHomeContent((prev: any) => ({
                            ...prev,
                            subscribe: {
                              ...(prev?.subscribe || {}),
                              placeholder: next,
                            },
                          }));
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Button Text
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={homeContent?.subscribe?.buttonText || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          subscribe: {
                            ...(prev?.subscribe || {}),
                            buttonText: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                    />
                    <button
                      onClick={() => {
                        const current =
                          homeContent?.subscribe?.buttonText || "";
                        const next = prompt("Edit Button Text:", current);
                        if (next !== null) {
                          setHomeContent((prev: any) => ({
                            ...prev,
                            subscribe: {
                              ...(prev?.subscribe || {}),
                              buttonText: next,
                            },
                          }));
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Disclaimer
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={homeContent?.subscribe?.disclaimer || ""}
                      onChange={(e) =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          subscribe: {
                            ...(prev?.subscribe || {}),
                            disclaimer: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                    />
                    <button
                      onClick={() => {
                        const current =
                          homeContent?.subscribe?.disclaimer || "";
                        const next = prompt("Edit Disclaimer:", current);
                        if (next !== null) {
                          setHomeContent((prev: any) => ({
                            ...prev,
                            subscribe: {
                              ...(prev?.subscribe || {}),
                              disclaimer: next,
                            },
                          }));
                        }
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Theme
                  </label>
                  <select
                    value={homeContent?.subscribe?.theme || "light"}
                    onChange={(e) =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        subscribe: {
                          ...(prev?.subscribe || {}),
                          theme: e.target.value,
                        },
                      }))
                    }
                    className="w-full border border-gray-300 bg-white text-gray-800 rounded p-2"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              {/* Benefits list */}
              <div className="mt-4">
                <h5 className="font-medium text-gray-700 mb-3">Benefits</h5>
                <div className="space-y-4">
                  {(homeContent?.subscribe?.benefits || []).map(
                    (b: any, idx: number) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Icon (emoji)"
                          value={b.icon || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => {
                              const benefits = [
                                ...(prev?.subscribe?.benefits || []),
                              ];
                              benefits[idx] = {
                                ...(benefits[idx] || {}),
                                icon: e.target.value,
                              };
                              return {
                                ...prev,
                                subscribe: {
                                  ...(prev?.subscribe || {}),
                                  benefits,
                                },
                              };
                            })
                          }
                          className="border border-gray-300 bg-white text-gray-800 rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={b.title || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => {
                              const benefits = [
                                ...(prev?.subscribe?.benefits || []),
                              ];
                              benefits[idx] = {
                                ...(benefits[idx] || {}),
                                title: e.target.value,
                              };
                              return {
                                ...prev,
                                subscribe: {
                                  ...(prev?.subscribe || {}),
                                  benefits,
                                },
                              };
                            })
                          }
                          className="border border-gray-300 bg-white text-gray-800 rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={b.description || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => {
                              const benefits = [
                                ...(prev?.subscribe?.benefits || []),
                              ];
                              benefits[idx] = {
                                ...(benefits[idx] || {}),
                                description: e.target.value,
                              };
                              return {
                                ...prev,
                                subscribe: {
                                  ...(prev?.subscribe || {}),
                                  benefits,
                                },
                              };
                            })
                          }
                          className="border border-gray-300 bg-white text-gray-800 rounded p-2 md:col-span-2"
                        />

                        {/* Image upload for optional benefit image */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Image URL or /uploads/... (optional)"
                            value={b.image || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => {
                                const benefits = [
                                  ...(prev?.subscribe?.benefits || []),
                                ];
                                benefits[idx] = {
                                  ...(benefits[idx] || {}),
                                  image: e.target.value,
                                };
                                return {
                                  ...prev,
                                  subscribe: {
                                    ...(prev?.subscribe || {}),
                                    benefits,
                                  },
                                };
                              })
                            }
                            className="border border-gray-300 bg-white text-gray-800 rounded p-2 w-full"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append("files", file);
                              try {
                                const resp = await fetch(
                                  "http://localhost:5000/api/media/upload",
                                  { method: "POST", body: formData }
                                );
                                const data = await resp.json();
                                if (resp.ok && data && data[0]) {
                                  const imageUrl = `http://localhost:5000${data[0].path}`;
                                  setHomeContent((prev: any) => {
                                    const benefits = [
                                      ...(prev?.subscribe?.benefits || []),
                                    ];
                                    benefits[idx] = {
                                      ...(benefits[idx] || {}),
                                      image: imageUrl,
                                    };
                                    return {
                                      ...prev,
                                      subscribe: {
                                        ...(prev?.subscribe || {}),
                                        benefits,
                                      },
                                    };
                                  });
                                  alert("Image uploaded successfully!");
                                } else {
                                  alert("Failed to upload image");
                                }
                              } catch (err) {
                                alert("Error uploading image");
                              }
                            }}
                            className="hidden"
                            id={`subscribe-benefit-upload-${idx}`}
                          />
                          <label
                            htmlFor={`subscribe-benefit-upload-${idx}`}
                            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm"
                          >
                            📁 Upload
                          </label>
                        </div>

                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              "Remove this benefit?"
                            );
                            if (!isConfirmed) return;
                            setHomeContent((prev: any) => ({
                              ...prev,
                              subscribe: {
                                ...(prev?.subscribe || {}),
                                benefits: (
                                  prev?.subscribe?.benefits || []
                                ).filter((_: any, i: number) => i !== idx),
                              },
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="text-blue-600"
                    onClick={() =>
                      setHomeContent((prev: any) => ({
                        ...prev,
                        subscribe: {
                          ...(prev?.subscribe || {}),
                          benefits: [
                            ...(prev?.subscribe?.benefits || []),
                            { icon: "", title: "", description: "", image: "" },
                          ],
                        },
                      }))
                    }
                  >
                    + Add Benefit
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Section - Repositioned below Map and Culinary sections */}
            <div className="admin-section mt-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Footer Content
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Us Section */}
                <div className="md:col-span-2">
                  <h5 className="font-medium text-gray-700 mb-3">Contact Us</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={homeContent?.footer?.email || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  email: e.target.value,
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.email || "";
                            const newValue = prompt(
                              "Edit Footer Email:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  email: newValue,
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={homeContent?.footer?.phone || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  phone: e.target.value,
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.phone || "";
                            const newValue = prompt(
                              "Edit Footer Phone:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  phone: newValue,
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Newsletter Placeholder
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={
                              homeContent?.footer?.newsletterPlaceholder || ""
                            }
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  newsletterPlaceholder: e.target.value,
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.newsletterPlaceholder || "";
                            const newValue = prompt(
                              "Edit Newsletter Placeholder:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  newsletterPlaceholder: newValue,
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links Section */}
                <div className="md:col-span-2">
                  <h5 className="font-medium text-gray-700 mb-3">
                    Quick Links
                  </h5>
                  <div className="space-y-3">
                    {(homeContent?.footer?.links || []).map(
                      (link: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Link text"
                            value={link.text || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => {
                                const links = [...(prev?.footer?.links || [])];
                                links[idx] = {
                                  ...(links[idx] || {}),
                                  text: e.target.value,
                                };
                                return {
                                  ...prev,
                                  footer: {
                                    ...(prev?.footer || {}),
                                    links,
                                  },
                                };
                              })
                            }
                            className="w-48 border rounded p-2"
                          />
                          <input
                            type="text"
                            placeholder="Link URL"
                            value={link.url || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => {
                                const links = [...(prev?.footer?.links || [])];
                                links[idx] = {
                                  ...(links[idx] || {}),
                                  url: e.target.value,
                                };
                                return {
                                  ...prev,
                                  footer: {
                                    ...(prev?.footer || {}),
                                    links,
                                  },
                                };
                              })
                            }
                            className="flex-1 border rounded p-2"
                          />
                          <button
                            type="button"
                            className="text-red-600"
                            onClick={() => {
                              const isConfirmed =
                                window.confirm("Remove this link?");
                              if (!isConfirmed) return;
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  links: (prev?.footer?.links || []).filter(
                                    (_: any, i: number) => i !== idx
                                  ),
                                },
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={() =>
                        setHomeContent((prev: any) => ({
                          ...prev,
                          footer: {
                            ...(prev?.footer || {}),
                            links: [
                              ...(prev?.footer?.links || []),
                              { text: "", url: "" },
                            ],
                          },
                        }))
                      }
                    >
                      + Add Link
                    </button>
                  </div>
                </div>

                {/* Follow Us Section */}
                <div className="md:col-span-2">
                  <h5 className="font-medium text-gray-700 mb-3">Follow Us</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Facebook URL
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={homeContent?.footer?.social?.facebook || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    facebook: e.target.value,
                                  },
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.social?.facebook || "";
                            const newValue = prompt(
                              "Edit Facebook URL:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    facebook: newValue,
                                  },
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Twitter URL
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={homeContent?.footer?.social?.twitter || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    twitter: e.target.value,
                                  },
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.social?.twitter || "";
                            const newValue = prompt(
                              "Edit Twitter URL:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    twitter: newValue,
                                  },
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Instagram URL
                      </label>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={homeContent?.footer?.social?.instagram || ""}
                            onChange={(e) =>
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    instagram: e.target.value,
                                  },
                                },
                              }))
                            }
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentValue =
                              homeContent?.footer?.social?.instagram || "";
                            const newValue = prompt(
                              "Edit Instagram URL:",
                              currentValue
                            );
                            if (newValue !== null) {
                              setHomeContent((prev: any) => ({
                                ...prev,
                                footer: {
                                  ...(prev?.footer || {}),
                                  social: {
                                    ...(prev?.footer?.social || {}),
                                    instagram: newValue,
                                  },
                                },
                              }));
                            }
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copyright Section */}
                <div className="md:col-span-2">
                  <h5 className="font-medium text-gray-700 mb-3">Copyright</h5>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Copyright Text
                    </label>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={homeContent?.footer?.copyright || ""}
                          onChange={(e) =>
                            setHomeContent((prev: any) => ({
                              ...prev,
                              footer: {
                                ...(prev?.footer || {}),
                                copyright: e.target.value,
                              },
                            }))
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const currentValue =
                            homeContent?.footer?.copyright || "";
                          const newValue = prompt(
                            "Edit Copyright Text:",
                            currentValue
                          );
                          if (newValue !== null) {
                            setHomeContent((prev: any) => ({
                              ...prev,
                              footer: {
                                ...(prev?.footer || {}),
                                copyright: newValue,
                              },
                            }));
                          }
                        }}
                        className="ml-2 text-blue-500 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("http://localhost:5000/api/home", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(homeContent || {}),
                    });
                    if (res.ok) {
                      const saved = await res.json();
                      setHomeContent(saved);
                      alert("Home page content saved!");
                    } else {
                      const err = await res.json();
                      alert(err.message || "Failed to save home content");
                    }
                  } catch (e) {
                    alert("Failed to save home content");
                  }
                }}
                className="btn btn-primary"
              >
                Save Home Content
              </button>
            </div>
          </div>
        </div>

        {/* Close inner container started after admin-form */}
      </div>

      {libraryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setLibraryOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Select Media</h4>
              <button
                onClick={() => setLibraryOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h5 className="font-medium text-gray-700 mb-3">
                Upload New Media
              </h5>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="media-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const formData = new FormData();
                    Array.from(files).forEach((file) => {
                      formData.append("files", file);
                    });

                    try {
                      const resp = await fetch(
                        "http://localhost:5000/api/media/upload",
                        { method: "POST", body: formData }
                      );
                      const data = await resp.json();

                      if (resp.ok && data && data.length > 0) {
                        alert(
                          "Media uploaded successfully! Refreshing library..."
                        );
                        // Refresh the media library
                        const res = await fetch(
                          "http://localhost:5000/api/media"
                        );
                        if (res.ok) {
                          const newData = await res.json();
                          setLibraryItems(newData);
                        }
                        // Clear the file input
                        e.target.value = "";
                      } else {
                        alert("Failed to upload media");
                      }
                    } catch (error) {
                      console.error("Error uploading media:", error);
                      alert("Error uploading media. Please try again.");
                    }
                  }}
                  className="flex-1"
                />
                <label
                  htmlFor="media-upload"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer text-sm whitespace-nowrap"
                >
                  📁 Upload Media
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: Images (JPEG, PNG, GIF) and Videos (MP4, MOV,
                AVI, WebM)
              </p>
            </div>

            {/* Existing Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-auto">
              {libraryItems.map((item) => (
                <button
                  key={item._id}
                  className="border rounded overflow-hidden hover:ring-2 hover:ring-blue-500"
                  onClick={() => {
                    const normalized = item.path.startsWith("/")
                      ? item.path
                      : "/" + item.path;

                    // For hero background, store the relative path, not the full URL
                    if (libraryTarget === "heroBackground") {
                      console.log(
                        "HeroSectionManager - Setting hero background src:",
                        normalized
                      );
                      console.log(
                        "HeroSectionManager - Item mimetype:",
                        item.mimetype
                      );
                      console.log("HeroSectionManager - Item path:", item.path);

                      // Auto-detect type based on file extension (since mimetype might not be available)
                      const isVideo = item.originalName
                        .toLowerCase()
                        .match(/\.(mp4|mov|avi|webm|mkv|m4v|3gp|flv|wmv)$/);

                      console.log(
                        "HeroSectionManager - Detected video:",
                        isVideo
                      );
                      console.log(
                        "HeroSectionManager - Setting type to:",
                        isVideo ? "video" : "image"
                      );

                      // Only change type if it's not already set to "youtube"
                      const newType = isVideo ? "video" : "image";
                      const shouldChangeType =
                        homeContent?.heroBackground?.type !== "youtube";

                      setHomeContent((prev: any) => ({
                        ...(prev || {}),
                        heroBackground: {
                          ...(prev?.heroBackground || {}),
                          src: normalized, // Store relative path like /uploads/video.mp4
                          type: shouldChangeType
                            ? newType
                            : prev?.heroBackground?.type || newType, // Preserve youtube type
                        },
                      }));

                      // Auto-save the changes immediately
                      setTimeout(async () => {
                        try {
                          const res = await fetch(
                            "http://localhost:5000/api/home",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                ...homeContent,
                                heroBackground: {
                                  ...(homeContent?.heroBackground || {}),
                                  src: normalized,
                                  type: shouldChangeType
                                    ? newType
                                    : homeContent?.heroBackground?.type ||
                                      newType,
                                },
                              }),
                            }
                          );
                          if (res.ok) {
                            const saved = await res.json();
                            setHomeContent(saved);
                            console.log(
                              "Hero background auto-saved successfully"
                            );
                            alert(
                              `Hero background updated to ${
                                isVideo ? "video" : "image"
                              }!`
                            );
                          } else {
                            console.error(
                              "Failed to auto-save hero background"
                            );
                          }
                        } catch (e) {
                          console.error(
                            "Error auto-saving hero background:",
                            e
                          );
                        }
                      }, 100);
                    } else if (libraryTarget === "poster") {
                      // For poster images
                      setHomeContent((prev: any) => ({
                        ...(prev || {}),
                        heroBackground: {
                          ...(prev?.heroBackground || {}),
                          poster: normalized,
                        },
                      }));
                    } else {
                      // For other content, use the full URL for display
                      const url = normalized.startsWith("/uploads")
                        ? `http://localhost:5000${normalized}`
                        : normalized;
                      setContent((prev) => ({ ...prev, backgroundImage: url }));
                    }
                    setLibraryOpen(false);
                  }}
                >
                  <img
                    src={`http://localhost:5000${
                      item.path.startsWith("/") ? item.path : "/" + item.path
                    }`}
                    alt={item.originalName}
                    className="w-full h-28 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSectionManager;
