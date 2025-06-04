import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../SearchPage/SearchPage.css";
import { getLocations, getPriceYears, getListings } from "../../api/axiosApi";
import debounce from "lodash.debounce";

const SearchFilter = lazy(() => import("../../components/SearchFilter"));
const SidebarFilters = lazy(() => import("../../components/SideFilters"));
const ListingCard = lazy(() => import("../../components/ListingCard"));
const NoResults = lazy(() => import("../../components/NoResults"));
const ListingCardSkeleton = lazy(() =>
  import("../../components/LoadingSkeleton")
);

const SearchPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentYear = new Date().getFullYear();
  const { isLoggedIn } = useAuth();

  const [locations, setLocations] = useState([]);
  const [years, setYears] = useState(state?.years || []);
  const [products, setProducts] = useState(state?.products || []);
  const [selectedLocation, setSelectedLocation] = useState(
    state?.selectedLocationId || ""
  );
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(state?.searchType || "rent");
  const [searchType, setSearchType] = useState(state?.searchType || null);
  const [searchedLocationName, setSearchedLocationName] = useState(
    state?.selectedLocationName || ""
  );

  const activeYear = selectedYear || currentYear.toString();

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const locationRes = await getLocations();
        setLocations(locationRes.data.locations);

        if (!years.length) {
          const yearRes = await getPriceYears();
          setYears(yearRes.data.price_years);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterData();
  }, [years.length]);

  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-") || "";

  const handleSearch = useCallback(
    debounce(async () => {
      setHasSearched(true);
      setLoading(true);
      setSearchType(activeTab);

      const locationId = selectedLocation || "";
      const searchQuery = searchTerm.trim();

      const selectedLocationObj = locations.find(
        (loc) => loc.location_id === locationId
      );
      setSearchedLocationName(selectedLocationObj?.location_name || "");

      try {
        const response = await getListings({
          location: locationId,
          search: searchQuery,
        });
        setProducts(response.data.listings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }, 600),
    [selectedLocation, searchTerm, activeTab, locations]
  );

  const handleViewDetails = useCallback(
    (productId, title, location) => {
      const titleSlug = slugify(title);
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

  const memoizedListings = useMemo(() => {
    if (loading) return [...Array(5)].map((_, idx) => <ListingCardSkeleton key={idx} />);
    if (products.length === 0 && hasSearched) return <NoResults />;
    return products.map((product) => (
      <ListingCard
        key={product.property_id}
        product={product}
        years={years}
        handleViewDetails={handleViewDetails}
        activeYear={activeYear}
      />
    ));
  }, [loading, products, years, handleViewDetails, activeYear, hasSearched]);

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: isLoggedIn === false ? "50px 50px" : "0px 50px",
      }}
    >
      <Suspense fallback={<div>Loading filters...</div>}>
        <SearchFilter
          locations={locations}
          years={years}
          selectedLocation={selectedLocation}
          selectedYear={selectedYear}
          searchTerm={searchTerm}
          setSelectedLocation={setSelectedLocation}
          setSelectedYear={setSelectedYear}
          setSearchTerm={setSearchTerm}
          isLoggedIn={isLoggedIn}
          handleSearch={handleSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Suspense>

      <div className="results-wrapper mt-4">
        <div className="listings order-2 order-lg-1">
          <Suspense fallback={<div>Loading listings...</div>}>
            {memoizedListings}
          </Suspense>
        </div>
        <div className="sidebar order-1 order-lg-2">
          <Suspense fallback={<div>Loading sidebar...</div>}>
            <SidebarFilters
              selectedLocationName={searchedLocationName}
              searchType={searchType}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
