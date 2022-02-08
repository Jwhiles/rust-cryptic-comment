import { useState } from "react";
import Comments from "./Comments";
import { signIn, signOut, addComment } from "./near";

interface AppProps {
  contract: any;
  currentUser: any;
  nearConfig: any;
  wallet: any;
  postId: string
}

const App = (props: AppProps) => {

  return (
    <div>
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

const CommentForm = ({ postId }: any) => {
  const [comment, setComment] = useState("");
  const [donation, setDonation] = useState(0);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label>
        Comment:
        <input value={comment} onChange={e => setComment(e.target.value)} />
      </label>
      <label>
        Donation:
        <input
          type="number"
          value={donation}
          onChange={e => setDonation(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() => {
          addComment(comment, donation, postId);
        }}
      >
        post
      </button>
    </form>
  );
};

export default App;
