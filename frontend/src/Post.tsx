import { getPost, createPost } from "./near/index";
import { useEffect, useState } from "react";

type RequestState =
  | "initialized"
  | "loading"
  | "loaded"
  | "error"
  | "post_not_found";

interface PostInterface {
  author: string;
  content: string;
}

const usePost = (postId: string) => {
  const [postState, setPostState] = useState<{
    state: RequestState;
    post: PostInterface;
  }>({ state: "initialized", post: { author: "", content: "" } });

  useEffect(() => {
    setPostState({ state: "loading", post: { author: "", content: "" } });

    (async () => {
      try {
        const { type, post } = await getPost(postId);
        if (type === "success") {
          setPostState({ state: "loaded", post });
        } else if (type === "post_not_found") {
          setPostState({
            state: "post_not_found",
            post: { author: "", content: "" },
          });
        }
      } catch (e) {
        setPostState({ state: "error", post: { author: "", content: "" } });
      }
    })();
  }, [postId]);
  return postState;
};

const Post = ({ postId }: { postId: string }) => {
  const postState = usePost(postId);

  switch (postState.state) {
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
          <p>{postState.post.content}</p>
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

export default Post;
