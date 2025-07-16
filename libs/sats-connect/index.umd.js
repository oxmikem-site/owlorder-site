(function(global) {
  "use strict";
  console.log("Standalone sats-connect UMD loaded");

  async function selectWallet({ provider, network }) {
    alert("Simulated selectWallet: " + provider + " / " + network.type);
    return { provider, network };
  }

  async function getAccounts() {
    return [
      {
        address: "bc1qexampleaddress1234567890",
        publicKey: "03examplepublickeyabcdef",
      },
    ];
  }

  async function signMessage() {
    alert("Simulated signMessage");
  }

  async function sendBtcTransaction() {
    alert("Simulated sendBtcTransaction");
  }

  global.satsConnect = {
    selectWallet,
    getAccounts,
    signMessage,
    sendBtcTransaction
  };
})(typeof window !== "undefined" ? window : this);
