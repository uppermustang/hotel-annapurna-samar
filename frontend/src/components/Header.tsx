import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import BookingModal from "./BookingModal";

interface SiteConfig {
  branding: {
    logo: string;
    textLogo: string;
    favicon: string;
    showLogo: boolean;
    showTextLogo: boolean;
    logoMaxHeight?: number;
    logoMaxWidth?: number;
  };
  navigation: {
    items: Array<{
      id: string;
      text: string;
      url: string;
      order: number;
      isActive: boolean;
    }>;
  };
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    branding: {
      logo: "/himalayas-bg.jpg",
      textLogo: "🏔️ Hotel Annapurna Samar",
      favicon: "/favicon.ico",
      showLogo: true,
      showTextLogo: true,
      logoMaxHeight: 40,
      logoMaxWidth: 100,
    },
    navigation: {
      items: [
        { id: "home", text: "Home", url: "/", order: 1, isActive: true },
        {
          id: "history",
          text: "History",
          url: "/history",
          order: 2,
          isActive: true,
        },
        { id: "blog", text: "Blog", url: "/blog", order: 3, isActive: true },
        { id: "rooms", text: "Rooms", url: "/rooms", order: 4, isActive: true },
        { id: "admin", text: "Admin", url: "/admin", order: 5, isActive: true },
      ],
    },
  });
  const location = useLocation();

  useEffect(() => {
    const loadSiteConfig = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/site-config");
        if (response.ok) {
          const config = await response.json();
          if (config && Object.keys(config).length > 0) {
            // Ensure backward compatibility with existing configs
            const updatedConfig = {
              ...config,
              branding: {
                ...config.branding,
                showLogo:
                  config.branding.showLogo !== undefined
                    ? config.branding.showLogo
                    : true,
                showTextLogo:
                  config.branding.showTextLogo !== undefined
                    ? config.branding.showTextLogo
                    : true,
              },
            };
            setSiteConfig(updatedConfig);
          }
        }
      } catch (error) {
        console.log("Using default site configuration");
      }
    };

    loadSiteConfig();
  }, []);

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

  // Get active navigation items
  const activeNavItems = siteConfig.navigation.items.filter(
    (item) => item.isActive
  );

  // Helper function to get logo URL
  const getLogoUrl = (logoPath: string) => {
    if (!logoPath) return "";

    // If it's already a full URL, return as is
    if (logoPath.startsWith("http")) return logoPath;

    // If it's a relative path starting with /uploads, make it absolute
    if (logoPath.startsWith("/uploads"))
      return `http://localhost:5000${logoPath}`;

    // For other relative paths, assume they're from the public folder
    return logoPath;
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
            <div className="flex items-center">
              {siteConfig.branding.showLogo && siteConfig.branding.logo && (
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className="mr-3 flex-shrink-0"
                >
                  <img
                    src={getLogoUrl(siteConfig.branding.logo)}
                    alt="Logo"
                    className="w-auto object-contain border border-gray-200 rounded shadow-sm"
                    style={{
                      maxHeight: `${siteConfig.branding.logoMaxHeight || 40}px`,
                      minHeight: "32px",
                      maxWidth: `${siteConfig.branding.logoMaxWidth || 100}px`,
                      minWidth: "40px",
                    }}
                    onError={(e) => {
                      console.error(
                        "Logo failed to load:",
                        siteConfig.branding.logo
                      );
                      console.error(
                        "Logo URL attempted:",
                        getLogoUrl(siteConfig.branding.logo)
                      );
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={(e) => {
                      console.log(
                        "Logo loaded successfully:",
                        getLogoUrl(siteConfig.branding.logo)
                      );
                      console.log(
                        "Logo dimensions:",
                        e.currentTarget.naturalWidth,
                        "x",
                        e.currentTarget.naturalHeight
                      );
                    }}
                  />
                  {/* Fallback text if logo fails to load */}
                  <div
                    className="text-sm text-gray-500 hidden"
                    id="logo-fallback"
                  >
                    Logo failed to load
                  </div>
                </Link>
              )}
              {siteConfig.branding.showTextLogo && (
                <div className="text-xl md:text-2xl font-bold">
                  <Link
                    to="/"
                    onClick={handleHomeClick}
                    className={`hover:text-vibrant-pink transition-colors ${
                      isScrolled ? "text-deep-blue" : "text-white"
                    }`}
                  >
                    {siteConfig.branding.textLogo}
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {activeNavItems
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={item.id === "home" ? handleHomeClick : undefined}
                    className={`font-medium hover:text-vibrant-pink transition-colors ${
                      isScrolled
                        ? "text-gray-700 hover:text-vibrant-pink"
                        : "text-white hover:text-yellow-300"
                    }`}
                  >
                    {item.text}
                  </Link>
                ))}
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
              Book Now
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
            {activeNavItems
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={() => {
                    if (item.id === "home") {
                      handleHomeClick({} as React.MouseEvent);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`block text-lg font-medium hover:text-vibrant-pink transition-colors ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {item.text}
                </Link>
              ))}

            {/* Mobile Book Now Button */}
            <button
              onClick={openBookingModal}
              className="w-full bg-vibrant-pink text-white font-bold py-4 px-6 rounded-lg hover:bg-warm-red transition-colors focus:outline-none focus:ring-4 focus:ring-vibrant-pink focus:ring-opacity-50 mt-4"
            >
              Book Now - Save 25%
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
