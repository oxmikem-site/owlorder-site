
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.satsConnect = factory();
  }
}(this, function() {
  console.log("sats-connect UMD loaded");

  async function getAddress(opts) {
    return {
      address: "bc1qexampleaddress1234567890",
      publicKey: "examplepublickey=="
    };
  }

  return {
    getAddress: getAddress
  };
}));
