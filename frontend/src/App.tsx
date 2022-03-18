import Posts from "./Posts";
import Post from "./Post";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import { signIn, signOut } from "./near";

interface AppProps {
  contract: any;
  currentUser: any;
  nearConfig: any;
  wallet: any;
  postId: string
}

const App = (props: AppProps) => {
  // render below components according to routes
  return (
    <div>
      <Posts />
      <Post postId={props.postId} />
      <Comments postId={props.postId} />
      {props.currentUser && <CommentForm postId={props.postId} />}
      {props.currentUser ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <button onClick={signIn}>Log in to post a comment</button>
      )}
    </div>
  );
};

export default App;
