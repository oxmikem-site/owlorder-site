(function(e,n){typeof exports=="object"&&typeof module<"u"?n(require("@sats-connect/core")):typeof define=="function"&&define.amd?define(["@sats-connect/core"],n):(e=typeof globalThis<"u"?globalThis:e||self,n(e.SatsConnectCore))})(this,function(e){"use strict";console.log("sats-connect core UMD loaded"),console.log("Imported core:", e);
window.satsConnect={showConnectModal:e.showConnectModal,getAddress:e.getAddress,sendBtcTransaction:e.sendBtcTransaction,signMessage:e.signMessage}});

