import { useState } from "react";
import { addComment } from "./near";
import "./index.css";

const CommentForm = ({ postId }: any) => {
  const [comment, setComment] = useState("");
  const [donation, setDonation] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);

  return (
    <form
      className="commentform-container"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2>Write a comment</h2>
      <div className="commentform-section">
        <label>
          Comment:
          <textarea
            className="commentform-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>
      <div className="commentform-section">
        <label>
          Donation in NEAR:
          <input
            className="commentform-input"
            type="number"
            value={donation}
            onChange={(e) => setDonation(Number(e.target.value))}
          />
        </label>
      </div>
      {error && <p>{error}</p>}
      <button
        onClick={async () => {
          try {
            setSubmitting(true);
            await addComment(comment, donation, postId);
          } catch {
            setError("!! You must provide a minimum donation of 1 NEAR.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitting ? "Submitting..." : "Post comment"}
      </button>
    </form>
  );
};

export default CommentForm;
