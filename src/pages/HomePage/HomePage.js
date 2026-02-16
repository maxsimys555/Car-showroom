import { useEffect, useMemo, useState } from "react";
import { fetchVehicles } from "../../api";
import SearchFilterForm from "../../components/SearchFilterForm/SearchFilterForm";
import VehicleCard from "../../components/VehicleCard/VehicleCard";
import "./HomePage.css";

const initialFilters = {
  query: "",
  minPrice: "",
  maxPrice: "",
  minRating: "0",
  sortBy: "rating-desc",
};

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetchVehicles()
      .then((data) => {
        if (!isMounted) return;
        setVehicles(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load vehicles.");
        setStatus("error");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function updateFilters(partial) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  const filteredVehicles = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minRating = Number(filters.minRating || 0);

    const result = vehicles.filter((vehicle) => {
      const matchesQuery =
        !query ||
        vehicle.title.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query);
      const matchesMinPrice = minPrice === null || vehicle.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || vehicle.price <= maxPrice;
      const matchesRating = vehicle.rating >= minRating;
      return matchesQuery && matchesMinPrice && matchesMaxPrice && matchesRating;
    });

    const sorted = [...result];
    switch (filters.sortBy) {
      case "rating-asc":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-desc":
      default:
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sorted;
  }, [vehicles, filters]);

  return (
    <section className="page">
      <SearchFilterForm
        query={filters.query}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        minRating={filters.minRating}
        sortBy={filters.sortBy}
        onChange={updateFilters}
        totalCount={vehicles.length}
        visibleCount={filteredVehicles.length}
      />

      {status === "loading" && <p className="status">Loading vehicles...</p>}
      {status === "error" && <p className="status error">{error}</p>}

      {status === "success" && (
        <section className="vehicle-grid" aria-live="polite">
          {filteredVehicles.length === 0 ? (
            <p className="empty-state">No vehicles match your filters.</p>
          ) : (
            filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          )}
        </section>
      )}
    </section>
  );
}
