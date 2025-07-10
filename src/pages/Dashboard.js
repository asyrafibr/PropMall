// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Filters from "../components/FilterSection";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("rent");

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const locationRes = await axios.get("https://interview.propmall.my/locations", {
          headers: { Authentication: "TOKEN 67ce6d78ad121633723921" },
        });
        setLocations(locationRes.data.locations);

        const yearRes = await axios.get("https://interview.propmall.my/price-years", {
          headers: { Authentication: "TOKEN 67ce6d78ad121633723921" },
        });
        setYears(yearRes.data.price_years);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

  const handleSearch = async () => {
    const locationId = selectedLocation || "";
    const term = searchTerm.trim();
    const searchQuery = term !== "" ? term : "";

    const selectedLocationObj = locations.find((loc) => loc.location_id === locationId);
    const locationName = selectedLocationObj?.location_name || "";

    try {
      const response = await axios.post(
        "https://interview.propmall.my/listings",
        {
          location: locationId,
          search: searchQuery,
        },
        {
          headers: {
            Authentication: "TOKEN 67ce6d78ad121633723921",
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/search", {
        state: {
          products: response.data.listings,
          selectedLocationName: locationName,
          selectedLocationId: selectedLocation,
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
    </div>
  );
};

export default Dashboard;
