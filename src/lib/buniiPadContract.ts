// Update this whenever BuniiPad is redeployed — this is the single
// source of truth the site reads from.
export const BUNIIPAD_ADDRESS = "0x2E04eb88d9e9d066D7b0977848ffb02Dd4eaf346";

export const ALLOWLIST_API_URL = "https://buniis-allowlist-production.up.railway.app";

export const EXPLORER = "https://robinhoodchain.blockscout.com";

// Phase enum matches the contract exactly: 0 = Closed, 1 = Allowlist, 2 = Public
export const PHASE = { CLOSED: 0, ALLOWLIST: 1, PUBLIC: 2 } as const;

// TODO: no team wallets carried over from CrocsPad on purpose — those
// were Crocs' own addresses and would be wrong here. Fill in the real
// Bunii team wallet(s) before using the admin page's team-mint presets;
// until then, the admin page's ownerMint panel has no presets to offer.
export const TEAM_WALLETS: readonly string[] = [];

export const BUNIIPAD_ABI = [
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "phase", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "paused", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "allowlistPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "launchpadFee", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPerWalletAllowlist", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPerWalletPublic", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistMinted", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicMinted", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalAllowlistMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalPublicMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalTeamMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MAX_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "TEAM_ALLOCATION", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ALLOWLIST_SUPPLY_CAP", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MINTABLE_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistTimeRemaining", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function", name: "mintAllowlist", stateMutability: "payable",
    inputs: [{ type: "uint256", name: "quantity" }, { type: "bytes32[]", name: "proof" }],
    outputs: [],
  },
  {
    type: "function", name: "mintPublic", stateMutability: "payable",
    inputs: [{ type: "uint256", name: "quantity" }],
    outputs: [],
  },
  {
    type: "function", name: "ownerMint", stateMutability: "nonpayable",
    inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "quantity" }],
    outputs: [],
  },
  {
    type: "function", name: "setMerkleRoot", stateMutability: "nonpayable",
    inputs: [{ type: "bytes32", name: "root" }],
    outputs: [],
  },
  {
    type: "function", name: "setPhase", stateMutability: "nonpayable",
    inputs: [{ type: "uint8", name: "newPhase" }],
    outputs: [],
  },
] as const;
