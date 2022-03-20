import { useState } from "react";
import { useParams } from "react-router-dom";
import { addComment } from "./near";
import "./index.css";

const CommentForm = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState("");
  const [donation, setDonation] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);

  return (
    <form
      className="form-container"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2>Write a comment</h2>
      <div className="form-section">
        <label>
          Comment:
          <textarea
            className="form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>
      <div className="form-section">
        <label>
          Donation in NEAR:
          <input
            className="form-input"
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
            await addComment(comment, donation, postId!);
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
