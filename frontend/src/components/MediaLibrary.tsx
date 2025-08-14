import React, { useState, useEffect, useCallback } from "react";
import {
  FaTrash,
  FaCopy,
  FaUser,
  FaCrown,
  FaEye,
  FaEdit,
  FaInfo,
  FaTimes,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useClientManagement } from "../hooks/useClientManagement";
import { Guest } from "../types/client";

interface MediaItem {
  _id: string;
  filename: string;
  path: string;
  originalName: string;
  mimetype: string;
  uploadedAt: string;
  uploadedBy?: string; // Guest who uploaded the media
  guestId?: string; // Reference to guest
  tags?: string[]; // Tags for categorization
  description?: string; // Description of the media
  size?: number; // File size in bytes
  dimensions?: {
    width: number;
    height: number;
  };
}

const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "guest-content" | "vip-content"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // New state for preview, edit, and details
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "preview" | "edit" | "details" | null
  >(null);
  const [editSettings, setEditSettings] = useState({
    width: 0,
    height: 0,
    quality: 90,
    format: "jpeg",
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  // Video player state
  const [videoRefs, setVideoRefs] = useState<{
    [key: string]: HTMLVideoElement | null;
  }>({});
  const [videoStates, setVideoStates] = useState<{
    [key: string]: { playing: boolean; muted: boolean };
  }>({});

  // Client Management Integration
  const { guests: clientGuests } = useClientManagement();

  // Load media items
  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Cleanup video refs when component unmounts
  useEffect(() => {
    return () => {
      setVideoRefs({});
      setVideoStates({});
    };
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/media");
      if (response.ok) {
        const data = await response.json();
        // Enhance media items with guest information
        const enhancedData = data.map((item: any) => ({
          ...item,
          uploadedBy: item.uploadedBy || "Staff",
          guestId: item.guestId || null,
          tags: item.tags || [],
          description: item.description || "",
        }));
        setMediaItems(enhancedData);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter media items based on active tab and search
  const filteredMediaItems = mediaItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags &&
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    if (activeTab === "guest-content") {
      return matchesSearch && item.uploadedBy !== "Staff";
    } else if (activeTab === "vip-content") {
      return (
        matchesSearch &&
        item.guestId &&
        clientGuests.find(
          (g) =>
            g._id === item.guestId && g.loyaltyPoints && g.loyaltyPoints > 1000
        )
      );
    }

    return matchesSearch;
  });

  // Get guest information for media items
  const getGuestInfo = (guestId: string): Guest | undefined => {
    return clientGuests.find((g) => g._id === guestId);
  };

  // Get VIP guests for gallery
  const vipGuests = clientGuests.filter(
    (g) => g.loyaltyPoints && g.loyaltyPoints > 1000
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);
        alert("Files uploaded successfully!");
        // Refresh the media list
        fetchMediaItems();
        // Clear the file input
        e.target.value = "";
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        alert("Failed to upload files. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert(
        "Error uploading files. Please check your connection and try again."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this media item?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMediaItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete media item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Error deleting media item. Please try again.");
    }
  };

  const copyUrlToClipboard = (path: string) => {
    const normalized = path.replace(/\\/g, "/");
    const fullUrl = `http://localhost:5000${
      normalized.startsWith("/") ? normalized : "/" + normalized
    }`;
    navigator.clipboard.writeText(fullUrl);
    alert("URL copied to clipboard!");
  };

  // Preview, Edit, and Details functions
  const openPreview = (media: MediaItem) => {
    setSelectedMedia(media);
    setPreviewMode("preview");
    // Initialize edit settings with current dimensions
    setEditSettings((prev) => ({
      ...prev,
      width: media.dimensions?.width || 800,
      height: media.dimensions?.height || 600,
    }));
  };

  const openEdit = (media: MediaItem) => {
    setSelectedMedia(media);
    setPreviewMode("edit");
    // Initialize edit settings with current dimensions
    setEditSettings((prev) => ({
      ...prev,
      width: media.dimensions?.width || 800,
      height: media.dimensions?.height || 600,
    }));
  };

  const openDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setPreviewMode("details");
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setPreviewMode(null);
    setEditSettings({
      width: 0,
      height: 0,
      quality: 90,
      format: "jpeg",
      brightness: 100,
      contrast: 100,
      saturation: 100,
    });
  };

  const handleEditSave = async () => {
    if (!selectedMedia) return;

    try {
      // Here you would typically send the edit settings to your backend
      // For now, we'll just show a success message
      alert("Edit settings saved successfully!");
      closeModal();
    } catch (error) {
      console.error("Error saving edit settings:", error);
      alert("Failed to save edit settings");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Video player functions
  const setVideoRef = useCallback(
    (id: string, element: HTMLVideoElement | null) => {
      setVideoRefs((prev) => ({ ...prev, [id]: element }));
      if (element && !videoStates[id]) {
        setVideoStates((prev) => ({
          ...prev,
          [id]: { playing: false, muted: false },
        }));
      }
    },
    [videoStates]
  );

  const toggleVideoPlay = useCallback(
    (id: string) => {
      const video = videoRefs[id];
      if (video) {
        if (video.paused) {
          video.play();
          setVideoStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], playing: true },
          }));
        } else {
          video.pause();
          setVideoStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], playing: false },
          }));
        }
      }
    },
    [videoRefs]
  );

  const toggleVideoMute = useCallback(
    (id: string) => {
      const video = videoRefs[id];
      if (video) {
        video.muted = !video.muted;
        setVideoStates((prev) => ({
          ...prev,
          [id]: { ...prev[id], muted: video.muted },
        }));
      }
    },
    [videoRefs]
  );

  const isVideo = useCallback(
    (mimetype: string) => mimetype.startsWith("video/"),
    []
  );
  const isImage = useCallback(
    (mimetype: string) => mimetype.startsWith("image/"),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-deep-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Media Library
              </h1>
              <p className="text-gray-600 mt-2">
                Browse and manage your media assets and guest-generated content
              </p>
            </div>

            {/* Guest Statistics */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">
                  {clientGuests.length}
                </div>
                <div className="text-sm text-gray-600">Total Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {vipGuests.length}
                </div>
                <div className="text-sm text-gray-600">VIP Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {
                    mediaItems.filter((item) => item.uploadedBy !== "Staff")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Guest Content</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload New Media
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
              accept="image/*,video/*"
            />
            <div className="text-sm text-gray-500">
              Select one or more files to upload
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search media by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-deep-blue text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setActiveTab("guest-content")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "guest-content"
                    ? "bg-deep-blue text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Guest Content
              </button>
              <button
                onClick={() => setActiveTab("vip-content")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "vip-content"
                    ? "bg-deep-blue text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                VIP Content
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMediaItems.map((item) => {
            const guestInfo = item.guestId ? getGuestInfo(item.guestId) : null;
            const isVIP =
              guestInfo &&
              guestInfo.loyaltyPoints &&
              guestInfo.loyaltyPoints > 1000;

            return (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                  isVIP ? "ring-2 ring-yellow-400" : ""
                }`}
              >
                {/* Media Preview */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {isImage(item.mimetype) ? (
                    <img
                      src={`http://localhost:5000${item.path}`}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : isVideo(item.mimetype) ? (
                    <video
                      ref={(el) => {
                        if (el && videoRefs[item._id] !== el) {
                          setVideoRef(item._id, el);
                        }
                      }}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onLoadedMetadata={() => {
                        const video = videoRefs[item._id];
                        if (video) {
                          video.currentTime = 0;
                        }
                      }}
                    >
                      <source
                        src={`http://localhost:5000${item.path}`}
                        type={item.mimetype}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-xs">{item.mimetype}</div>
                      </div>
                    </div>
                  )}

                  {/* Fallback for failed images */}
                  <div className="hidden w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <div className="text-xs">Image failed to load</div>
                    </div>
                  </div>

                  {/* VIP Badge */}
                  {isVIP && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                      <FaCrown className="mr-1" />
                      VIP
                    </div>
                  )}

                  {/* Guest Upload Badge */}
                  {item.uploadedBy !== "Staff" && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                      <FaUser className="mr-1" />
                      Guest
                    </div>
                  )}

                  {/* Video Controls Overlay */}
                  {isVideo(item.mimetype) && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleVideoPlay(item._id)}
                          className="bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                        >
                          {videoStates[item._id]?.playing ? (
                            <FaPause size={16} />
                          ) : (
                            <FaPlay size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => toggleVideoMute(item._id)}
                          className="bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
                        >
                          {videoStates[item._id]?.muted ? (
                            <FaVolumeMute size={16} />
                          ) : (
                            <FaVolumeUp size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-2 truncate text-sm">
                    {item.originalName}
                  </h3>

                  {/* Compact Info Row */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </span>
                    {item.size && <span>{formatFileSize(item.size)}</span>}
                  </div>

                  {/* Guest Info - Compact */}
                  {guestInfo && (
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-1 text-blue-500" />
                        <span>{guestInfo.name}</span>
                      </div>
                      {isVIP && (
                        <div className="flex items-center text-yellow-600">
                          <FaCrown className="mr-1" />
                          <span className="font-medium">VIP</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description - Compact */}
                  {item.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Tags - Compact */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Compact */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openPreview(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Preview"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => openDetails(item)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        title="Details"
                      >
                        <FaInfo size={14} />
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyUrlToClipboard(item.path)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="Copy URL"
                      >
                        <FaCopy size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMediaItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No media found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by uploading some media files"}
            </p>
          </div>
        )}
      </div>

      {/* Preview, Edit, and Details Modal */}
      {selectedMedia && previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {previewMode === "preview" && "Preview"}
                {previewMode === "edit" && "Edit Media"}
                {previewMode === "details" && "Media Details"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {previewMode === "preview" && (
                <div className="text-center">
                  {isImage(selectedMedia.mimetype) ? (
                    <img
                      src={`http://localhost:5000${selectedMedia.path}`}
                      alt={selectedMedia.originalName}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-lg"
                    />
                  ) : isVideo(selectedMedia.mimetype) ? (
                    <video
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-lg"
                      controls
                      autoPlay
                      muted
                    >
                      <source
                        src={`http://localhost:5000${selectedMedia.path}`}
                        type={selectedMedia.mimetype}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="max-w-full max-h-[60vh] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📄</div>
                        <div className="text-lg">{selectedMedia.mimetype}</div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedMedia.originalName}
                    </h3>
                    <p className="text-gray-600">
                      {selectedMedia.description || "No description available"}
                    </p>
                  </div>
                </div>
              )}

              {previewMode === "edit" && (
                <div className="space-y-6">
                  {/* Media Preview */}
                  <div className="text-center">
                    {isImage(selectedMedia.mimetype) ? (
                      <img
                        src={`http://localhost:5000${selectedMedia.path}`}
                        alt={selectedMedia.originalName}
                        className="max-w-full max-h-[40vh] object-contain mx-auto rounded-lg shadow-lg"
                      />
                    ) : isVideo(selectedMedia.mimetype) ? (
                      <video
                        className="max-w-full max-h-[40vh] object-contain mx-auto rounded-lg shadow-lg"
                        controls
                        muted
                      >
                        <source
                          src={`http://localhost:5000${selectedMedia.path}`}
                          type={selectedMedia.mimetype}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="max-w-full max-h-[40vh] flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-sm">
                            {selectedMedia.mimetype}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dimensions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">
                        Dimensions
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            value={editSettings.width}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                width: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            value={editSettings.height}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                height: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quality & Format */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">
                        Quality & Format
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quality ({editSettings.quality}%)
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={editSettings.quality}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                quality: parseInt(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format
                          </label>
                          <select
                            value={editSettings.format}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                format: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="jpeg">JPEG</option>
                            <option value="png">PNG</option>
                            <option value="webp">WebP</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Image Adjustments */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">
                        Adjustments
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brightness ({editSettings.brightness}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={editSettings.brightness}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                brightness: parseInt(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contrast ({editSettings.contrast}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={editSettings.contrast}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                contrast: parseInt(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Saturation ({editSettings.saturation}%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={editSettings.saturation}
                            onChange={(e) =>
                              setEditSettings((prev) => ({
                                ...prev,
                                saturation: parseInt(e.target.value),
                              }))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preset Actions */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() =>
                            setEditSettings((prev) => ({
                              ...prev,
                              width: 1920,
                              height: 1080,
                            }))
                          }
                          className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          HD (1920x1080)
                        </button>
                        <button
                          onClick={() =>
                            setEditSettings((prev) => ({
                              ...prev,
                              width: 1280,
                              height: 720,
                            }))
                          }
                          className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          HD Ready (1280x720)
                        </button>
                        <button
                          onClick={() =>
                            setEditSettings((prev) => ({
                              ...prev,
                              width: 800,
                              height: 600,
                            }))
                          }
                          className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          Standard (800x600)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {previewMode === "details" && (
                <div className="space-y-4">
                  {/* Large Media Display */}
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    {isImage(selectedMedia.mimetype) ? (
                      <img
                        src={`http://localhost:5000${selectedMedia.path}`}
                        alt={selectedMedia.originalName}
                        className="max-w-full max-h-[50vh] object-contain mx-auto rounded-lg shadow-sm"
                      />
                    ) : isVideo(selectedMedia.mimetype) ? (
                      <video
                        className="max-w-full max-h-[50vh] object-contain mx-auto rounded-lg shadow-sm"
                        controls
                        autoPlay
                        muted
                      >
                        <source
                          src={`http://localhost:5000${selectedMedia.path}`}
                          type={selectedMedia.mimetype}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="max-w-full max-h-[50vh] flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-6xl mb-2">📄</div>
                          <div className="text-lg">
                            {selectedMedia.mimetype}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* File Info */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 border-b pb-1">
                        File Info
                      </h4>
                      <div className="space-y-1 text-gray-600">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium truncate ml-2">
                            {selectedMedia.originalName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">
                            {selectedMedia.mimetype}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium">
                            {selectedMedia.size
                              ? formatFileSize(selectedMedia.size)
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uploaded:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedMedia.uploadedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 border-b pb-1">
                        Technical
                      </h4>
                      <div className="space-y-1 text-gray-600">
                        {selectedMedia.dimensions ? (
                          <>
                            <div className="flex justify-between">
                              <span>Dimensions:</span>
                              <span className="font-medium">
                                {selectedMedia.dimensions.width}×
                                {selectedMedia.dimensions.height}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ratio:</span>
                              <span className="font-medium">
                                {(
                                  selectedMedia.dimensions.width /
                                  selectedMedia.dimensions.height
                                ).toFixed(2)}
                                :1
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400">No dimensions</div>
                        )}
                        <div className="flex justify-between">
                          <span>Uploader:</span>
                          <span className="font-medium">
                            {selectedMedia.uploadedBy || "Staff"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 border-b pb-1">
                        Content
                      </h4>
                      <div className="space-y-1 text-gray-600">
                        {selectedMedia.description ? (
                          <div className="text-xs line-clamp-3 bg-gray-50 p-2 rounded">
                            {selectedMedia.description}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">
                            No description
                          </div>
                        )}
                        {selectedMedia.tags &&
                          selectedMedia.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedMedia.tags
                                .slice(0, 4)
                                .map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Guest Info - Compact */}
                  {selectedMedia.guestId && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Guest Information
                      </h4>
                      {(() => {
                        const guestInfo = getGuestInfo(selectedMedia.guestId!);
                        if (!guestInfo)
                          return (
                            <p className="text-gray-500 text-sm">
                              Guest information not available
                            </p>
                          );

                        return (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Name:</span>{" "}
                              {guestInfo.name}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {guestInfo.email}
                            </div>
                            <div>
                              <span className="font-medium">Loyalty:</span>{" "}
                              {guestInfo.loyaltyPoints || 0} pts
                            </div>
                            <div>
                              <span className="font-medium">Bookings:</span>{" "}
                              {guestInfo.totalBookings || 0}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => openEdit(selectedMedia)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
