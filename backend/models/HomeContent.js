const mongoose = require("mongoose");

const homeContentSchema = new mongoose.Schema({
  trustBadges: {
    subtitle: {
      type: String,
      default: "Trusted by 2,500+ guests from around the world",
    },
    brands: [
      {
        name: { type: String, default: "" },
        logo: { type: String, default: "" },
      },
    ],
  },
  experiences: {
    title: { type: String, default: "Unique Experiences" },
    items: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
  },
  socialProof: {
    heading: { type: String, default: "Join 2,500+ Happy Guests" },
    subheading: {
      type: String,
      default:
        "See what our guests are saying about their unforgettable experiences",
    },
  },
  culinary: {
    title: { type: String, default: "Culinary Excellence" },
    section1Title: { type: String, default: "Traditional Nepali Cuisine" },
    section1Text: {
      type: String,
      default:
        "Experience authentic flavors of Nepal with our carefully crafted menu featuring traditional dishes made from locally sourced ingredients.",
    },
    section1Image: { type: String, default: "" },
    section2Title: { type: String, default: "International Flavors" },
    section2Text: {
      type: String,
      default:
        "Our international menu offers a variety of cuisines to satisfy every palate, prepared by our experienced chefs.",
    },
    section2Image: { type: String, default: "" },
  },
  testimonials: {
    title: { type: String, default: "What Our Guests Say" },
    items: [
      {
        name: { type: String, default: "" },
        location: { type: String, default: "" },
        text: { type: String, default: "" },
        rating: { type: Number, default: 5, min: 1, max: 5 },
      },
    ],
  },
  faq: {
    title: { type: String, default: "Frequently Asked Questions" },
    subtitle: {
      type: String,
      default:
        "Got questions? We've got answers! Here are the most common questions our guests ask.",
    },
    callCta: { type: String, default: "📞 Call: +977-123-456-789" },
    chatCta: { type: String, default: "💬 Live Chat Support" },
    emailCta: { type: String, default: "📧 Email: info@hotelannapurna.com" },
  },
  footer: {
    email: { type: String, default: "info@hotelannapurnasamar.com" },
    phone: { type: String, default: "+977-123-456-789" },
    newsletterPlaceholder: { type: String, default: "Subscribe to Newsletter" },
    copyright: {
      type: String,
      default: "© 2025 Hotel Annapurna Samar. All rights reserved.",
    },
    social: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  map: {
    title: { type: String, default: "Find Us" },
    subtitle: { type: String, default: "Hotel Annapurna" },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HomeContent", homeContentSchema);
