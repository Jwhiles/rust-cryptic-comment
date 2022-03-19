import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { hatch } from "./near/index";

export const renderComments = (domNode: HTMLElement | null, postId: string) => {
  hatch().then(({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <BrowserRouter>
        <App
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={walletConnection}
          postId={postId}
        />
        </BrowserRouter>,
      domNode
    );
  });
};

// If in 'development' mode we render the comments like this
// Possibly this causes an issue when pulled into another project
// that then also runs development mode though. HMm
if (process.env.NODE_ENV === "development") {
  renderComments(document.getElementById("root"), 'my-new-post');
}
