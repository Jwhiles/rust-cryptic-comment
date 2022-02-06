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

  let currentUser;
  if (wallet.getAccountId()) {
    currentUser = {
      accountId: wallet.getAccountId(),
      balance: (await wallet.account().state()).amount
    };
  }

  contract = new nearAPI.Contract(wallet.account(), nearConfig.contractName, {
    viewMethods: ["get_comments"],
    changeMethods: ["add_comment", "create_post"]
  });

  return { contract, currentUser, nearConfig, walletConnection: wallet };
}

// -----------------------------------------------------------------------------------
// view functions
// -----------------------------------------------------------------------------------
export const getComments = async (postId: string) => {
  try {
    const comments = await contract.get_comments({ post_id: postId });
    return { type: "success", comments };
  } catch (e) {
    const message = (e as any).message;
    if (message.includes(`Post doesn't exist`)) {
      return { type: "post_not_found" };
    } else {
      throw e;
    }
  }
};

// -----------------------------------------------------------------------------------
// change functions
// -----------------------------------------------------------------------------------
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

export const createPost = async (postId: string) => {
  await contract.create_post(
    {
      post_id: postId
    },
    Big(3)
      .times(10 ** 13)
      .toFixed()
  );
};

export const signIn = () => {
  wallet.requestSignIn(
    {
      contractId: nearConfig.contractName,
      methodNames: [contract.add_comment.name]
    }, //contract requesting access
    "Cryptic Comments" //optional name
  );
};

export const signOut = () => {
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
};
