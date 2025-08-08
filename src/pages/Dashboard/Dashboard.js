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
        console.log('location',locationRes)
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

// useEffect(() => {

//   }, []);

  const handleSearch = async () => {
    const locationId = selectedLocation;
    const selectedLocationObj = locations.find(
      (loc) => loc.id_state === locationId
    );
    const locationName = selectedLocationObj?.state_name || "";

    const payload = {
      domain: "dev-agentv3.propmall.net",
      url_fe: "http://dev-agentv3.propmall.net",
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

      const stingtype = String(locationId);

      //

      navigate("/search", {
        state: {
          products: response.data.listing_search.listing_rows,
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

  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-") || "";
  const handleViewDetails = useCallback(
    (productId, title, location) => {
      const titleSlug = slugify(title);
      console.log("productid", productId);
      navigate(`/property/${titleSlug}`, {
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
        return null;
      case "template4":
        return null;
      default:
        return <p>No template selected</p>;
    }
  };

  return <div>{renderByTemplate()}</div>;
};

export default Dashboard;
