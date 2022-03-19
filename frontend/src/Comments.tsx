import { getComments } from "./near/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type RequestState =
  | "initialized"
  | "loading"
  | "loaded"
  | "error"
  | "post_not_found";
interface Comment {
  author: string;
  content: string;
}

const useComments = () => {
  const { postId } = useParams();

  const [commentsState, setCommentsState] = useState<{
    state: RequestState;
    comments: Comment[];
  }>({ state: "initialized", comments: [] });

  useEffect(() => {
    setCommentsState({ state: "loading", comments: [] });

    (async () => {
      try {
        const { type, comments } = await getComments(postId!);
        if (type === "success") {
          setCommentsState({ state: "loaded", comments });
        } else if (type === "post_not_found") {
          setCommentsState({ state: "post_not_found", comments: [] });
        }
      } catch (e) {
        setCommentsState({ state: "error", comments: [] });
      }
    })();
  }, [postId]);
  return commentsState;
};

const Comments = () => {
  const commentsState = useComments();

  switch (commentsState.state) {
    case "initialized":
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>oh no</div>;
    case "post_not_found":
      return null;
    case "loaded":
      return (
        <div>
          {commentsState.comments.length > 0 ? (
            commentsState.comments.map(({ author, content }, ix) => {
              return (
                <div className="comment-container" key={ix}>
                  <strong>{content}</strong>
                  <p>wrote: {author}</p>
                </div>
              );
            })
          ) : (
            <div className="comment-container">no comments yet</div>
          )}
        </div>
      );
  }
};

export default Comments;
