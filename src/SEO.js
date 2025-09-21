import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { getAgent } from "./api/axiosApi";

const setMetaTag = (attr, key, value) => {
  if (!value) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

const SEO = ({ title, description, image, url, children }) => {
  const [config, setConfig] = useState(null);

  // --- Fetch agent/domain config ---
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getAgent();
        const { agent, domain, ...rest } = res.data;

        // merge domain + agent data into config
        setConfig({
          ...rest,
          domain,
          agent,
        });
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    console.log("TEST", config);
  }, [config]);

  // --- Pixels (same as before) ---
  useEffect(() => {
    if (!config?.pixel) return;
    const {
      facebook,
      google_tag,
      google_analytics,
      tiktok,
      linkedin,
      xtwitter,
    } = config.pixel;

    // Facebook Pixel
    facebook?.forEach((id) => {
      if (!id) return;
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
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
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      window.fbq?.("init", id);
      window.fbq?.("track", "PageView");
    });

    // Google Tag Manager
    google_tag?.forEach((gtmId) => gtmId && TagManager.initialize({ gtmId }));

    // Google Analytics
    google_analytics?.forEach((gaId) => {
      if (!gaId) return;
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", gaId);
    });

    // TikTok Pixel
    tiktok?.forEach((id) => {
      if (!id) return;
      (function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        const ttq = (w[t] = w[t] || []);
        ttq.methods = [
          "page",
          "track",
          "identify",
          "instances",
          "debug",
          "on",
          "off",
        ];
        ttq.methods.forEach((m) => (ttq[m] = function () {}));
        const n = d.createElement("script");
        n.async = true;
        n.src = `https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${id}&lib=${t}`;
        d.head.appendChild(n);
      })(window, document, "ttq");
      window.ttq?.load(id);
      window.ttq?.page();
    });

    // LinkedIn
    linkedin?.forEach((id) => {
      if (!id) return;
      window._linkedin_partner_id = id;
      window._linkedin_data_partner_ids =
        window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(id);
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      document.head.appendChild(s);
    });

    // Twitter Pixel
    xtwitter?.forEach((id) => {
      if (!id) return;
      (function (e, t, n, s, u, a) {
        if (!e.twq) {
          s = e.twq = function () {
            s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
          };
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

  // --- SEO Tags ---
  useEffect(() => {
    if (!config) return;

    const agent = config.agent || {};
    const siteTitle = title || agent.domain || config.domain || "My Website";
    const siteDescription =
      description ||
      `${agent.name} (${agent.reg_no}) from ${agent.agency_name}`;
    const siteUrl = url || window.location.href;
    const siteImage =
      image ||
      agent.photo ||
      "https://myhartanah.co/assets/img/logo-propmall-500x500-web-icon.jpg";

    // --- Title ---
    document.title = siteTitle;

    let titleTag = document.querySelector("title");
    if (!titleTag) {
      titleTag = document.createElement("title");
      document.head.appendChild(titleTag);
    }
    titleTag.textContent = siteTitle;
    // --- Basic Meta ---
    setMetaTag("name", "description", siteDescription);
    setMetaTag("name", "keywords", "real estate, property, listings");

    // --- Business / Author Info ---
    setMetaTag("name", "customer", config.agent.agency_name);
    setMetaTag("name", "customer-website", config.domain.name);
    setMetaTag("name", "copyright", config.agent.agency_name);
    setMetaTag("name", "generator", config.agent.agency_name);
    setMetaTag("name", "author", config.agent.name);
    setMetaTag("name", "author-email", config.agent.email);
    setMetaTag("name", "author-phone", `+${config.agent.phone}`);
    setMetaTag("name", "website", `http://${config.agent.domain}`);
    setMetaTag("name", "website", `http://${config.agent.domain}`);
    setMetaTag("name", "email", config.agent.email);
    setMetaTag("name", "distribution", "global");
    setMetaTag("name", "rating", "general");
    setMetaTag("name", "robots", "ALL");

    setMetaTag("name", "description", siteDescription);

    // --- OpenGraph (Facebook) ---

    setMetaTag("property", "og:title", siteTitle);
    setMetaTag("property", "og:description", siteDescription);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", siteUrl);
    setMetaTag("property", "og:image", siteImage);

    if (config?.fb_app_id) {
      setMetaTag("property", "fb:app_id", config.fb_app_id);
    }
    if (config?.fb_page_id) {
      setMetaTag("property", "fb:pages", config.fb_page_id);
    }

    // --- Twitter ---
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", siteTitle);
    setMetaTag("name", "twitter:description", siteDescription);
    setMetaTag("name", "twitter:image", siteImage);

    // --- JSON-LD (Agent / Person) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: agent.name,
      jobTitle: agent.title,
      image: agent.photo,
      email: agent.email,
      telephone: `+${agent.phone}`,
      worksFor: {
        "@type": "Organization",
        name: agent.agency_name,
        url: `http://${config.domain}`,
        address: agent.agency_address,
      },
      identifier: agent.reg_no,
    };

    let ldScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(jsonLd);
  }, [title, description, image, url, config]);

  return children || null;
};

export default SEO;
