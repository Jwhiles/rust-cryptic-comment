import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { hatch } from "./near/index";

export const renderComments = (domNode: HTMLElement | null ) => {
  hatch().then(({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <BrowserRouter>
        <App
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={walletConnection}
        />
        </BrowserRouter>,
      domNode
    );
  });
};

renderComments(document.getElementById("root"));
