import React, { useState, useEffect } from "react";
import axios from "axios";

interface CulinaryData {
  title: string;
  section1Title: string;
  section1Text: string;
  section1Image: string;
  section2Title: string;
  section2Text: string;
  section2Image: string;
}

const CulinaryEditor: React.FC = () => {
  const [culinaryData, setCulinaryData] = useState<CulinaryData>({
    title: "Culinary Excellence",
    section1Title: "Traditional Nepali Cuisine",
    section1Text:
      "Experience authentic flavors of Nepal with our carefully crafted menu featuring traditional dishes made from locally sourced ingredients.",
    section1Image: "",
    section2Title: "International Flavors",
    section2Text:
      "Our international menu offers a variety of cuisines to satisfy every palate, prepared by our experienced chefs.",
    section2Image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCulinaryData();
  }, []);

  const fetchCulinaryData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/home");
      if (response.data?.culinary) {
        setCulinaryData(response.data.culinary);
      }
    } catch (error) {
      console.error("Error fetching culinary data:", error);
    }
  };

  const handleFieldChange = (field: keyof CulinaryData, value: string) => {
    setCulinaryData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (
    field: "section1Image" | "section2Image",
    file: File
  ) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await axios.post(
        "http://localhost:5000/api/media/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data && response.data[0]) {
        const imagePath = response.data[0].path;
        handleFieldChange(field, imagePath);
        setMessage("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image");
    }
  };

  const saveCulinaryData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/home", {
        culinary: culinaryData,
      });

      if (response.status === 200) {
        setMessage("Culinary content saved successfully!");
      }
    } catch (error) {
      console.error("Error saving culinary data:", error);
      setMessage("Failed to save culinary content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Culinary Editor</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-forest-green">
            Section 1 - Traditional Nepali Cuisine
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={culinaryData.section1Title}
                onChange={(e) =>
                  handleFieldChange("section1Title", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Text
              </label>
              <textarea
                value={culinaryData.section1Text}
                onChange={(e) =>
                  handleFieldChange("section1Text", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Image
              </label>
              <div className="flex items-center space-x-4">
                {culinaryData.section1Image && (
                  <div className="relative">
                    <img
                      src={
                        culinaryData.section1Image.startsWith("http")
                          ? culinaryData.section1Image
                          : `http://localhost:5000${culinaryData.section1Image}`
                      }
                      alt="Section 1"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload("section1Image", file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-forest-green">
            Section 2 - International Flavors
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={culinaryData.section2Title}
                onChange={(e) =>
                  handleFieldChange("section2Title", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Text
              </label>
              <textarea
                value={culinaryData.section2Text}
                onChange={(e) =>
                  handleFieldChange("section2Text", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Image
              </label>
              <div className="flex items-center space-x-4">
                {culinaryData.section2Image && (
                  <div className="relative">
                    <img
                      src={
                        culinaryData.section2Image.startsWith("http")
                          ? culinaryData.section2Image
                          : `http://localhost:5000${culinaryData.section2Image}`
                      }
                      alt="Section 2"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload("section2Image", file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="mt-8 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Main Section Title</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Culinary Section Title
          </label>
          <input
            type="text"
            value={culinaryData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter main section title"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={saveCulinaryData}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Culinary Content"}
        </button>
      </div>
    </div>
  );
};

export default CulinaryEditor;
