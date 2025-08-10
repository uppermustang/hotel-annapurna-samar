import React, { useState } from "react";
import MediaUpload from "./MediaUpload";
import Reports from "./Reports";
import Bookings from "./Bookings";
import Calendar from "./Calender";
import BlogEditor from "./BlogEditor";
import PageEditor from "./PageEditor";
import ExperiencesEditor from "./ExperiencesEditor";
import CulinaryEditor from "./CulinaryEditor";
import ClientManagement from "./ClientManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("media");

  const tabs = [
    { id: "media", label: "Media", component: MediaUpload },
    { id: "reports", label: "Reports", component: Reports },
    { id: "bookings", label: "Bookings", component: Bookings },
    { id: "calendar", label: "Calendar", component: Calendar },
    { id: "blog", label: "Blog", component: BlogEditor },
    { id: "page-editor", label: "Page Editor", component: PageEditor },
    { id: "experiences", label: "Experiences", component: ExperiencesEditor },
    { id: "culinary", label: "Culinary", component: CulinaryEditor },
    {
      id: "client-management",
      label: "Client Management",
      component: ClientManagement,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || MediaUpload;

  return (
    <div className="p-6 mt-20">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminDashboard;
