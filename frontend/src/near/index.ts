import { keyStores, Near, WalletConnection, Contract } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig("development");
export const CONTRACT_ID =
  process.env.NODE_ENV === "development"
    ? "whilesj.testnet"
    : "whilesj.testnet"; // smart

export const near = new Near({
  networkId: nearConfig.networkId,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: nearConfig.nodeUrl,
  walletUrl: nearConfig.walletUrl,
  headers: {}
});


export const wallet = new WalletConnection(near, CONTRACT_ID);
export const accountId = wallet.getAccountId();

const contract = new Contract(
  wallet.account(),
  CONTRACT_ID,
  {
    viewMethods: ["get_comments"], // view methods do not change state but usually return a value
    changeMethods: [], // change methods modify state
  }
);

// export function logout() {
//   wallet.signOut();
//   localStorage.removeItem(
//     `near-api-js:keystore:${accountId.value}:${nearConfig.networkId}`
//   );
//   accountId.value = wallet.getAccountId();
// }

// export function login() {
//   wallet.requestSignIn(nearConfig.contractName);
// }

// -----------------------------------------------------------------------------------
// view functions
// -----------------------------------------------------------------------------------
// No login is required when calling view methods on a contract
export const getComments = async (postId: string) => {
  // It doesn't pick up that this is a valid function?
  // @ts-expect-error
  const response = await contract.get_comments({ post_id: postId });

  return response
};

// -----------------------------------------------------------------------------------
// change functions
// -----------------------------------------------------------------------------------
