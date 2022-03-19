import { getPost } from "./near/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";

type RequestState =
  | "initialized"
  | "loading"
  | "loaded"
  | "error"
  | "post_not_found";

interface PostInterface {
  author: string;
  content: string;
  title: string;
}

const usePost = () => {
  const { postId } = useParams();
  const [postState, setPostState] = useState<{
    state: RequestState;
    post: PostInterface;
  }>({ state: "initialized", post: { author: "", content: "", title: "" } });

  useEffect(() => {
    setPostState({ state: "loading", post: { author: "", content: "", title: "" } });

    (async () => {
      try {
        const { type, post } = await getPost(postId!);
        if (type === "success") {
          setPostState({ state: "loaded", post });
        } else if (type === "post_not_found") {
          setPostState({
            state: "post_not_found",
            post: { author: "", content: "", title: "" },
          });
        }
      } catch (e) {
        setPostState({ state: "error", post: { author: "", content: "", title: "" } });
      }
    })();
  }, [postId]);
  return postState;
};

const Post = () => {
  const postState = usePost();

  switch (postState.state) {
    case "initialized":
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>oh no</div>;
    case "post_not_found":
      return <PostNotFound />;
    case "loaded":
      return (
        <><h1>{postState.post.title}</h1>
          <div className="post-container">
            <p>{postState.post.content}</p>
          </div>
        </>
      );
  }
};

const PostNotFound = () => {
  return (
    <div>
      <p>This post doesn't exist!</p>
    </div>
  );
};

export default Post;
