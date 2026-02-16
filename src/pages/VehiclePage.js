import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchVehicleById } from "../api";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import { loadComments, saveComment } from "../storage";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function normalizeReview(review, index) {
  return {
    id: review.id || `api-${index}`,
    author: review.reviewerName || review.user || "Anonymous",
    rating: review.rating || 0,
    text: review.comment || review.text || "",
    date: review.date || review.createdAt,
  };
}

export default function VehiclePage() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    setError("");
    fetchVehicleById(vehicleId)
      .then((data) => {
        if (!isMounted) return;
        setVehicle(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load vehicle.");
        setStatus("error");
      });
    return () => {
      isMounted = false;
    };
  }, [vehicleId]);

  useEffect(() => {
    setLocalComments(loadComments(vehicleId));
  }, [vehicleId]);

  const apiComments = useMemo(() => {
    if (!vehicle || !Array.isArray(vehicle.reviews)) return [];
    return vehicle.reviews.map(normalizeReview);
  }, [vehicle]);

  const mergedComments = useMemo(
    () => [...localComments, ...apiComments],
    [localComments, apiComments]
  );

  function handleAddComment(comment) {
    setSaveError("");
    try {
      const next = saveComment(vehicleId, {
        id: `local-${Date.now()}`,
        author: comment.author,
        rating: comment.rating,
        text: comment.text,
        date: new Date().toISOString(),
      });
      setLocalComments(next);
    } catch (err) {
      setSaveError("Unable to save comment. Check localStorage access.");
    }
  }

  if (status === "loading") {
    return <p className="status">Loading vehicle...</p>;
  }

  if (status === "error") {
    return (
      <div className="status error">
        {error}
        <Link className="link" to="/">
          Back to list
        </Link>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <section className="page vehicle-page">
      <Link className="link back-link" to="/">
        ← Back to vehicles
      </Link>

      <section className="panel vehicle-hero">
        <div className="vehicle-hero-media">
          <img src={vehicle.thumbnail} alt={vehicle.title} />
          {Array.isArray(vehicle.images) && vehicle.images.length > 1 && (
            <div className="vehicle-gallery">
              {vehicle.images.slice(0, 4).map((image, index) => (
                <img key={image} src={image} alt={`${vehicle.title} ${index + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="vehicle-hero-info">
          <div className="vehicle-hero-top">
            <h1>{vehicle.title}</h1>
            <span className="price-tag">{priceFormatter.format(vehicle.price)}</span>
          </div>
          <p className="vehicle-meta">
            {vehicle.brand} • Rating {vehicle.rating} • Stock {vehicle.stock}
          </p>
          <p className="vehicle-description">{vehicle.description}</p>
          <div className="vehicle-specs">
            <div>
              <span className="spec-label">Category</span>
              <span>{vehicle.category}</span>
            </div>
            <div>
              <span className="spec-label">Discount</span>
              <span>{vehicle.discountPercentage}%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel comments-panel">
        <div className="panel-header">
          <h2>Comments</h2>
          <span className="meta-text">{mergedComments.length} total</span>
        </div>
        <CommentList comments={mergedComments} />
        {saveError && <p className="status error">{saveError}</p>}
      </section>

      <CommentForm onSubmit={handleAddComment} />
    </section>
  );
}
