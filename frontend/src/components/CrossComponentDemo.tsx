import React, { useState, useEffect } from 'react';
import { useClientManagement } from '../hooks/useClientManagement';
import { Guest } from '../types/client';
import { FaCrown, FaUser, FaStar, FaHeart, FaCalendarAlt, FaBed, FaCamera } from 'react-icons/fa';

const CrossComponentDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'rooms' | 'hero' | 'gallery'>('overview');
  const [roomsGuests, setRoomsGuests] = useState<Guest[]>([]);
  const [heroGuests, setHeroGuests] = useState<Guest[]>([]);
  const [galleryGuests, setGalleryGuests] = useState<Guest[]>([]);
  
  const { 
    guests, 
    getGuestsForRooms, 
    getGuestsForHero, 
    getGuestsForGallery 
  } = useClientManagement();

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const [rooms, hero, gallery] = await Promise.all([
          getGuestsForRooms(),
          getGuestsForHero(),
          getGuestsForGallery()
        ]);
        setRoomsGuests(rooms);
        setHeroGuests(hero);
        setGalleryGuests(gallery);
      } catch (error) {
        console.error('Error loading guests:', error);
      }
    };
    
    loadGuests();
  }, [getGuestsForRooms, getGuestsForHero, getGuestsForGallery]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cross-Component Integration Demo
          </h1>
          <p className="text-gray-600">
            See how the client management system connects across Rooms, Hero, and Gallery components
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'overview'
                  ? 'bg-deep-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('rooms')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'rooms'
                  ? 'bg-deep-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaBed className="inline mr-2" />
              Rooms Integration
            </button>
            <button
              onClick={() => setActiveSection('hero')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'hero'
                  ? 'bg-deep-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaHeart className="inline mr-2" />
              Hero Integration
            </button>
            <button
              onClick={() => setActiveSection('gallery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === 'gallery'
                  ? 'bg-deep-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaCamera className="inline mr-2" />
              Gallery Integration
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Guests Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-deep-blue">{guests.length}</div>
                <FaUser className="text-4xl text-blue-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Guests</h3>
              <p className="text-gray-600 text-sm">
                Registered guests in the client management system
              </p>
            </div>

            {/* VIP Guests Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-yellow-500">
                  {guests.filter(g => g.loyaltyPoints > 1000).length}
                </div>
                <FaCrown className="text-4xl text-yellow-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">VIP Guests</h3>
              <p className="text-gray-600 text-sm">
                Guests with 1000+ loyalty points
              </p>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-green-500">
                  {guests.filter(g => g.lastVisit).length}
                </div>
                <FaCalendarAlt className="text-4xl text-green-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Visitors</h3>
              <p className="text-gray-600 text-sm">
                Guests with recent visit history
              </p>
            </div>
          </div>
        )}

        {activeSection === 'rooms' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                <FaBed className="inline mr-2 text-deep-blue" />
                Rooms Component Integration
              </h2>
              <p className="text-gray-600 mb-6">
                The Rooms component now displays guest preferences, VIP status, and personalized room recommendations.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomsGuests.slice(0, 6).map((guest) => (
                  <div key={guest._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{guest.name}</h4>
                      {guest.loyaltyPoints > 1000 && (
                        <FaCrown className="text-yellow-500" title="VIP Guest" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Preferred Room: {guest.preferences?.roomType || 'Any'}</p>
                      <p>Loyalty Points: {guest.loyaltyPoints}</p>
                      {guest.lastVisit && (
                        <p>Last Visit: {new Date(guest.lastVisit).toLocaleDateString()}</p>
                      )}
                      {guest.preferences?.specialRequests && (
                        <p className="text-xs text-gray-500">
                          Special Requests: {guest.preferences.specialRequests}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'hero' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                <FaHeart className="inline mr-2 text-deep-blue" />
                Hero Section Integration
              </h2>
              <p className="text-gray-600 mb-6">
                The Hero section now displays VIP guests and recent guest activity as overlays.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* VIP Guests Panel */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                    <FaCrown className="mr-2" />
                    VIP Guests Display
                  </h3>
                  <div className="space-y-3">
                    {heroGuests.filter(g => g.loyaltyPoints > 1000).slice(0, 3).map((guest) => (
                      <div key={guest._id} className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                        <div className="flex items-center">
                          <FaUser className="text-yellow-600 mr-2" />
                          <span className="font-medium">{guest.name}</span>
                        </div>
                        <span className="text-yellow-700 font-bold">
                          {guest.loyaltyPoints} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Panel */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Recent Activity Display
                  </h3>
                  <div className="space-y-3">
                    {heroGuests.filter(g => g.lastVisit).slice(0, 3).map((guest) => (
                      <div key={guest._id} className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <FaHeart className="text-blue-600 mr-2" />
                          <span className="font-medium">{guest.name}</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          Last visit: {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                <FaCamera className="inline mr-2 text-deep-blue" />
                Gallery Component Integration
              </h2>
              <p className="text-gray-600 mb-6">
                The Gallery component now shows guest-generated content, VIP badges, and guest information overlays.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Guest Content Stats */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    Guest Content Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Total Guest Content:</span>
                      <span className="font-bold text-green-800">
                        {guests.filter(g => g.loyaltyPoints > 500).length} items
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">VIP Content:</span>
                      <span className="font-bold text-green-800">
                        {galleryGuests.length} items
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Content Contributors:</span>
                      <span className="font-bold text-green-800">
                        {guests.filter(g => g.loyaltyPoints > 1000).length} guests
                      </span>
                    </div>
                  </div>
                </div>

                {/* VIP Content Examples */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">
                    VIP Content Examples
                  </h3>
                  <div className="space-y-3">
                    {galleryGuests.slice(0, 3).map((guest) => (
                      <div key={guest._id} className="bg-white/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FaUser className="text-purple-600 mr-2" />
                            <span className="font-medium">{guest.name}</span>
                          </div>
                          <FaCrown className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-purple-700">
                          <p>Loyalty Points: {guest.loyaltyPoints}</p>
                          <p>Total Bookings: {guest.totalBookings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossComponentDemo;
