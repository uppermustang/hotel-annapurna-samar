import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [copyright, setCopyright] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setContactEmail(data?.footer?.email || null);
          setPhone(data?.footer?.phone || null);
          setCopyright(data?.footer?.copyright || null);
        }
      } catch {}
    })();
  }, []);

  return (
    <footer className="bg-deep-blue text-white p-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3>Contact Us</h3>
            <p>Email: {contactEmail || "info@hotelannapurnasamar.com"}</p>
            <p>Phone: {phone || "+977-123-456-789"}</p>
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
          {copyright || "© 2025 Hotel Annapurna Samar. All rights reserved."}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
