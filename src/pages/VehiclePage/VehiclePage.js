import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchVehicleById } from "../../api";
import CommentForm from "../../components/CommentForm/CommentForm";
import CommentList from "../../components/CommentList/CommentList";
import { loadComments, saveComment } from "../../storage";
import "./VehiclePage.css";

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
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    setError("");
    fetchVehicleById(vehicleId)
      .then((data) => {
        if (!isMounted) return;
        setVehicle(data);
        if (data.thumbnail) {
          setActiveImage(data.thumbnail);
        }
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

  const images = Array.isArray(vehicle.images) ? vehicle.images : [];
  const galleryImages = images.length ? images : [vehicle.thumbnail].filter(Boolean);
  const currentImage = activeImage || vehicle.thumbnail;

  return (
    <section className="page vehicle-page">
      <Link className="link back-link" to="/">
        ← Back to vehicles
      </Link>

      <section className="panel vehicle-hero">
        <div className="vehicle-hero-media">
          <img src={currentImage} alt={vehicle.title} />
          {galleryImages.length > 1 && (
            <div className="vehicle-gallery" role="list">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`gallery-thumb ${
                    image === currentImage ? "is-active" : ""
                  }`}
                  onClick={() => setActiveImage(image)}
                  aria-label={`View ${vehicle.title} image ${index + 1}`}
                >
                  <img src={image} alt={`${vehicle.title} ${index + 1}`} />
                </button>
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
