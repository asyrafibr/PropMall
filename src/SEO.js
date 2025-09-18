import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { getAgent } from "./api/axiosApi";

export default function SeoAndPixelsProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getAgent();
        const { agent, domain } = res.data;

        // Merge agent and domain data
        setConfig({
          ...domain,
          agent,
        });
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
  }, []);

  // ---------------------- PIXELS ----------------------
  useEffect(() => {
    if (!config?.pixel) return;

    const { facebook, google_tag, google_analytics, tiktok, linkedin, xtwitter } =
      config.pixel;

    // --- Facebook Pixel ---
    facebook?.forEach((id) => {
      if (!id) return;
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq?.("init", id);
      window.fbq?.("track", "PageView");
    });

    // --- Google Tag Manager ---
    google_tag?.forEach((gtmId) => gtmId && TagManager.initialize({ gtmId }));

    // --- Google Analytics ---
    google_analytics?.forEach((gaId) => {
      if (!gaId) return;
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", gaId);
    });

    // --- TikTok Pixel ---
    tiktok?.forEach((id) => {
      if (!id) return;
      (function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        const ttq = (w[t] = w[t] || []);
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off"];
        ttq.methods.forEach((m) => (ttq[m] = function () {}));
        const n = d.createElement("script");
        n.async = true;
        n.src = `https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${id}&lib=${t}`;
        d.head.appendChild(n);
      })(window, document, "ttq");
      window.ttq?.load(id);
      window.ttq?.page();
    });

    // --- LinkedIn ---
    linkedin?.forEach((id) => {
      if (!id) return;
      window._linkedin_partner_id = id;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(id);
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      document.head.appendChild(s);
    });

    // --- Twitter Pixel ---
    xtwitter?.forEach((id) => {
      if (!id) return;
      (function (e, t, n, s, u, a) {
        if (!e.twq) {
          s = (e.twq = function () {
            s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
          });
          s.version = "1.1";
          s.queue = [];
          u = t.createElement(n);
          u.async = true;
          u.src = "https://static.ads-twitter.com/uwt.js";
          a = t.getElementsByTagName(n)[0];
          a.parentNode.insertBefore(u, a);
        }
      })(window, document, "script");
      window.twq?.("init", id);
      window.twq?.("track", "PageView");
    });
  }, [config]);

  // ---------------------- SEO & OG ----------------------
  useEffect(() => {
    if (!config) return;

    const title = config.agent?.domain || config.domain || "My Website";
    const description = `Welcome to ${config.agent?.domain || config.name || "My Website"}`;
    const url = window.location.href;
    const image = config.agent?.photo || config.logo || "https://via.placeholder.com/1200x630.png";

    // --- Basic Meta ---
    document.title = title;

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setMeta("description", description);
    setMeta("keywords", "real estate, property, listings");

    // --- OpenGraph ---
    const ogTags = {
      "og:title": title,
      "og:description": description,
      "og:type": "website",
      "og:url": url,
      "og:image": image,
    };
    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // --- JSON-LD Structured Data ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: title,
      url: url,
      description: description,
    };
    let ldScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(jsonLd);
  }, [config]);

  return children || null;
}
