import { Link } from "react-router-dom";

export default function VehicleCard({ vehicle }) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-thumb">
        <img src={vehicle.thumbnail} alt={vehicle.title} loading="lazy" />
      </div>
      <div className="vehicle-body">
        <div className="vehicle-top">
          <h3>{vehicle.title}</h3>
          <span className="price-tag">${vehicle.price}</span>
        </div>
        <p className="vehicle-meta">
          {vehicle.brand} • Rating {vehicle.rating}
        </p>
        <p className="vehicle-description">{vehicle.description}</p>
        <Link className="button" to={`/vehicles/${vehicle.id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
