import { createPost } from "./near/index";
import { useState } from "react";
import "./index.css";

interface AppPostProps {
    contract: { contractId: string };
    currentUser: { accountId: string };
}

const AddPost = (props: AppPostProps) => {
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState<null | string>(null);

    if (props.currentUser.accountId !== props.contract.contractId) {
        return null;
    }

    const submitPost = async () => {
        const postId = title.split(" ").join("-");
        try {
            setSubmitting(true);
            await createPost(postId, title, text);
        } catch {
            setError("Something has gone horribly wrong");
        } finally {
            setSubmitting(false);
        }
    }

    return showForm
        ? <form
            className="commentform-container"
            onSubmit={(e) => e.preventDefault()}>
            <label> Title:
                <input
                    className="commentform-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>
            <label> Text:
                <textarea
                    className="commentform-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
            </label>
            {error && <p>{error}</p>}
            <button onClick={submitPost}>{submitting ? "Submitting..." : "Create post"}</button>
        </form>
        : <button onClick={() => setShowForm(true)}>Create new post</button>
};

export default AddPost;
