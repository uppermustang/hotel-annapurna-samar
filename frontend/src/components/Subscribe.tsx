import React, { useEffect, useMemo, useState } from "react";

interface SubscribeBenefit {
  icon: string;
  title: string;
  description: string;
}

interface SubscribeContent {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  disclaimer: string;
  theme: "light" | "dark";
  benefits: SubscribeBenefit[];
}

const DEFAULT_SUBSCRIBE: SubscribeContent = {
  title: "Stay Connected",
  subtitle:
    "Get exclusive updates about our seasonal experiences, special offers, and the latest from the heart of the Himalayas delivered straight to your inbox.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  disclaimer: "🔒 We respect your privacy. Unsubscribe at any time.",
  theme: "light",
  benefits: [
    {
      icon: "📧",
      title: "Weekly Updates",
      description: "Stay informed about our latest offerings",
    },
    {
      icon: "🎁",
      title: "Exclusive Offers",
      description: "Special deals for our subscribers only",
    },
    {
      icon: "🏔️",
      title: "Mountain Stories",
      description: "Behind-the-scenes from the Himalayas",
    },
  ],
};

const Subscribe: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [content, setContent] = useState<SubscribeContent>(DEFAULT_SUBSCRIBE);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          if (data?.subscribe) {
            // Merge defaults with stored content to avoid undefineds
            setContent({ ...DEFAULT_SUBSCRIBE, ...data.subscribe });
          }
        }
      } catch (e) {
        // Fallback to defaults silently
      }
    })();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1000);
  };

  const isDark = content.theme === "dark";

  const sectionClass = useMemo(
    () =>
      isDark
        ? "py-20 bg-gradient-to-r from-deep-blue via-forest-green to-deep-blue relative overflow-hidden"
        : "py-16 bg-white relative overflow-hidden",
    [isDark]
  );

  const cardClass = useMemo(
    () =>
      isDark
        ? "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        : "bg-white rounded-2xl p-8 border border-gray-200 shadow-sm",
    [isDark]
  );

  const headingClass = isDark
    ? "text-4xl md:text-5xl font-bold text-white mb-6"
    : "text-4xl md:text-5xl font-bold text-deep-blue mb-6";

  const subTextClass = isDark
    ? "text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
    : "text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed";

  const inputClass = isDark
    ? "w-full px-6 py-4 text-gray-800 bg-white rounded-xl border-0 focus:ring-2 focus:ring-vibrant-pink focus:outline-none text-lg shadow-lg hover:shadow-xl transition-all duration-300"
    : "w-full px-6 py-4 text-gray-800 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-vibrant-pink focus:outline-none text-lg shadow-sm hover:shadow transition-all duration-300";

  const buttonClass = isDark
    ? "px-8 py-4 bg-vibrant-pink hover:bg-warm-red disabled:bg-gray-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg disabled:shadow-none"
    : "px-8 py-4 bg-vibrant-pink hover:bg-warm-red disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors duration-200 shadow";

  return (
    <section className={sectionClass}>
      {/* Background decorative elements (subtle on light theme) */}
      <div
        className={
          isDark
            ? "absolute inset-0 opacity-10"
            : "absolute inset-0 opacity-[.04]"
        }
      >
        <div className="absolute top-0 left-0 w-72 h-72 bg-vibrant-pink rounded-full -translate-x-1/2 -translate-y-1/2 animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-warm-red rounded-full translate-x-1/2 translate-y-1/2 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-forest-green rounded-full -translate-x-1/2 -translate-y-1/2 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className={headingClass}>{content.title}</h2>
          <p className={subTextClass}>{content.subtitle}</p>
        </div>

        <div className={`${cardClass} animate-mapLoad`}>
          {isSubscribed ? (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3
                className={
                  isDark
                    ? "text-2xl font-bold text-white mb-2"
                    : "text-2xl font-bold text-deep-blue mb-2"
                }
              >
                Welcome to Our Community!
              </h3>
              <p className={isDark ? "text-gray-200" : "text-gray-600"}>
                Thank you for subscribing. You'll receive our first update soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.placeholder}
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={buttonClass}
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    content.buttonText
                  )}
                </button>
              </div>

              <div className="text-center">
                <p
                  className={
                    isDark ? "text-sm text-gray-300" : "text-sm text-gray-500"
                  }
                >
                  {content.disclaimer}
                </p>
              </div>
            </form>
          )}
        </div>

        {content.benefits && content.benefits.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {content.benefits.map((b, idx) => (
              <div
                key={idx}
                className="text-center animate-fadeIn"
                style={{ animationDelay: `${0.2 * (idx + 1)}s` }}
              >
                <div className={`${isDark ? "text-white" : "text-deep-blue"}`}>
                  <div
                    className={`w-16 h-16 ${
                      isDark ? "bg-white/20" : "bg-gray-100"
                    } rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p
                    className={
                      isDark ? "text-gray-300 text-sm" : "text-gray-600 text-sm"
                    }
                  >
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Subscribe;
