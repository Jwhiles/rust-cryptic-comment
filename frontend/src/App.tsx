import { Routes, Route, Link } from "react-router-dom";
import Posts from "./Posts";
import Post from "./Post";
import AddPost from "./AddPost";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import { signIn, signOut } from "./near";

interface AppProps {
  contract: any;
  currentUser: any;
  nearConfig: any;
  wallet: any;
  postId: string;
}

const App = (props: AppProps) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <>
            <Posts {...props} />
            <AddPost {...props} />
            <br />
            {!props.currentUser && <button onClick={signIn}>Log in</button>}
          </>
        } />
        <Route
          path={"/:postId"}
          element={
            <>
              <Link to="/"><p>Home</p></Link>
              <Post />
              <Comments />
              {props.currentUser && <CommentForm />}
              {props.currentUser ? (
                <button onClick={signOut}>Sign out</button>
              ) : (
                <button onClick={signIn}>Log in to post a comment</button>
              )}
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
