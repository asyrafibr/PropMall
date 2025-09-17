import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../../components/FilterSection";
import {
  getLocations,
  getPriceYears,
  getListings,
  getAgent,
  getFeaturedList,
} from "../../api/axiosApi";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { useTemplate } from "../../context/TemplateContext";
import DashboardListingT1 from "./DashboardListingT1";
import FilterT2 from "./DashboardT2";
import FilterT3 from "./DashboardT3";
import FilterT4 from "./DashboardT4";

const data = {};
const Dashboard = () => {
  const navigate = useNavigate();
  const { template } = useTemplate();
  const { agent, category } = useTemplate();

  const [locations, setLocations] = useState([]);
  // const [agent, setAgent] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [years, setYears] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Buy");

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const feaListRes = await getFeaturedList();
        setFeaturedList(feaListRes.data.featured_search);

        const locationRes = await getLocations();
        setLocations(locationRes.data.states);
        console.log("location", locationRes);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

  // useEffect(() => {

  //   }, []);

  const urlMap = {
    Buy: "buy",
    Rent: "rent",
    "New Project": "new-project",
    Auction: "auction",
  };
  const getSubdomain = () => {
    const hostname = window.location.hostname; // e.g., "prohartanah.myhartanah.co"
    const parts = hostname.split(".");

    // Handle localhost (e.g., "localhost" or "localhost:3000")
    if (hostname.includes("localhost")) return "localhost";

    // e.g. ["prohartanah", "myhartanah", "co"]
    if (parts.length > 2) return parts[0]; // "prohartanah"
    return null; // fallback if no subdomain
  };

  const handleSearch = async (tabName = activeTab) => {
    const locationId = selectedLocation;
    const selectedLocationObj = locations.find(
      (loc) => loc.id_state === locationId
    );
    const locationName = selectedLocationObj?.state_name || "";

    const payload = {
      domain: getSubdomain(),
      url_fe: window.location.href,
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
            sale: tabName === "Buy",
            rent: tabName === "Rent",
            project: tabName === "New Project",
            auction: tabName === "Auction",
          },
          location: {
            id_country: 1,
            id_province: [],
            id_state: locationId ? [locationId] : [],
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

      // Navigate to the correct tab path
      const pathSegment = urlMap[tabName] || "buy";
      console.log('test',pathSegment)
      // navigate(`/${pathSegment}`, {
      //   state: {
      //     products: response.data.listing_search.listing_rows,
      //     activeTab: tabName,
      //     selectedLocationName: locationName,
      //     selectedLocationId: locationId,
      //     searchType: tabName,
      //     years,
      //   },
      // });
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-") || "";
const handleViewDetails = useCallback(
  (productId, title, location, permalink, permalink_previous) => {
    // ✅ Always prefer the latest permalink
    const targetLink = permalink || permalink_previous;

    if (!targetLink) {
      console.error("No permalink available for product:", productId);
      return;
    }

    navigate(targetLink, {
      state: {
        productId,
        title,
        location,
      },
    });
  },
  [navigate]
);
  const renderByTemplate = () => {
    switch (template) {
      case "template1":
        return (
          <>
            <Filters
              locations={locations}
              agent={agent}
              years={years}
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
            <DashboardListingT1
              handleViewDetails={handleViewDetails}
              listings={featuredList.featured_rows}
            ></DashboardListingT1>
          </>
        );
      case "template2":
        return (
          <>
            <FilterT2
              locations={locations}
              agent={agent}
              years={years}
              selectedLocation={selectedLocation}
              selectedYear={selectedYear}
              searchTerm={searchTerm}
              setSelectedLocation={setSelectedLocation}
              setSelectedYear={setSelectedYear}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            ></FilterT2>
            <DashboardListingT1
              listings={featuredList.featured_rows}
            ></DashboardListingT1>
          </>
        );
      case "template3":
        return (
          <>
            <FilterT3
              locations={locations}
              agent={agent}
              years={years}
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
            <DashboardListingT1
              handleViewDetails={handleViewDetails}
              listings={featuredList.featured_rows}
            ></DashboardListingT1>
          </>
        );
      case "template4":
        return (
          <>
            <FilterT4
              locations={locations}
              agent={agent}
              years={years}
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
            <DashboardListingT1
              handleViewDetails={handleViewDetails}
              listings={featuredList.featured_rows}
            ></DashboardListingT1>
          </>
        );
      default:
        return <p>No template selected</p>;
    }
  };

  return (
    <div
      style={{
        backgroundColor: template === "template2" ? "#FAFAFA" : "#F8F6F4",
      }}
    >
      {renderByTemplate()}
    </div>
  );
};

export default Dashboard;
