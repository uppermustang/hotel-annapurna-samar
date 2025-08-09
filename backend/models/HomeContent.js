const mongoose = require("mongoose");

const homeContentSchema = new mongoose.Schema(
  {
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
    // Rooms configuration for Rooms page
    rooms: {
      title: { type: String, default: "Our Rooms" },
      items: [
        {
          title: { type: String, default: "King Bed • Mountain View" },
          beds: { type: String, default: "1 King" },
          view: { type: String, default: "Mountain View" },
          capacity: { type: Number, default: 2 },
          tags: { type: [String], default: ["Suitable for children"] },
          images: { type: [String], default: [] },
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
      callCta: { type: String, default: "\ud83d\udcde Call: +977-123-456-789" },
      chatCta: { type: String, default: "\ud83d\udcac Live Chat Support" },
      emailCta: {
        type: String,
        default: "\ud83d\udce7 Email: info@hotelannapurna.com",
      },
    },
    footer: {
      email: { type: String, default: "info@hotelannapurnasamar.com" },
      phone: { type: String, default: "+977-123-456-789" },
      newsletterPlaceholder: {
        type: String,
        default: "Subscribe to Newsletter",
      },
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
    // New hero background configuration
    heroBackground: {
      type: {
        type: String,
        enum: ["image", "video", "youtube"],
        default: "image",
      },
      src: { type: String, default: "" }, // image path, video path, or YouTube URL
      loop: { type: Boolean, default: true },
      muted: { type: Boolean, default: true },
      poster: { type: String, default: "" }, // optional poster image for videos
    },
    // Existing subscribe section
    subscribe: {
      title: { type: String, default: "Stay Connected" },
      subtitle: {
        type: String,
        default:
          "Get exclusive updates about our seasonal experiences, special offers, and the latest from the heart of the Himalayas delivered straight to your inbox.",
      },
      placeholder: { type: String, default: "Enter your email address" },
      buttonText: { type: String, default: "Subscribe" },
      disclaimer: {
        type: String,
        default:
          "\ud83d\udd12 We respect your privacy. Unsubscribe at any time.",
      },
      theme: { type: String, default: "light" }, // 'light' | 'dark'
      benefits: [
        {
          icon: { type: String, default: "\ud83d\udce7" },
          image: { type: String, default: "" },
          title: { type: String, default: "Weekly Updates" },
          description: {
            type: String,
            default: "Stay informed about our latest offerings",
          },
        },
        {
          icon: { type: String, default: "\ud83c\udf81" },
          image: { type: String, default: "" },
          title: { type: String, default: "Exclusive Offers" },
          description: {
            type: String,
            default: "Special deals for our subscribers only",
          },
        },
        {
          icon: { type: String, default: "\ud83c\udfd4\ufe0f" },
          image: { type: String, default: "" },
          title: { type: String, default: "Mountain Stories" },
          description: {
            type: String,
            default: "Behind-the-scenes from the Himalayas",
          },
        },
      ],
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
