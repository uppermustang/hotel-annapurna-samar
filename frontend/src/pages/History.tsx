import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const History: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="py-16 flex-1">
        <section className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-deep-blue mb-6">Our History</h1>
          <p className="text-gray-700 max-w-3xl">
            Discover the story of Hotel Annapurna Samar — the first and oldest lodge in the village. This page can
            include milestones, photos, timelines, and the heritage of the region. You can expand this content later.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default History;
