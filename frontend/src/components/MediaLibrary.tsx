import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaCopy, FaUser, FaCrown, FaHeart, FaCalendarAlt } from "react-icons/fa";
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
}

const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'guest-content' | 'vip-content'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Client Management Integration
  const { guests: clientGuests, getGuestsForGallery } = useClientManagement();

  // Load media items
  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/media");
      if (response.ok) {
        const data = await response.json();
        // Enhance media items with guest information
        const enhancedData = data.map((item: any) => ({
          ...item,
          uploadedBy: item.uploadedBy || 'Staff',
          guestId: item.guestId || null,
          tags: item.tags || [],
          description: item.description || ''
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
  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    if (activeTab === 'guest-content') {
      return matchesSearch && item.uploadedBy !== 'Staff';
    } else if (activeTab === 'vip-content') {
      return matchesSearch && item.guestId && 
        clientGuests.find(g => g._id === item.guestId && g.loyaltyPoints && g.loyaltyPoints > 1000);
    }
    
    return matchesSearch;
  });

  // Get guest information for media items
  const getGuestInfo = (guestId: string): Guest | undefined => {
    return clientGuests.find(g => g._id === guestId);
  };

  // Get VIP guests for gallery
  const vipGuests = clientGuests.filter(g => g.loyaltyPoints && g.loyaltyPoints > 1000);

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
              <h1 className="text-3xl font-bold text-gray-800">Media Library</h1>
              <p className="text-gray-600 mt-2">
                Manage and organize your media assets with guest-generated content
              </p>
            </div>
            
            {/* Guest Statistics */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">{clientGuests.length}</div>
                <div className="text-sm text-gray-600">Total Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{vipGuests.length}</div>
                <div className="text-sm text-gray-600">VIP Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {mediaItems.filter(item => item.uploadedBy !== 'Staff').length}
                </div>
                <div className="text-sm text-gray-600">Guest Content</div>
              </div>
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
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-deep-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setActiveTab('guest-content')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'guest-content'
                    ? 'bg-deep-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Guest Content
              </button>
              <button
                onClick={() => setActiveTab('vip-content')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'vip-content'
                    ? 'bg-deep-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                VIP Content
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload New Media</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
              accept="image/*,video/*"
            />
            <button className="px-6 py-2 bg-deep-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upload
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMediaItems.map((item) => {
            const guestInfo = item.guestId ? getGuestInfo(item.guestId) : null;
            const isVIP = guestInfo && guestInfo.loyaltyPoints && guestInfo.loyaltyPoints > 1000;
            
            return (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                  isVIP ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {/* Media Preview */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000${item.path}`}
                    alt={item.originalName}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* VIP Badge */}
                  {isVIP && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaCrown className="mr-1" />
                      VIP
                    </div>
                  )}
                  
                  {/* Guest Upload Badge */}
                  {item.uploadedBy !== 'Staff' && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaUser className="mr-1" />
                      Guest
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">
                    {item.originalName}
                  </h3>
                  
                  {/* Guest Information */}
                  {guestInfo && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FaUser className="text-deep-blue mr-2" />
                          <span className="font-medium text-sm">{guestInfo.name}</span>
                        </div>
                        {isVIP && <FaCrown className="text-yellow-500" />}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</p>
                        {guestInfo.lastVisit && (
                          <p>Last Visit: {new Date(guestInfo.lastVisit).toLocaleDateString()}</p>
                        )}
                        {guestInfo.loyaltyPoints && (
                          <p>Loyalty Points: {guestInfo.loyaltyPoints}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Description and Tags */}
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyUrlToClipboard(item.path)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <FaCopy className="inline mr-1" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <FaTrash className="inline mr-1" />
                    </button>
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by uploading some media files'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
