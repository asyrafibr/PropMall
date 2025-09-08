// src/components/Footer.js
import React from "react";
import { useTemplate } from "../context/TemplateContext";
import agentBoxbg from "../image/Template2_Sky_Footer.png";
import bg3 from "../image/bg3.png";
import bg4 from "../image/footer4.png";

const Footer = () => {
  const { mainAgent, template } = useTemplate();

  const renderByTemplate = () => {
    switch (template) {
      case "template1":
        return (
          <footer className="p-3" style={{ backgroundColor: "#DDC9B0" }}>
            {/* Top row */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 gap-2">
              {/* Agent name first in JSX, stays on top in mobile */}
              <div className="fw-bold fs-5 order-1 order-md-2 ms-md-auto">
                {mainAgent.name}
              </div>

              {/* Menu second in JSX, but moves left on desktop */}
              <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 order-2 order-md-1">
                <nav className="nav flex-column flex-md-row order-2 order-md-1 gap-2 gap-md-4">
                  <a href="/sale" className="nav-link text-dark p-0 fs-6">
                    Sale
                  </a>
                  <a href="/rent" className="nav-link text-dark p-0 fs-6">
                    Rent
                  </a>
                  <a href="/want-to-buy" className="nav-link text-dark p-0 fs-6">
                    Want To Buy
                  </a>
                  <a href="/want-to-rent" className="nav-link text-dark p-0 fs-6">
                    Want To Rent
                  </a>
                  <a href="/articles" className="nav-link text-dark p-0 fs-6">
                    Articles
                  </a>
                </nav>
              </div>
            </div>

            <hr className="border-dark my-2" />

            {/* Bottom row */}
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
              <div className="d-flex flex-wrap gap-3">
                <span className="text-decoration-none">
                  Terms and condition tab
                </span>
                <span className="text-decoration-none">Privacy policy tab</span>
              </div>
              <div>
                Copyright © {mainAgent.name} All Rights Reserved. Powered by
                PropMall.co
              </div>
            </div>
          </footer>
        );

      case "template2":
        return (
          <footer
            className="p-3"
            style={{
              backgroundImage: `url(${agentBoxbg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {/* Top row */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 gap-2">
              {/* Agent name first in JSX, stays on top in mobile */}
              <div className="fw-bold fs-5 order-1 order-md-2 ms-md-auto">
                {mainAgent.name}
              </div>

              {/* Menu second in JSX, but moves left on desktop */}
              <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 order-2 order-md-1">
                <nav className="nav flex-column flex-md-row order-2 order-md-1 gap-2 gap-md-4">
                  <a href="/sale" className="nav-link text-dark p-0">
                    Sale
                  </a>
                  <a href="/rent" className="nav-link text-dark p-0">
                    Rent
                  </a>
                  <a href="/want-to-buy" className="nav-link text-dark p-0">
                    Want To Buy
                  </a>
                  <a href="/want-to-rent" className="nav-link text-dark p-0">
                    Want To Rent
                  </a>
                  <a href="/articles" className="nav-link text-dark p-0">
                    Articles
                  </a>
                </nav>
              </div>
            </div>

            <hr className="border-dark my-2" />

            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
              <div className="d-flex flex-wrap gap-3">
                <span className="text-decoration-none">
                  Terms and condition tab
                </span>
                <span className="text-decoration-none">Privacy policy tab</span>
              </div>
              <div>
                Copyright © {mainAgent.name} All Rights Reserved. Powered by
                PropMall.co
              </div>
            </div>
          </footer>
        );

      case "template3":
        return (
          <footer
            className="p-3"
            style={{
              backgroundImage: `url(${bg3})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {/* Top row */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 gap-2">
              {/* Agent name first in JSX, stays on top in mobile */}
              <div className="fw-bold fs-5 order-1 order-md-2 ms-md-auto">
                {mainAgent.name}
              </div>

              {/* Menu second in JSX, but moves left on desktop */}
              <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 order-2 order-md-1">
                <nav className="nav flex-column flex-md-row order-2 order-md-1 gap-2 gap-md-4">
                  <a href="/sale" className="nav-link text-dark p-0">
                    Sale
                  </a>
                  <a href="/rent" className="nav-link text-dark p-0">
                    Rent
                  </a>
                  <a href="/want-to-buy" className="nav-link text-dark p-0">
                    Want To Buy
                  </a>
                  <a href="/want-to-rent" className="nav-link text-dark p-0">
                    Want To Rent
                  </a>
                  <a href="/articles" className="nav-link text-dark p-0">
                    Articles
                  </a>
                </nav>
              </div>
            </div>

            <hr className="border-dark my-2" />

            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
              <div className="d-flex flex-wrap gap-3">
                <span className="text-decoration-none">
                  Terms and condition tab
                </span>
                <span className="text-decoration-none">Privacy policy tab</span>
              </div>
              <div>
                Copyright © {mainAgent.name} All Rights Reserved. Powered by
                PropMall.co
              </div>
            </div>
          </footer>
        );

      case "template4":
        return (
          <footer
            className="p-3 text-white"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg4})`,
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "10% 10%",
            }}
          >
            {/* Top row */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 gap-2">
              {/* Agent name first in JSX, stays on top in mobile */}
              <div className="fw-bold fs-5 order-1 order-md-2 ms-md-auto">
                {mainAgent.name}
              </div>

              {/* Menu second in JSX, but moves left on desktop */}
              <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 order-2 order-md-1">
                <nav className="nav flex-column flex-md-row order-2 order-md-1 gap-2 gap-md-4">
                  <a href="/sale" className="nav-link text-dark p-0">
                    Sale
                  </a>
                  <a href="/rent" className="nav-link text-dark p-0">
                    Rent
                  </a>
                  <a href="/want-to-buy" className="nav-link text-dark p-0">
                    Want To Buy
                  </a>
                  <a href="/want-to-rent" className="nav-link text-dark p-0">
                    Want To Rent
                  </a>
                  <a href="/articles" className="nav-link text-dark p-0">
                    Articles
                  </a>
                </nav>
              </div>
            </div>

            <hr className="border-light my-2" />

            <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small">
              <div className="d-flex flex-wrap gap-3">
                <span className="text-decoration-none">
                  Terms and condition tab
                </span>
                <span className="text-decoration-none">Privacy policy tab</span>
              </div>
              <div>
                Copyright © {mainAgent.name} All Rights Reserved. Powered by
                PropMall.co
              </div>
            </div>
          </footer>
        );

      default:
        return <p>No template selected</p>;
    }
  };

  return <div>{renderByTemplate()}</div>;
};

export default Footer;
