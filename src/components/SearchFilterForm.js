import { useMemo } from "react";

const PRICE_STEP = 100;

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SearchFilterForm({
  query,
  minPrice,
  maxPrice,
  minRating,
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

        <label className="field">
          <span>Min rating</span>
          <select
            value={minRating}
            onChange={(event) => onChange({ minRating: event.target.value })}
          >
            <option value="0">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>
      </form>
    </section>
  );
}
