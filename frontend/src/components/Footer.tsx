import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-deep-blue text-white p-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-forest-green bg-opacity-50 p-4 mb-6 rounded-lg">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Subscribe to Newsletter"
            className="p-2 w-full md:w-1/2 bg-white text-gray-800 rounded border-2 border-gray-300 focus:border-vibrant-pink focus:outline-none"
          />
          <button className="bg-vibrant-pink p-2 mt-2 w-full md:w-auto">
            Subscribe
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3>Contact Us</h3>
            <p>Email: info@hotelannapurnasamar.com</p>
            <p>Phone: +977-123-456-789</p>
          </div>
          <div>
            <h3>Links</h3>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h3>Follow Us</h3>
            <div className="flex space-x-4">
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
        <p className="text-center mt-4">
          &copy; 2025 Hotel Annapurna Samar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
