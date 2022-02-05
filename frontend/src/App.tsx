import Comments from "./Comments";

const App = () => {
  const postId = new URLSearchParams(window.location.search).get("post_id");
  if (typeof postId !== "string") {
    throw new Error(`invalid post_id query string. Found ${postId}`);
  }

  return <Comments postId={postId} />;
};

export default App;
