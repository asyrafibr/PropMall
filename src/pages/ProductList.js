import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Filters from "../components/FilterSection";
import ListingsCount from "../components/ListingsCount";
import YearTabs from "../components/YearTabs";
import ListingCard from "../components/ListingCard";
import NoResults from "../components/NoResults";

const ProductList = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { location, year, term } = useParams(); // URL params

  // State Variables
  const [locations, setLocations] = useState([]);
  const [years, setYears] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeYear = selectedYear || currentYear.toString();

  // Fetch filters on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const locationRes = await axios.get(
          "https://interview.propmall.my/locations",
          {
            headers: { Authentication: "TOKEN 67ce6d78ad121633723921" },
          }
        );
        setLocations(locationRes.data.locations);

        const yearRes = await axios.get(
          "https://interview.propmall.my/price-years",
          {
            headers: { Authentication: "TOKEN 67ce6d78ad121633723921" },
          }
        );
        setYears(yearRes.data.price_years);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, []);

  // Fetch listings when URL params change
  useEffect(() => {
    const fetchListings = async () => {
      if (!locations.length) return; // wait for locations to be ready

      const locationObj =
        location && location !== "all-locations"
          ? locations.find(
              (loc) =>
                loc.location_name.toLowerCase().replace(/\s+/g, "-") ===
                location
            )
          : null;

      const locationId = locationObj?.location_id || "";

      // Unsanitize slug for searchTerm
      const unslugifiedTerm =
        term === "all" ? "" : term?.replace(/-/g, " ") || "";

      // Sync URL values to local state
      setSelectedLocation(locationId);
      setSelectedYear(year || "");
      setSearchTerm(unslugifiedTerm);

      try {
        const response = await axios.post(
          "https://interview.propmall.my/listings",
          {
            location: locationId,
            search: unslugifiedTerm,
          },
          {
            headers: {
              Authentication: "TOKEN 67ce6d78ad121633723921",
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(response.data.listings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [location, year, term, locations]);

  // Slugify utility
  const slugify = (text) => {
    if (!text) return "";
    return text.toLowerCase().trim().replace(/\s+/g, "-");
  };

  // Handle search button
  const handleSearch = () => {
    const locationSlug = selectedLocation
      ? slugify(
          locations.find((loc) => loc.location_id === selectedLocation)
            ?.location_name
        )
      : "all-locations";

    const termSlug = searchTerm.trim() ? slugify(searchTerm.trim()) : "all";

    const newUrl = `/search/${locationSlug}/${
      selectedYear || currentYear
    }/${termSlug}`;
    navigate(newUrl, { replace: true }); // Update URL without full reload
  };

  // Navigate to product details
  const handleViewDetails = (productId, title, location) => {
    const titleSlug = slugify(title);
    navigate(`/property/${titleSlug}`, {
      state: {
        productId,
        title,
        location,
      },
    });
  };

  return (
    <div className="container mt-5">
      {/* Filters Section */}
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
      />


      <div style={{ marginLeft: 50, marginRight:50 }}>
    
        <ListingsCount productCount={products.length} />
 
        {products.length > 0 && (
          <YearTabs years={years} activeYear={activeYear} />
        )}
        {products.map((product) => (
          <ListingCard
            key={product.property_id}
            product={product}
            years={years}
            handleViewDetails={handleViewDetails}
            activeYear={activeYear}
          />
        ))}
      </div>

      {/* No Results */}
      {products.length === 0 && <NoResults />}
    </div>
  );
};

export default ProductList;
