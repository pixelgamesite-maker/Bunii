import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  zerionWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { defineChain, http } from "viem";

// Set in Railway (and a local .env for dev) as VITE_ALCHEMY_API_KEY.
// Get a free key at https://dashboard.alchemy.com/signup — Robinhood
// Chain is natively supported, mainnet and testnet both.
// Left unset, everything still works: the transports below fall back to
// each chain's public rpcUrls automatically, just without the higher
// rate limits Alchemy provides.
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY as string | undefined;

// Robinhood Chain mainnet, per official docs.
export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  // This stays the public RPC on purpose — it's what a wallet like
  // MetaMask reads when a visitor adds the network for the first time,
  // independent of which transport our own app uses below.
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
  testnet: false,
});

// Robinhood Chain testnet.
export const robinhoodChainTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.testnet.chain.robinhood.com" },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "BuniiPad",
  // Get a free project ID at https://cloud.walletconnect.com
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [robinhoodChain, robinhoodChainTestnet],
  // This is what actually decides which RPC the app's own reads and
  // writes go through — separate from each chain's rpcUrls above.
  // http(undefined) falls back to the chain's default RPC, so this is
  // safe to deploy even before VITE_ALCHEMY_API_KEY is set.
  transports: {
    [robinhoodChain.id]: http(ALCHEMY_KEY ? `https://robinhood-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
    [robinhoodChainTestnet.id]: http(ALCHEMY_KEY ? `https://robinhood-testnet.g.alchemy.com/v2/${ALCHEMY_KEY}` : undefined),
  },
  ssr: false,
  wallets: [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, zerionWallet, rainbowWallet, coinbaseWallet, trustWallet, walletConnectWallet],
    },
    {
      // Catches any other injected wallet extension (Rabby, Brave Wallet,
      // etc.) that isn't explicitly listed above.
      groupName: "Other",
      wallets: [injectedWallet],
    },
  ],
});
