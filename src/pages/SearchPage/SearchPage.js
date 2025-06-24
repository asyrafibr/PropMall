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
import { getLocations, getListings } from "../../api/axiosApi";
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
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 30;
  const [searchedLocationName, setSearchedLocationName] = useState(
    state?.selectedLocationName || ""
  );
const totalPages = Math.ceil(products.length / itemsPerPage);
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const activeYear = selectedYear || currentYear.toString();

    useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const locationRes = await getLocations();

        setLocations(locationRes.data.states);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilterData();
  }, []);

  // This useEffect logs locations every time it updates
  useEffect(() => {
    if (locations.length > 0) {
      console.log("test2", locations);
    }
  }, [locations]);


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
        (loc) => loc.id_state === locationId
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
      console.log('productid',productId)
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  if (loading)
    return [...Array(5)].map((_, idx) => <ListingCardSkeleton key={idx} />);
  if (products.length === 0 && hasSearched) return <NoResults />;
  
  return paginatedProducts.map((product) => (
    <ListingCard
      key={product.id_listing}
      product={product}
      years={years}
      handleViewDetails={handleViewDetails}
      activeYear={activeYear}
    />
    
  ));
}, [loading, products, years, handleViewDetails, activeYear, hasSearched, currentPage]);

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

    <div className="container mt-4">
  <div className="row g-5"> {/* g-2 = reduced gutter spacing */}
    <div className="col-lg-8 order-2 order-lg-1">
      <Suspense fallback={<div>Loading listings...</div>}>
        {memoizedListings}
      </Suspense>
    </div>
    
    <div className="col-lg-4 order-1 order-lg-2">
      <Suspense fallback={<div>Loading sidebar...</div>}>
        <SidebarFilters
          selectedLocationName={searchedLocationName}
          searchType={searchType}
        />
      </Suspense>
    </div>
    
  </div>
</div>
<div className="d-flex justify-content-center my-4 flex-wrap">
  {totalPages > 1 && (
  <div className="d-flex justify-content-center my-4 flex-wrap">
    {pageNumbers.map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`btn mx-1 ${
          currentPage === page ? "btn-primary" : "btn-outline-primary"
        }`}
        style={{ minWidth: "40px" }}
      >
        {page}
      </button>
    ))}
  </div>
)}
</div>

    </div>
  );
};

export default SearchPage;
