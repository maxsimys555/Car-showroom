import { useMemo } from "react";
import Select from "../Select/Select";
import "./SearchFilterForm.css";

const PRICE_STEP = 100;

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SearchFilterForm({
  query,
  minPrice,
  maxPrice,
  minRating,
  sortBy,
  onChange,
  totalCount,
  visibleCount,
}) {
  const summary = useMemo(() => {
    if (visibleCount === totalCount) {
      return `${formatCount(totalCount)} vehicles available`;
    }
    return `${formatCount(visibleCount)} of ${formatCount(totalCount)} vehicles`;
  }, [totalCount, visibleCount]);

  return (
    <section className="panel filter-panel">
      <div className="panel-header">
        <h2>Find Your Vehicle</h2>
        <span className="meta-text">{summary}</span>
      </div>

      <form className="filter-form" onSubmit={(event) => event.preventDefault()}>
        <label className="field">
          <span>Search</span>
          <input
            type="search"
            placeholder="Model, brand, or keyword"
            value={query}
            onChange={(event) => onChange({ query: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Min price</span>
          <input
            type="number"
            min="0"
            step={PRICE_STEP}
            value={minPrice}
            onChange={(event) => onChange({ minPrice: event.target.value })}
          />
        </label>

        <label className="field">
          <span>Max price</span>
          <input
            type="number"
            min="0"
            step={PRICE_STEP}
            value={maxPrice}
            onChange={(event) => onChange({ maxPrice: event.target.value })}
          />
        </label>

        <Select
          label="Min rating"
          value={minRating}
          onChange={(next) => onChange({ minRating: next })}
          options={[
            { value: "0", label: "Any" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
            { value: "4.5", label: "4.5+" },
          ]}
        />

        <Select
          label="Sort by"
          value={sortBy}
          onChange={(next) => onChange({ sortBy: next })}
          options={[
            { value: "rating-desc", label: "Rating: high to low" },
            { value: "rating-asc", label: "Rating: low to high" },
            { value: "price-asc", label: "Price: low to high" },
            { value: "price-desc", label: "Price: high to low" },
            { value: "title-asc", label: "Title: A-Z" },
            { value: "title-desc", label: "Title: Z-A" },
          ]}
        />
      </form>
    </section>
  );
}
