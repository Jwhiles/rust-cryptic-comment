import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { hatch } from './near/index'


hatch().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
      />,
      document.getElementById('root')
    );
  }
);
