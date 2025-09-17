import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
  useMemo,
  useRef,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../SearchPage/SearchPage.css";
import { getLocations, getListings } from "../../api/axiosApi";
import debounce from "lodash.debounce";
import { useTemplate } from "../../context/TemplateContext";
import FilterT2 from "../../pages/SearchPage/SearchPageT2";
import FilterT3 from "../../pages/SearchPage/SearchPageT3";
import FilterT4 from "../../pages/SearchPage/SearchPageT4";
import ListingCard3 from "../../components/ListingCard3";
import ListingCard4 from "../../components/ListingCard4";
const SearchFilter = lazy(() => import("../../components/SearchFilter"));
const SidebarFilters = lazy(() => import("../../components/SideFilters"));
const ListingCard = lazy(() => import("../../components/ListingCard"));
const NoResults = lazy(() => import("../../components/NoResults"));
const ListingCardSkeleton = lazy(() =>
  import("../../components/LoadingSkeleton")
);

const SearchPage = () => {
  const tabMap = [
    { label: "Buy", key: "sale" },
    { label: "Rent", key: "rent" },
    { label: "New Project", key: "project" },
    { label: "Auction", key: "auction" },
  ];
  const tabKeyMap = {
    buy: "sale",
    rent: "rent",
    "new-project": "project",
    auction: "auction",
  };
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentYear = new Date().getFullYear();
  const { template, agent, category } = useTemplate();

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
  const { tab } = useParams(); // buy, rent, new-project, auction
  const [activeTab1, setActiveTab1] = useState(
    tabMap[tab?.toLowerCase()] || "Buy"
  );
  const activeKey = tabKeyMap[tab?.toLowerCase()] || "sale"; // fallback to "sale"
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab; // always latest value
  }, [activeTab]);
  useEffect(() => {
    if (tab) {
      const activeTest =
        tabMap.find((t) => t.key === activeKey)?.label || "Buy";

      setActiveTab(activeTest);
      console.log("test123", tab);

      console.log("test123", activeTab);
    }
  }, [tab]);

  // Trigger search whenever activeTab changes
  // useEffect(() => {
  //   if (activeTab) {
  //     handleSearch(activeTab); // your existing handleSearch function
  //   }
  // }, [activeTab]);
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
      const tabKey = activeTabRef.current; // ✅ always latest

      console.log("objectiveMap", objectiveMap[tabKey]);
      console.log("activeTab (ref)", tabKey);

      setHasSearched(true);
      setLoading(true);
      setSearchType(tabKey);
      setActiveTab(tabKey);
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
          search_fields: { title: true, description: true },
          search_filters: {
            objective: objectiveMap[tabKey] || {},
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
            room: { min: roomRange?.min || null, max: roomRange?.max || null },
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

  const memoizedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    if (loading)
      return [...Array(5)].map((_, idx) => <ListingCardSkeleton key={idx} />);
    if (products.length === 0)
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <NoResults />
        </div>
      );

    return paginatedProducts.map((product) => {
      if (template === "template1" || template === "template2") {
        return (
          <ListingCard
            key={product.id_listing}
            product={product}
            years={years}
            handleViewDetails={handleViewDetails}
            activeYear={activeYear}
          />
        );
      }
      if (template === "template3") {
        return (
          <ListingCard3
            key={product.id_listing}
            product={product}
            years={years}
            handleViewDetails={handleViewDetails}
            activeYear={activeYear}
          />
        );
      }
      if (template === "template4") {
        return (
          <ListingCard4
            key={product.id_listing}
            product={product}
            years={years}
            handleViewDetails={handleViewDetails}
            activeYear={activeYear}
          />
        );
      }
      return null;
    });
  }, [
    loading,
    products,
    years,
    handleViewDetails,
    activeYear,
    currentPage,
    template,
  ]);

  return (
    <div className="container-fluid bg-light">
      <div className="container py-3">
        {/* Sticky Search Filter */}
        <div className="sticky-top bg-light py-2 z-index-3">
          <Suspense fallback={<div>Loading filters...</div>}>
            {template === "template1" && (
              <SearchFilter
                {...{
                  locations,
                  years,
                  selectedLocation,
                  selectedYear,
                  searchTerm,
                  setSelectedLocation,
                  setSelectedYear,
                  setSearchTerm,
                  handleSearch,
                  activeTab,
                  setActiveTab,
                  selectedCategory,
                  setSelectedCategory,
                  selectedHolding,
                  setSelectedHolding,
                  priceRangeDisplay,
                  setPriceRangeDisplay,
                  bedroomDisplay,
                  setBedroomDisplay,
                  bathroomDisplay,
                  setBathroomDisplay,
                  priceRange,
                  setPriceRange,
                  bathroomRange,
                  setBathroomRange,
                  roomRange,
                  setRoomRange,
                  selectedAreaIds,
                  setSelectedAreaIds,
                }}
              />
            )}
            {template === "template2" && (
              <FilterT2
                {...{
                  locations,
                  agent,
                  years,
                  selectedLocation,
                  selectedYear,
                  searchTerm,
                  setSelectedLocation,
                  setSelectedYear,
                  setSearchTerm,
                  handleSearch,
                  activeTab,
                  setActiveTab,
                  selectedCategory,
                  setSelectedCategory,
                  selectedHolding,
                  setSelectedHolding,
                  priceRangeDisplay,
                  setPriceRangeDisplay,
                  bedroomDisplay,
                  setBedroomDisplay,
                  bathroomDisplay,
                  setBathroomDisplay,
                  priceRange,
                  setPriceRange,
                  bathroomRange,
                  setBathroomRange,
                  roomRange,
                  setRoomRange,
                  selectedAreaIds,
                  setSelectedAreaIds,
                }}
              />
            )}
            {template === "template3" && (
              <FilterT3
                {...{
                  locations,
                  years,
                  selectedLocation,
                  selectedYear,
                  searchTerm,
                  setSelectedLocation,
                  setSelectedYear,
                  setSearchTerm,
                  handleSearch,
                  activeTab,
                  setActiveTab,
                  selectedCategory,
                  setSelectedCategory,
                  selectedHolding,
                  setSelectedHolding,
                  priceRangeDisplay,
                  setPriceRangeDisplay,
                  bedroomDisplay,
                  setBedroomDisplay,
                  bathroomDisplay,
                  setBathroomDisplay,
                  priceRange,
                  setPriceRange,
                  bathroomRange,
                  setBathroomRange,
                  roomRange,
                  setRoomRange,
                  selectedAreaIds,
                  setSelectedAreaIds,
                }}
              />
            )}
            {template === "template4" && (
              <FilterT4
                {...{
                  locations,
                  agent,
                  years,
                  selectedLocation,
                  selectedYear,
                  searchTerm,
                  setSelectedLocation,
                  setSelectedYear,
                  setSearchTerm,
                  handleSearch,
                  activeTab,
                  setActiveTab,
                  selectedCategory,
                  setSelectedCategory,
                  selectedHolding,
                  setSelectedHolding,
                  priceRangeDisplay,
                  setPriceRangeDisplay,
                  bedroomDisplay,
                  setBedroomDisplay,
                  bathroomDisplay,
                  setBathroomDisplay,
                  priceRange,
                  setPriceRange,
                  bathroomRange,
                  setBathroomRange,
                  roomRange,
                  setRoomRange,
                  selectedAreaIds,
                  setSelectedAreaIds,
                }}
              />
            )}
          </Suspense>
        </div>

        {/* Listings + Sidebar */}
        <div className="row mt-4">
          <div className="col-lg-9 col-md-8 mb-4">
            <Suspense fallback={<div>Loading listings...</div>}>
              {memoizedListings}
            </Suspense>
          </div>
          <div className="col-lg-3 col-md-4">
            <Suspense fallback={<div>Loading sidebar...</div>}>
              <SidebarFilters
                selectedLocationName={searchedLocationName}
                searchType={searchType}
              />
            </Suspense>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center flex-wrap my-4">
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn mx-1 ${
                  currentPage === page ? "btn-primary" : "btn-outline-primary"
                }`}
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
