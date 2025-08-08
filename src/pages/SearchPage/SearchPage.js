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
import { useTemplate } from "../../context/TemplateContext"; // ✅ Import Template Context
import FilterT2 from "../../pages/SearchPage/SearchPageT2";

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
  const { template } = useTemplate();
  const { agent, category } = useTemplate();

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
  const [activeTab, setActiveTab] = useState(state?.searchType || "Buy");
  const [searchType, setSearchType] = useState(state?.searchType || null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [searchedLocationName, setSearchedLocationName] = useState(
    state?.selectedLocationName || ""
  );
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  const [roomRange, setRoomRange] = useState({ min: null, max: null });
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [priceRangeDisplay, setPriceRangeDisplay] = useState(null);
  const [bedroomDisplay, setBedroomDisplay] = useState(null);
  const [bathroomDisplay, setBathroomDisplay] = useState(null);
  const activeYear = selectedYear || currentYear.toString();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [selectedHolding, setSelectedHolding] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);

  useEffect(() => {
    console.log('activeTab',state?.searchType)

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
  const objectiveMap = {
    Buy: { sale: true },
    Rent: { rent: true },
    "New Project": { project: true },
    Auction: { auction: true },
  };
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
      const hostname = window.location.hostname;
      const domain = hostname.replace(/^www\./, "").split(".")[0];
      const url_fe = window.location.href;
      const payload = {
        domain,
        url_fe,
        listing_search: {
          page_num: 1,
          page_size: 10,
          search_text: searchQuery || null,
          search_fields: {
            title: true,
            description: true,
          },
          search_filters: {
            objective: objectiveMap[activeTab] || {},

            location: {
              id_country: selectedCountry?.id_country || null,
              id_state: selectedState?.id || null,
              id_area: selectedAreaIds.length ? selectedAreaIds : [],
              id_province: [],
              id_cities: [],
            },
            property_category: selectedCategory.id || [],
            property_holding: selectedHolding.id || [],
            property_lot_type: null,
            room: {
              min: roomRange?.min || null,
              max: roomRange?.max || null,
            },
            bathroom: {
              min: bathroomRange?.min || null,
              max: bathroomRange?.max || null,
            },
            price: {
              min: priceRange?.min || null,
              max: priceRange?.max || null,
            },
          },
        },
      };

      try {
        const response = await getListings(payload);
        console.log("payload", response.data.listing_search.listing_rows);

        setProducts(response.data.listing_search.listing_rows);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }, 600),
    [
      selectedLocation,
      searchTerm,
      activeTab,
      locations,
      selectedCategory,
      selectedHolding,
      priceRangeDisplay,
      bedroomDisplay,
      bathroomDisplay,
      priceRange,
      bathroomRange,
      roomRange,
    ]
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
  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
  }, [selectedCategory]);
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
            {template === "template1" ? (
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
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                setSelectedHolding={setSelectedHolding}
                selectedHolding={selectedHolding}
                setPriceRangeDisplay={setPriceRangeDisplay}
                priceRangeDisplay={priceRangeDisplay}
                setBedroomDisplay={setBedroomDisplay}
                bedroomDisplay={bedroomDisplay}
                setBathroomDisplay={setBathroomDisplay}
                bathroomDisplay={bathroomDisplay}
                setPriceRange={setPriceRange}
                priceRange={priceRange}
                setBathroomRange={setBathroomRange}
                bathroomRange={bathroomRange}
                setRoomRange={setRoomRange}
                roomRange={roomRange}
              />
            ) : (
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
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                setSelectedHolding={setSelectedHolding}
                selectedHolding={selectedHolding}
                setPriceRangeDisplay={setPriceRangeDisplay}
                priceRangeDisplay={priceRangeDisplay}
                setBedroomDisplay={setBedroomDisplay}
                bedroomDisplay={bedroomDisplay}
                setBathroomDisplay={setBathroomDisplay}
                bathroomDisplay={bathroomDisplay}
                setPriceRange={setPriceRange}
                priceRange={priceRange}
                setBathroomRange={setBathroomRange}
                bathroomRange={bathroomRange}
                setRoomRange={setRoomRange}
                roomRange={roomRange}
              ></FilterT2>
            )}
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
    </div>
  );
};

export default SearchPage;
