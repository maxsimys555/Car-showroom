import { useState } from "react";
import Select from "../Select/Select";
import "./CommentForm.css";

const MAX_NAME = 50;
const MAX_TEXT = 300;

export default function CommentForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("5");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (name.length > MAX_NAME) {
      nextErrors.name = `Max ${MAX_NAME} characters.`;
    }

    if (!text.trim()) {
      nextErrors.text = "Comment is required.";
    } else if (text.length > MAX_TEXT) {
      nextErrors.text = `Max ${MAX_TEXT} characters.`;
    }

    if (!rating) {
      nextErrors.rating = "Rating is required.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({
      author: name.trim(),
      rating: Number(rating),
      text: text.trim(),
    });

    setName("");
    setRating("5");
    setText("");
  }

  return (
    <form className="panel comment-form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>Leave a comment</h2>
        <span className="meta-text">Share your experience.</span>
      </div>

      <label className="field">
        <span>Name</span>
        <input
          type="text"
          value={name}
          maxLength={MAX_NAME}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

      <div className="field">
        <Select
          label="Rating"
          value={rating}
          onChange={(next) => setRating(next)}
          options={[
            { value: "5", label: "5 - Excellent" },
            { value: "4", label: "4 - Good" },
            { value: "3", label: "3 - Average" },
            { value: "2", label: "2 - Poor" },
            { value: "1", label: "1 - Bad" },
          ]}
        />
        {errors.rating && <span className="field-error">{errors.rating}</span>}
      </div>

      <label className="field">
        <span>Comment</span>
        <textarea
          rows="4"
          value={text}
          maxLength={MAX_TEXT}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="field-hint">
          {text.length}/{MAX_TEXT}
        </div>
        {errors.text && <span className="field-error">{errors.text}</span>}
      </label>

      <button className="button primary" type="submit">
        Add comment
      </button>
    </form>
  );
}
