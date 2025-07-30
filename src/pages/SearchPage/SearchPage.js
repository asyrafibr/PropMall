import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
        console.log('Product Data',products)
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
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    if (loading)
      return [...Array(5)].map((_, idx) => <ListingCardSkeleton key={idx} />);

    if (products.length === 0) {
      return (
        <div
          style={{
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NoResults />
        </div>
      );
    }

    return paginatedProducts.map((product) => (
      <ListingCard
        key={product.id_listing}
        product={product}
        years={years}
        handleViewDetails={handleViewDetails}
        activeYear={activeYear}
      />
    ));
  }, [loading, products, years, handleViewDetails, activeYear, currentPage]);

  return (
      <div
      style={{
        boxSizing: "border-box",
      }}
    >
      <div className="container px-2">
        {/* Sticky Search Filter */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
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
              handleSearch={handleSearch}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Suspense>
        </div>

        {/* Listings + Sidebar using your custom flex layout */}
        <div className="results-wrapper mt-4">
          <div className="listings">
            <Suspense fallback={<div>Loading listings...</div>}>
              {memoizedListings}
            </Suspense>
          </div>

          <div className="sidebar">
            <Suspense fallback={<div>Loading sidebar...</div>}>
              <SidebarFilters
                selectedLocationName={searchedLocationName}
                searchType={searchType}
              />
            </Suspense>
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center my-4 flex-wrap">
          {totalPages > 1 && (
            <div className="d-flex justify-content-center my-4 flex-wrap">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn mx-1 ${
                    currentPage === page
                      ? "btn-primary"
                      : "btn-outline-primary"
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
    </div>

  );
};

export default SearchPage;
