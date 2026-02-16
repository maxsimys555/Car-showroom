function formatDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="empty-state">Be the first to leave a comment.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-rating">Rating {comment.rating}</span>
          </div>
          <p>{comment.text}</p>
          <span className="comment-date">{formatDate(comment.date)}</span>
        </li>
      ))}
    </ul>
  );
}
