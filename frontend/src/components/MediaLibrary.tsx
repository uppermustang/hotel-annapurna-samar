import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaCopy } from "react-icons/fa";

interface MediaItem {
  _id: string;
  filename: string;
  path: string;
  originalName: string;
  mimetype: string;
  uploadedAt: string;
}

const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load media items
  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/media");
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        // Refresh the media list
        fetchMediaItems();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading media library...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-deep-blue">Media Library</h2>
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
          <FaUpload className="inline-block mr-2" />
          Upload Files
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg overflow-hidden bg-gray-50"
          >
            <div className="relative aspect-video">
              {item.mimetype.startsWith("video/") ? (
                <video
                  className="w-full h-full object-cover cursor-pointer"
                  src={`http://localhost:5000${
                    item.path.startsWith("/") ? item.path : "/" + item.path
                  }`}
                  onClick={() =>
                    setSelectedImage(
                      `http://localhost:5000${
                        item.path.startsWith("/") ? item.path : "/" + item.path
                      }`
                    )
                  }
                  muted
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={`http://localhost:5000${
                    item.path.startsWith("/") ? item.path : "/" + item.path
                  }`}
                  alt={item.originalName}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() =>
                    setSelectedImage(
                      `http://localhost:5000${
                        item.path.startsWith("/") ? item.path : "/" + item.path
                      }`
                    )
                  }
                />
              )}
            </div>
            <div className="p-2">
              <p
                className="text-sm text-gray-600 truncate"
                title={item.originalName}
              >
                {item.originalName}
              </p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => copyUrlToClipboard(item.path)}
                  className="text-blue-500 hover:text-blue-600"
                  title="Copy URL"
                >
                  <FaCopy />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mediaItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No media items found. Upload some files to get started!
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full mx-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
