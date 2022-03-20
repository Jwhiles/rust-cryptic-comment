import { createPost } from "./near/index";
import { useState } from "react";
import "./index.css";

interface AddPostProps {
    contract: { contractId: string };
    currentUser: { accountId: string };
}

const AddPost = (props: AddPostProps) => {
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState<null | string>(null);

    const goToGithub = () => {
        window.location.replace("https://github.com/Jwhiles/rust-cryptic-comment/blob/main/README.md");
    }

    if (props.currentUser?.accountId !== props.contract?.contractId) {
        return (
            <button onClick={goToGithub}>Click here to create your own blog on NEAR</button>
        );
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
            className="form-container"
            onSubmit={(e) => e.preventDefault()}>
            <h2>Write a post</h2>
            <div className="form-section">
                <label> Title:
                    <input
                        className="form-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label> Text:
                    <textarea
                        className="form-textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)} />
                </label>
                {error && <p>{error}</p>}
                <button onClick={submitPost}>{submitting ? "Submitting..." : "Create post"}</button>
            </div>
        </form>
        : <button onClick={() => setShowForm(true)}>Create new post</button>
};

export default AddPost;
