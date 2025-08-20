/**
 * Local mirror of sats-connect@3.6.1 ESM bundle.
 * Imports rewritten to absolute jsDelivr URLs so it can be loaded from your domain.
 * Original: https://cdn.jsdelivr.net/npm/sats-connect@3.6.1/+esm
 */
import {
  defaultAdapters as e,
  getSupportedWallets as r,
  removeDefaultProvider as t,
  getDefaultProvider as s,
  RpcErrorCode as o,
  BaseAdapter as i,
  setDefaultProvider as d
} from "https://cdn.jsdelivr.net/npm/@sats-connect/core@0.6.11/+esm";

export * from "https://cdn.jsdelivr.net/npm/@sats-connect/core@0.6.11/+esm";

import { makeDefaultConfig as a } from "https://cdn.jsdelivr.net/npm/@sats-connect/make-default-provider-config@0.0.10/+esm";
import {
  selectWalletProvider as n,
  loadSelector as c,
  walletOpen as l,
  walletClose as p,
  close as u
} from "https://cdn.jsdelivr.net/npm/@sats-connect/ui@0.0.7/+esm";

var h = new class {
  providerId;
  defaultAdapters = e;
  createCustomConfig;

  isProviderSet() { return !!this.providerId; }

  setCreateCustomConfig(e) { this.createCustomConfig = e; }

  async selectProvider() {
    const list = r();
    if (list.length === 0) {
      throw new Error("No wallets detected, may want to prompt user to install a wallet.");
    }
    const cfg = this.createCustomConfig ? this.createCustomConfig(list) : a(list);
    const chosen = await n(cfg);
    this.providerId = chosen;
  }

  async disconnect() {
    await this.request("wallet_renouncePermissions", void 0);
    this.providerId = void 0;
    t();
  }

  async request(method, params) {
    c();
    const def = s();

    if (!this.isProviderSet()) {
      if (def) {
        this.providerId = def;
      } else {
        try {
          await this.selectProvider();
        } catch {
          return {
            status: "error",
            error: {
              code: o.INTERNAL_ERROR,
              message:
                "Failed to select the provider. User may have cancelled the selection prompt."
            }
          };
        }
      }
    }

    const Adapter = this.defaultAdapters[this.providerId];
    l(this.providerId);
    const res = Adapter
      ? await new Adapter().request(method, params)
      : await new i(this.providerId).request(method, params);

    p();

    if (res?.status === "error" && res.error?.code === o.USER_REJECTION) {
      if (!def) this.providerId = void 0;
    } else {
      d(this.providerId);
    }

    u();

    return (
      res || {
        status: "error",
        error: { code: o.INTERNAL_ERROR, message: "Wallet Error processing the request" }
      }
    );
  }

  addListener = (event, handler) => {
    const def = s();
    if (!this.isProviderSet() && def) this.providerId = def;
    if (!this.isProviderSet()) {
      console.error(
        "No wallet provider selected. The user must first select a wallet before adding listeners to wallet events."
      );
      return () => {};
    }
    const Adapter = this.defaultAdapters[this.providerId];
    if (Adapter && new Adapter().addListener) {
      return new Adapter().addListener(event, handler);
    }
    console.error(
      "The wallet provider you are using does not support the addListener method. Please update your wallet provider."
    );
    return () => {};
  };
};

// default експорт як у CDN-версії
export default h;

// додатково іменований експорт для зручності
export const request = (...args) => h.request(...args);

