import { getComments, createPost } from "./near/index";
import { useEffect, useState } from "react";

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

const useComments = (postId: string) => {
  const [commentsState, setCommentsState] = useState<{
    state: RequestState;
    comments: Comment[];
  }>({ state: "initialized", comments: [] });

  useEffect(() => {
    setCommentsState({ state: "loading", comments: [] });

    (async () => {
      try {
        const { type, comments } = await getComments(postId);
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

const Comments = ({ postId }: { postId: string }) => {
  const commentsState = useComments(postId);

  switch (commentsState.state) {
    case "initialized":
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>oh no</div>;
    case "post_not_found":
      return <PostNotFound postId={postId} />;
    case "loaded":
      return (
        <div>
          {commentsState.comments.length > 0 ? (
            commentsState.comments.map(({ author, content }, ix) => {
              return (
                <div key={ix}>
                  <p>{content}</p>
                  <p>wrote: {author}</p>
                </div>
              );
            })
          ) : (
            <div>no comments yet</div>
          )}
        </div>
      );
  }
};

const PostNotFound = ({ postId }: { postId: string }) => {
  return (
    <div>
      <p>post not found if you are John, then click below to create it</p>
      <button onClick={() => createPost(postId)}>Create post</button>
    </div>
  );
};

export default Comments;
