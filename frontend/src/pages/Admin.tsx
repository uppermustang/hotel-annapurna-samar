import React, { useState } from "react";
import HeroSectionManager from "../components/HeroSectionManager";
import RoomsManager from "../components/RoomsManager";
import MediaLibrary from "../components/MediaLibrary";
import ClientManagement from "../components/ClientManagement";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("hero");

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "rooms", label: "Rooms" },
    { id: "experiences", label: "Experiences" },
    { id: "testimonials", label: "Testimonials" },
    { id: "media", label: "Media Gallery" },
    { id: "client-management", label: "Client Management" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? "border-vibrant-pink text-vibrant-pink"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "hero" && <HeroSectionManager />}
          {activeTab === "rooms" && <RoomsManager />}
          {activeTab === "media" && <MediaLibrary />}
          {activeTab === "client-management" && <ClientManagement />}
          {/* Add other tab contents here */}
        </div>
      </main>
    </div>
  );
};

export default Admin;
