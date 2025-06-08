import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../../components/FilterSection";
import AgentBox from "../../components/AgentBox";
import { useAuth } from "../../context/AuthContext";
import FeaturedListing from "../../components/FeaturedListingCard";
import {
  getLocations,
  getPriceYears,
  getListings,
  getAgent,
  getFeaturedList,
} from "../../api/axiosApi";

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [agent, setAgent] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("rent");

  // Fetch filter data on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const agentRes = await getAgent();
        setAgent(agentRes.data.agent);

        const feaListRes = await getFeaturedList();
        setFeaturedList(feaListRes.data.featured_search);
        console.error("\ filters:", featuredList);

        const locationRes = await getLocations();
        setLocations(locationRes.data.states); // id_state, state_name


      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
    }
  }, [locations.length]);

  const handleSearch = async () => {
    const locationId = selectedLocation || "1101"; // fallback
    const selectedLocationObj = locations.find(loc => loc.id_state === locationId);
    const locationName = selectedLocationObj?.state_name || "";

    const payload = {
      domain: "dev-agentv3.propmall.net",
      url_fe: "https://dev-agentv3.propmall.net",
      search: {
        page_num: 1,
        page_size: 10,
        search_text: searchTerm || "",
        search_fields: {
          title: true,
          description: true,
        },
        search_filters: {
          objective: {
            sale: activeTab === "sale",
            rent: activeTab === "rent",
            project: activeTab === "project",
          },
          location: {
            id_country: 1,
            id_province: [],
            id_state: locationId ? [parseInt(locationId)] : [],
            id_cities: [],
            id_area: [],
          },
          property_category: null,
          property_holding: null,
          property_lot_type: null,
          room: { min: null, max: null },
          bathroom: { min: null, max: null },
          price: { min: null, max: null },
        },
      },
    };

    try {
      const response = await getListings(payload);
      navigate("/search"
        , {

        state: {
          products: featuredList,
          selectedLocationName: locationName,
          selectedLocationId: locationId,
          searchType: activeTab,
          years,
        },
      });
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  return (
    <div>
      <Filters
        locations={locations}
        agent={agent}
        years={years}
        isLoggedIn={isLoggedIn}
        selectedLocation={selectedLocation}
        selectedYear={selectedYear}
        searchTerm={searchTerm}
        setSelectedLocation={setSelectedLocation}
        setSelectedYear={setSelectedYear}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Featured Listings Section */}
      <div className="container-fluid" style={{ padding: "60px 70px" }}>
        <div className="row mx-0">
          {(featuredList?.featured_rows ?? []).map((card) => {
            const modus = card.listing_modus?.toUpperCase();
            const isForSale = modus === "FOR SALE";
            const isForRental = modus === "FOR RENTAL";
            const showTag = isForSale || isForRental;

            const statusText = isForSale
              ? "For Sale"
              : isForRental
              ? "For Rental"
              : "";
            const statusColor = isForSale
              ? "#FF3B30"
              : isForRental
              ? "#F4980E"
              : "#ccc";

            const belowMarket = card.below_market === "Y";

            return (
              <div key={card.id_listing} className="col-12 col-md-4 mb-4 d-flex">
                <div className="card h-100 d-flex flex-column border-0 shadow-sm w-100">
                  <div className="position-relative">
                    <img
                      src={card.photos?.[0]}
                      className="card-img-top"
                      alt={card.ads_title}
                      style={{ height: "260px", objectFit: "cover" }}
                    />

                    {showTag && (
                      <div
                        className="position-absolute top-0 start-0 m-2"
                        style={{
                          backgroundColor: statusColor,
                          width: "96px",
                          height: "40px",
                          borderRadius: "4px",
                          color: "white",
                          fontSize: "0.9rem",
                          padding: "8px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {statusText}
                      </div>
                    )}

                    {belowMarket && (
                      <span className="badge bg-primary position-absolute bottom-0 start-0 m-2">
                        Below Market
                      </span>
                    )}

                    <span className="position-absolute bottom-0 end-0 m-2 text-white small">
                      <i className="bi bi-camera-fill me-1"></i>{" "}
                      {card.photos_count ?? 0}
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column flex-grow-1">
                    <h5 className="card-title fw-bold text-dark">
                      RM {Number(card.price).toLocaleString()}
                    </h5>
                    <p className="text-muted small mb-1">
                      ({card.built_price_per_sqft} per sqft)
                      <br />
                      <strong>{card.ads_title}</strong>
                      <br />
                      {card.location_area}, {card.location_state}
                    </p>
                    <p className="text-muted small mb-2">
                      {card.property_type_description} |{" "}
                      {card.category_type_title_holding_lottype_storey}
                      <br />
                      Built-up Size: {card.built_size} {card.built_size_unit}
                    </p>
                    <p className="mb-3">
                      <i className="bi bi-bed me-1"></i> {card.room || "-"}
                      &nbsp;&nbsp;
                      <i className="bi bi-droplet me-1"></i> {card.bathroom || "-"}
                    </p>

                    <div className="mt-auto pt-2 d-flex flex-column flex-md-row gap-2">
                      <button className="btn btn-outline-secondary w-100">
                        <i className="bi bi-whatsapp me-1"></i> Whatsapp
                      </button>
                      <button className="btn btn-outline-primary w-100">
                        <i className="bi bi-info-circle me-1"></i> Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
