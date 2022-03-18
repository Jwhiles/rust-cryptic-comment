import { getPosts } from "./near/index";
import { useEffect, useState } from "react";

type RequestState =
  | "initialized"
  | "loading"
  | "loaded"
  | "error"
  | "post_not_found";
interface Post {
  title: string;
  slug: string;
}

const usePosts = () => {
  const [postsState, setPostsState] = useState<{
    state: RequestState;
    posts: Post[];
  }>({ state: "initialized", posts: [] });

  useEffect(() => {
    setPostsState({ state: "loading", posts: [] });

    (async () => {
      try {
        const { type, posts } = await getPosts();
        if (type === "success") {
          setPostsState({ state: "loaded", posts });
        } else if (type === "post_not_found") {
          setPostsState({ state: "post_not_found", posts: [] });
        }
      } catch (e) {
        setPostsState({ state: "error", posts: [] });
      }
    })();
  }, []);
  return postsState;
};

const Posts = () => {
  const postsState = usePosts();

  switch (postsState.state) {
    case "initialized":
    case "loading":
      return <div>loading</div>;
    case "error":
      return <div>oh no</div>;
    case "post_not_found":
      return <div>unknown</div>;
    case "loaded":
      return (
        <div>
          {postsState.posts.length > 0 ? (
            postsState.posts.map(({ title, slug }, ix) => {
              return (
                <div key={ix}>
                  <p>{title}</p>
                </div>
              );
            })
          ) : (
            <div>no posts yet</div>
          )}
        </div>
      );
  }
};

export default Posts;
