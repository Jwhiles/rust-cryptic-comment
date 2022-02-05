import { getComments } from "./near/index";
import { useEffect, useState } from "react";

type RequestState = "initialized" | "loading" | "loaded" | "error";
interface Comment {
  author: string;
  content: string;
}

const useComments = (postId: string) => {
  const [commentsState, setCommentsState] = useState<{
    state: RequestState;
    comments: Comment[];
  }>({ state: "initialized", comments: [] });

  useEffect(() => {
    setCommentsState({ state: "loading", comments: [] });

    (async () => {
      try {
        const comments = await getComments(postId);
        setCommentsState({ state: "loaded", comments });
      } catch (e) {
        setCommentsState({ state: "error", comments: [] });
      }
    })();
  }, [postId]);
  return commentsState;
};

const Comments = ({ postId }: { postId: string }) => {
  const commentsState = useComments(postId);

  switch (commentsState.state) {
    case "initialized":
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>oh no</div>;
    case "loaded":
      return (
        <div>
          {commentsState.comments.map(({ author, content }, ix) => {
            return (
              <div key={ix}>
                <p>{content}</p>
                <p>wrote: {author}</p>
              </div>
            );
          })}
        </div>
      );
  }
};

export default Comments;
