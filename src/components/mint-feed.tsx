import { useEffect, useRef, useState } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { color, displayType, radius } from "@/lib/theme";
import { BUNIIPAD_ADDRESS, BUNIIPAD_ABI } from "@/lib/buniiPadContract";

type FeedRow = { tokenId: string; to: string; key: string };

// Not in the shared ABI — only needed here, so kept local.
const OWNER_OF_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ type: "uint256", name: "tokenId" }],
    outputs: [{ type: "address" }],
  },
] as const;

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function MintFeed() {
  const publicClient = usePublicClient();
  const [rows, setRows] = useState<FeedRow[]>([]);
  const lastSupply = useRef<number | null>(null);

  // Pure eth_call, polled — same proven-working path as the mint page's numbers.
  const { data: totalSupply } = useReadContract({
    address: BUNIIPAD_ADDRESS,
    abi: BUNIIPAD_ABI,
    functionName: "totalSupply",
    query: { refetchInterval: 8000 },
  });

  useEffect(() => {
    if (totalSupply === undefined || !publicClient) return;
    const supply = Number(totalSupply);

    // First read just sets the baseline — nothing to diff against yet.
    if (lastSupply.current === null) {
      lastSupply.current = supply;
      return;
    }

    const prevSupply = lastSupply.current;
    if (supply <= prevSupply) {
      lastSupply.current = supply;
      return;
    }

    lastSupply.current = supply;

    // ERC721A mints sequentially and BuniiPad's token IDs start at 1, so the
    // new IDs are prevSupply + 1 .. supply. (Burns lower totalSupply, which
    // can shift this; the feed is a live indicator, not an audit log.)
    const newIds = Array.from({ length: supply - prevSupply }, (_, i) => prevSupply + i + 1);

    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        newIds.map(async (id) => {
          try {
            const owner = await publicClient.readContract({
              address: BUNIIPAD_ADDRESS,
              abi: OWNER_OF_ABI,
              functionName: "ownerOf",
              args: [BigInt(id)],
            });
            return { tokenId: String(id), to: owner as string, key: `${id}-${owner}` };
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      const fresh = results.filter((r): r is FeedRow => r !== null);
      if (fresh.length === 0) return;
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.key));
        const dedup = fresh.filter((f) => !seen.has(f.key));
        return [...dedup.reverse(), ...prev].slice(0, 12);
      });
    })();

    return () => { cancelled = true; };
  }, [totalSupply, publicClient]);

  return (
    <section style={{ background: color.card, borderRadius: radius.lg, padding: "22px 20px 16px", boxShadow: `inset 0 0 0 1px ${color.line}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 style={{ ...displayType, fontWeight: 650, fontSize: "1.45rem", letterSpacing: "-0.02em", margin: 0 }}>
          Just hopped in
        </h2>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "0.84rem", fontWeight: 600, color: color.inkSoft }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color.brand, animation: "pulse 1.6s ease-in-out infinite" }} />
          Live
        </span>
      </div>

      {rows.length === 0 ? (
        <p style={{ fontSize: "0.94rem", color: color.inkFaint, padding: "28px 0 20px", margin: 0, textAlign: "center" }}>
          New mints show up here as they happen.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: "300px", overflowY: "auto" }}>
          {rows.map((r, i) => (
            <li
              key={r.key}
              style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "10px 0",
                borderTop: i === 0 ? "none" : `1px solid ${color.line}`,
                animation: "feedIn 0.35s ease both",
              }}
            >
              <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: color.paperDeep, display: "grid", placeItems: "center", fontSize: "0.9rem" }} aria-hidden>
                🐇
              </span>
              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Bunii #{r.tokenId}</span>
              <span style={{ marginLeft: "auto", color: color.inkSoft, fontSize: "0.88rem" }}>{short(r.to)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
