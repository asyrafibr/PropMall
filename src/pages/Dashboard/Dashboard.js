import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../../components/FilterSection";
import AgentBox from "../../components/AgentBox";
import { useAuth } from "../../context/AuthContext";
import {
  getLocations,
  getPriceYears,
  getListings,
  getAgent,
} from "../../api/axiosApi";

const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [agent, setAgent] = useState([]);

  const [years, setYears] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("rent");

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const agentRes = await getAgent();
        setAgent(agentRes.data.agent);
        console.log('agent detail',agent);
        const locationRes = await getLocations();
        setLocations(locationRes.data.locations);

        const yearRes = await getPriceYears();
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

    const selectedLocationObj = locations.find(
      (loc) => loc.location_id === locationId
    );
    const locationName = selectedLocationObj?.location_name || "";

    try {
      const response = await getListings({
        location: locationId,
        search: searchQuery,
      });

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

       {agent && (
    <div style={{ margin: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>My Info from /graph/me:</h3>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {JSON.stringify(agent, null, 2)}
      </pre>
    </div>
  )}
    </div>
  );
};

export default Dashboard;
