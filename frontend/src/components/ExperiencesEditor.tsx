import React, { useState, useEffect } from "react";
import axios from "axios";

interface Experience {
  _id?: string;
  title: string;
  description: string;
  image?: string;
}

interface ExperiencesData {
  title: string;
  items: Experience[];
}

const ExperiencesEditor: React.FC = () => {
  const [experiencesData, setExperiencesData] = useState<ExperiencesData>({
    title: "Unique Experiences",
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/home");
      if (response.data?.experiences) {
        setExperiencesData(response.data.experiences);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  const handleTitleChange = (title: string) => {
    setExperiencesData(prev => ({ ...prev, title }));
  };

  const addExperience = () => {
    setExperiencesData(prev => ({
      ...prev,
      items: [...prev.items, { title: "", description: "", image: "" }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setExperiencesData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeExperience = (index: number) => {
    setExperiencesData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      
      const response = await axios.post("http://localhost:5000/api/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data[0]) {
        const imagePath = response.data[0].path;
        updateExperience(index, "image", imagePath);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image");
    }
  };

  const saveExperiences = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/home", {
        experiences: experiencesData
      });
      
      if (response.status === 200) {
        setMessage("Experiences saved successfully!");
      }
    } catch (error) {
      console.error("Error saving experiences:", error);
      setMessage("Failed to save experiences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Experiences Editor</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Title
        </label>
        <input
          type="text"
          value={experiencesData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter section title"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Experience Items</h3>
          <button
            onClick={addExperience}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Experience
          </button>
        </div>

        {experiencesData.items.map((experience, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Experience {index + 1}</h4>
              <button
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter experience title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter experience description"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="flex items-center space-x-4">
                {experience.image && (
                  <div className="relative">
                    <img
                      src={experience.image.startsWith("http") ? experience.image : `http://localhost:5000${experience.image}`}
                      alt={experience.title}
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
                      handleImageUpload(index, file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveExperiences}
        disabled={loading}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Experiences"}
      </button>
    </div>
  );
};

export default ExperiencesEditor;
