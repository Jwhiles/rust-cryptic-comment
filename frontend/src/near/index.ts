import * as nearAPI from "near-api-js";
import Big from "big.js";
import getConfig from "./config";

let contract: any;
let wallet: any;
let nearConfig: any;
// hatch as in egg
export async function hatch() {
  nearConfig = getConfig("testnet"); // TODO

  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect({ keyStore, ...nearConfig, headers: {} });

  wallet = new nearAPI.WalletConnection(near, nearConfig.contractName);

  // Load in user's account data
  let currentUser;
  console.log(wallet);
  console.log(wallet.getAccountId());
  if (wallet.getAccountId()) {
    currentUser = {
      // Gets the accountId as a string
      accountId: wallet.getAccountId(),
      // Gets the user's token balance
      balance: (await wallet.account().state()).amount
    };
  }

  contract = new nearAPI.Contract(
    wallet.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    nearConfig.contractName,
    {
      viewMethods: ["get_comments"],
      changeMethods: ["add_comment"]
    }
  );

  return { contract, currentUser, nearConfig, walletConnection: wallet };
}

// -----------------------------------------------------------------------------------
// view functions
// -----------------------------------------------------------------------------------
export const getComments = async (postId: string) => {
  const response = await contract.get_comments({ post_id: postId });

  return response;
};

export const addComment = async (
  content: string,
  donation: number,
  postId: string
) => {
  const donationB = Big(donation || "0")
    .times(10 ** 24)
    .toFixed();

  await contract.add_comment(
    {
      post_id: postId,
      content
    },
    Big(3)
      .times(10 ** 13)
      .toFixed(),
    donationB
  );
};

export const signIn = () => {
  wallet.requestSignIn(
    {
      contractId: nearConfig.contractName,
      methodNames: [contract.add_comment.name]
    }, //contract requesting access
    "Cryptic Comments", //optional name
  );
};

export const signOut = () => {
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
};
