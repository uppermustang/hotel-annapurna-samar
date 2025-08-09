import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import BookingModal from "./BookingModal";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const computeScrolled = () =>
      location.pathname !== "/" ? true : window.scrollY > 50;
    const handleScroll = () => setIsScrolled(computeScrolled());

    setIsScrolled(computeScrolled());
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const openBookingModal = () => {
    setIsBookingModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg text-gray-800"
            : "bg-transparent text-white"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold">
              <Link
                to="/"
                onClick={handleHomeClick}
                className={`hover:text-vibrant-pink transition-colors ${
                  isScrolled ? "text-deep-blue" : "text-white"
                }`}
              >
                🏔️ Hotel Annapurna Samar
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                onClick={handleHomeClick}
                className={`font-medium hover:text-vibrant-pink transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-vibrant-pink"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                Home
              </Link>
              <Link
                to="/history"
                className={`font-medium hover:text-vibrant-pink transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-vibrant-pink"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                History
              </Link>
              <Link
                to="/blog"
                className={`font-medium hover:text-vibrant-pink transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-vibrant-pink"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                Blog
              </Link>
              <Link
                to="/rooms"
                className={`font-medium hover:text-vibrant-pink transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-vibrant-pink"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                Rooms
              </Link>
              <Link
                to="/admin"
                className={`font-medium hover:text-vibrant-pink transition-colors ${
                  isScrolled
                    ? "text-gray-700 hover:text-vibrant-pink"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                Admin
              </Link>
            </nav>

            {/* Book Now Button - Desktop */}
            <button
              onClick={openBookingModal}
              className={`hidden md:block font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                isScrolled
                  ? "bg-vibrant-pink text-white hover:bg-warm-red focus:ring-vibrant-pink shadow-lg"
                  : "bg-white text-vibrant-pink hover:bg-yellow-300 hover:text-gray-800 focus:ring-white border-2 border-white shadow-xl"
              }`}
            >
              📞 Book Now
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } ${
            isScrolled
              ? "bg-white shadow-lg"
              : "bg-black bg-opacity-90 backdrop-blur-sm"
          }`}
        >
          <nav className="container mx-auto px-4 py-6 space-y-4">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              History
            </Link>
            <Link
              to="/blog"
              className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/rooms"
              className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rooms
            </Link>
            <Link
              to="/admin"
              className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>

            {/* Mobile Book Now Button */}
            <button
              onClick={openBookingModal}
              className="w-full bg-vibrant-pink text-white font-bold py-4 px-6 rounded-lg hover:bg-warm-red transition-colors focus:outline-none focus:ring-4 focus:ring-vibrant-pink focus:ring-opacity-50 mt-4"
            >
              📞 Book Now - Save 25%
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer to prevent content overlap when header becomes solid */}
      {isScrolled && <div className="h-20"></div>}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default Header;
