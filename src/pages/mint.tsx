import { useEffect, useState } from "react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { color, displayType, radius } from "@/lib/theme";
import { BUNIIPAD_ADDRESS, BUNIIPAD_ABI, ALLOWLIST_API_URL, PHASE, MINTABLE_START_UTC } from "@/lib/buniiPadContract";
import BuniiFrame from "@/components/bunii-frame";
import MintFeed from "@/components/mint-feed";
import PhaseTracks from "@/components/phase-tracks";
import TeamMint from "@/components/team-mint";

const PHASE_LABEL: Record<number, string> = {
  [PHASE.CLOSED]: "Minting soon",
  [PHASE.ALLOWLIST]: "Allowlist live",
  [PHASE.PUBLIC]: "Public live",
};

// Text and hairlines on the night console.
const moonSoft = "rgba(255,246,226,0.64)";

/** Same as phase-tracks.tsx's helper: renders a fixed UTC instant in the
 * visitor's own local timezone, Discord-timestamp style. */
function formatLocalStart(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(date);
}
const moonLine = "rgba(255,246,226,0.12)";

/** Circular progress for total minted — the console's centre readout. */
function Ring({ minted, supply }: { minted: number | null; supply: number | null }) {
  const size = 156, stroke = 11, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const pct = minted !== null && supply ? Math.min(1, minted / supply) : 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={moonLine} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color.brand} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.2,0,0,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <p style={{ ...displayType, fontWeight: 700, fontSize: "1.9rem", letterSpacing: "-0.03em", margin: 0, color: color.moon }}>
            {minted !== null ? minted.toLocaleString() : "—"}
          </p>
          <p style={{ fontSize: "0.8rem", color: moonSoft, margin: "2px 0 0" }}>
            of {supply !== null ? supply.toLocaleString() : "—"} minted
          </p>
        </div>
      </div>
    </div>
  );
}

const ZERO = "0x0000000000000000000000000000000000000000" as const;

export default function Mint() {
  const { address, isConnected } = useAccount();

  const read = (functionName: string, args?: readonly unknown[]) =>
    ({ address: BUNIIPAD_ADDRESS, abi: BUNIIPAD_ABI, functionName, ...(args ? { args } : {}) });

  const { data, refetch } = useReadContracts({
    contracts: [
      read("owner"),
      read("phase"),
      read("paused"),
      read("allowlistPrice"),
      read("publicPrice"),
      read("launchpadFee"),
      read("maxPerWalletAllowlist"),
      read("maxPerWalletPublic"),
      read("totalAllowlistMinted"),
      read("totalPublicMinted"),
      read("totalTeamMinted"),
      read("totalSupply"),
      read("MAX_SUPPLY"),
      read("TEAM_ALLOCATION"),
      read("ALLOWLIST_SUPPLY_CAP"),
      read("MINTABLE_SUPPLY"),
      read("allowlistTimeRemaining"),
      read("allowlistMinted", [address ?? ZERO]),
      read("publicMinted", [address ?? ZERO]),
    ] as any,
    query: { refetchInterval: 12000 },
  });

  const [
    owner, phase, paused, allowlistPrice, publicPrice, launchpadFee,
    maxAL, maxPub, totalAL, totalPub, totalTeam, totalSupply,
    maxSupply, teamCap, alCap, mintableSupply, allowlistTimeRemaining, myAL, myPub,
  ] = data?.map((d) => d.result) ?? [];

  const phaseNum = phase !== undefined ? Number(phase) : PHASE.CLOSED;
  const isAllowlist = phaseNum === PHASE.ALLOWLIST;
  const isClosed = phaseNum === PHASE.CLOSED;

  /* ---- countdown — resyncs from chain every refetch, ticks locally between ---- */
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (allowlistTimeRemaining === undefined) return;
    setSecondsLeft(Number(allowlistTimeRemaining));
  }, [allowlistTimeRemaining]);
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => (s !== null ? Math.max(0, s - 1) : s)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft !== null && secondsLeft > 0]);

  function formatDuration(total: number) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  }

  /* ---- eligibility ---- */
  const [elig, setElig] = useState<"idle" | "checking" | "yes" | "no" | "error">("idle");
  const [proof, setProof] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !isAllowlist) { setElig("idle"); setProof(null); return; }
    let cancelled = false;
    setElig("checking");
    fetch(`${ALLOWLIST_API_URL}/api/allowlist-proof?address=${address}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(({ eligible, proof: p }) => {
        if (cancelled) return;
        setElig(eligible ? "yes" : "no");
        setProof(p);
      })
      .catch(() => { if (!cancelled) setElig("error"); });
    return () => { cancelled = true; };
  }, [isConnected, address, isAllowlist]);

  /* ---- mint ---- */
  const [qty, setQty] = useState(1);
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) refetch(); }, [isSuccess]);

  const price = isAllowlist ? allowlistPrice : publicPrice;
  const walletCap = isAllowlist ? maxAL : maxPub;
  const mine = isAllowlist ? myAL : myPub;
  const myLeft = walletCap !== undefined && mine !== undefined ? Number(walletCap) - Number(mine) : null;

  const poolLeft =
    mintableSupply !== undefined && totalAL !== undefined && totalPub !== undefined
      ? Number(mintableSupply) - Number(totalAL) - Number(totalPub)
      : null;

  // The real ceiling on qty: whichever of "what's left on this wallet"
  // and "what's left in the pool" is smaller. myLeft can be enormous
  // (maxPerWalletPublic is deployed as unlimited), so without poolLeft
  // in this comparison the stepper would let you dial past what the
  // contract can actually mint before canMint disables the button with
  // no visual max in between.
  const qtyCap = [myLeft, poolLeft].filter((n): n is number => n !== null && n > 0);
  const maxQty = qtyCap.length > 0 ? Math.min(...qtyCap) : 1;

  // Keep qty inside the ceiling as it moves (phase change, live supply
  // ticking down, wallet switch) rather than only clamping on click.
  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, maxQty)));
  }, [maxQty]);

  const unitCost = price !== undefined && launchpadFee !== undefined ? BigInt(price as bigint) + BigInt(launchpadFee as bigint) : null;
  const totalCost = unitCost !== null ? formatEther(unitCost * BigInt(qty)) : null;

  const saleOpen = phaseNum !== PHASE.CLOSED;
  const canMint =
    isConnected && !paused && saleOpen &&
    (phaseNum === PHASE.PUBLIC || (isAllowlist && elig === "yes" && !!proof)) &&
    qty > 0 && (myLeft === null || qty <= myLeft) && (poolLeft === null || qty <= poolLeft);

  function mint() {
    if (unitCost === null) return;
    reset();
    const value = unitCost * BigInt(qty);
    if (isAllowlist && proof) {
      writeContract({ address: BUNIIPAD_ADDRESS, abi: BUNIIPAD_ABI, functionName: "mintAllowlist", args: [BigInt(qty), proof as `0x${string}`[]], value });
    } else {
      writeContract({ address: BUNIIPAD_ADDRESS, abi: BUNIIPAD_ABI, functionName: "mintPublic", args: [BigInt(qty)], value });
    }
  }

  const minted = totalSupply !== undefined ? Number(totalSupply) : null;
  const supply = maxSupply !== undefined ? Number(maxSupply) : null;
  const pct = minted !== null && supply ? (minted / supply) * 100 : 0;
  const soldOut = minted !== null && supply !== null && minted >= supply;

  function buttonLabel() {
    if (!isConnected) return "Connect your wallet to mint";
    if (paused) return "Minting is paused";
    if (!saleOpen) return "Minting hasn't opened yet";
    if (isAllowlist && elig === "checking") return "Checking your spot…";
    if (isAllowlist && elig === "no") return "This wallet isn't on the allowlist";
    if (isAllowlist && elig === "error") return "Couldn't check eligibility";
    if (myLeft !== null && myLeft <= 0) return "You've reached your wallet limit";
    if (isPending) return "Confirm in your wallet";
    if (confirming) return "Minting…";
    return `Mint ${qty} Bunii`;
  }

  const unitLabel =
    price === undefined ? "—" : BigInt(price as bigint) === 0n ? "Free" : `${formatEther(BigInt(price as bigint))} ETH`;
  const limitLabel =
    walletCap === undefined ? "—"
      : BigInt(walletCap as bigint) > 1_000_000n ? "No limit"
      : `${Number(walletCap)} per wallet`;

  const statusBg = soldOut ? color.moon : paused ? color.tongue : !saleOpen ? moonLine : color.brand;
  const statusFg = soldOut ? color.ink : !saleOpen ? color.moon : "#fff";

  const stepBtn: React.CSSProperties = {
    width: "46px", height: "46px", borderRadius: "50%", border: "none", cursor: "pointer",
    background: moonLine, color: color.moon, fontSize: "1.4rem", lineHeight: 1,
    display: "grid", placeItems: "center",
  };

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "32px 20px 0" }}>
      <style>{`
        .qty-input::-webkit-outer-spin-button,
        .qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
      {/* ── the burrow: night console ── */}
      <section
        style={{
          position: "relative", overflow: "hidden", borderRadius: "36px",
          background: color.deep, color: color.moon,
          padding: "clamp(24px, 5vw, 56px)",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute", width: "220px", height: "220px", borderRadius: "50%",
            background: color.sun, top: "-120px", left: "-60px", opacity: 0.9,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(32px, 5vw, 64px)", alignItems: "center",
          }}
        >
          {/* art */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BuniiFrame width={400} aspect={0.8} tone="dark" />
          </div>

          {/* console */}
          <div>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "7px 14px", borderRadius: radius.pill,
                background: statusBg, color: statusFg, fontSize: "0.86rem", fontWeight: 700,
              }}
            >
              {saleOpen && !paused && !soldOut && (
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fff", animation: "pulse 1.6s ease-in-out infinite" }} />
              )}
              {soldOut ? "Sold out" : paused ? "Paused" : PHASE_LABEL[phaseNum]}
            </span>

            <h1
              style={{
                ...displayType, fontWeight: 700, color: color.moon,
                fontSize: "clamp(3rem, 8vw, 4.8rem)", lineHeight: 0.95, letterSpacing: "-0.045em",
                margin: "18px 0 8px",
              }}
            >
              Bunii
            </h1>
            <p style={{ color: moonSoft, fontSize: "1.02rem", margin: "0 0 28px" }}>
              The genesis collection of 10,000, first to launch on BuniiPad.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "26px", flexWrap: "wrap", marginBottom: "28px" }}>
              <Ring minted={minted} supply={supply} />
              <dl style={{ margin: 0, display: "grid", gap: "14px", minWidth: "160px" }}>
                <div>
                  <dt style={{ fontSize: "0.84rem", color: moonSoft }}>Price</dt>
                  <dd style={{ ...displayType, margin: "2px 0 0", fontSize: "1.45rem", fontWeight: 650, letterSpacing: "-0.02em" }}>{unitLabel}</dd>
                </div>
                {isClosed ? (
                  <div>
                    <dt style={{ fontSize: "0.84rem", color: moonSoft }}>Starts</dt>
                    <dd style={{ margin: "2px 0 0", fontSize: "1.02rem", fontWeight: 600 }}>
                      {formatLocalStart(MINTABLE_START_UTC)}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt style={{ fontSize: "0.84rem", color: moonSoft }}>Limit</dt>
                    <dd style={{ margin: "2px 0 0", fontSize: "1.02rem", fontWeight: 600 }}>
                      {limitLabel}
                      {isConnected && mine !== undefined && myLeft !== null && myLeft < 1_000_000 && (
                        <span style={{ color: moonSoft, fontWeight: 500 }}> · {Math.max(0, myLeft)} left for you</span>
                      )}
                    </dd>
                  </div>
                )}
                {poolLeft !== null && (
                  <div>
                    <dt style={{ fontSize: "0.84rem", color: moonSoft }}>Available now</dt>
                    <dd style={{ margin: "2px 0 0", fontSize: "1.02rem", fontWeight: 600 }}>{Math.max(0, poolLeft).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            {!soldOut && isAllowlist && secondsLeft !== null && secondsLeft > 0 && (
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap",
                  padding: "14px 18px", borderRadius: radius.md, background: color.deepRaised, marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "0.9rem", color: moonSoft }}>Suggested allowlist window</span>
                <span style={{ ...displayType, fontSize: "1.4rem", fontWeight: 650, color: color.sun }}>{formatDuration(secondsLeft)}</span>
              </div>
            )}

            {soldOut ? (
              <div style={{ padding: "22px", borderRadius: radius.md, background: color.deepRaised }}>
                <p style={{ ...displayType, fontSize: "1.5rem", fontWeight: 650, margin: "0 0 6px" }}>Every Bunii has a home.</p>
                <p style={{ color: moonSoft, margin: 0 }}>Minting is closed. Find Bunii on secondary marketplaces.</p>
              </div>
            ) : (
              <>
                {/* quantity */}
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px", borderRadius: radius.pill, background: color.deepRaised, marginBottom: "14px",
                  }}
                >
                  <button className="press" style={stepBtn} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease amount">−</button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={Math.max(1, maxQty)}
                    value={qty}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") { setQty(1); return; }
                      const n = Math.floor(Number(v));
                      if (!Number.isFinite(n)) return;
                      setQty(Math.min(Math.max(1, n), Math.max(1, maxQty)));
                    }}
                    onBlur={() => setQty((q) => Math.min(Math.max(1, q), Math.max(1, maxQty)))}
                    aria-label="Amount to mint"
                    className="qty-input"
                    style={{
                      ...displayType, flex: 1, textAlign: "center", fontSize: "1.7rem", fontWeight: 700,
                      background: "transparent", border: "none", color: color.moon, width: "100%",
                      outline: "none", MozAppearance: "textfield",
                    }}
                  />
                  <button className="press" style={stepBtn} onClick={() => setQty((q) => Math.min(Math.max(1, maxQty), q + 1))} aria-label="Increase amount">+</button>
                  <button
                    onClick={() => setQty(Math.max(1, maxQty))}
                    disabled={maxQty <= 1}
                    aria-label="Set to the maximum you can mint"
                    style={{
                      height: "46px", padding: "0 18px", borderRadius: radius.pill, border: "none",
                      background: "transparent", boxShadow: `inset 0 0 0 1px ${moonLine}`,
                      color: maxQty > 1 ? color.moon : moonSoft, fontWeight: 700, fontSize: "0.9rem",
                      cursor: maxQty > 1 ? "pointer" : "not-allowed",
                    }}
                  >
                    Max
                  </button>
                </div>

                {isConnected && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 6px 18px" }}>
                    <span style={{ color: moonSoft, fontSize: "0.94rem" }}>Total, including platform fee</span>
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                      {totalCost === null ? "—" : Number(totalCost) === 0 ? "Free" : `${totalCost} ETH`}
                    </span>
                  </div>
                )}

                <button
                  onClick={mint}
                  disabled={!canMint || isPending || confirming}
                  className={canMint ? "press" : undefined}
                  style={{
                    width: "100%", height: "60px", borderRadius: radius.pill, border: "none",
                    fontWeight: 700, fontSize: "1.05rem",
                    cursor: canMint && !isPending && !confirming ? "pointer" : "not-allowed",
                    background: canMint ? color.sun : moonLine,
                    color: canMint ? color.ink : moonSoft,
                  }}
                >
                  {buttonLabel()}
                </button>

                {writeError && (
                  <p role="alert" style={{ fontSize: "0.9rem", color: "#FF8FA3", margin: "14px 4px 0" }}>
                    {(writeError as any).shortMessage ?? "The transaction didn't go through. Try again."}
                  </p>
                )}
                {isSuccess && (
                  <p style={{ fontSize: "0.95rem", color: color.sun, margin: "14px 4px 0", fontWeight: 600 }}>
                    Minted. Welcome to The Warren.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── below the burrow ── */}
      <div
        style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px", alignItems: "start", marginTop: "24px",
        }}
      >
        <PhaseTracks
          phase={phaseNum}
          teamMinted={totalTeam}
          teamCap={teamCap}
          allowlistMinted={totalAL}
          publicMinted={totalPub}
          mintableSupply={mintableSupply}
          elig={elig}
          isConnected={isConnected}
        />
        <MintFeed />
      </div>

      {!soldOut && (
        <div style={{ marginTop: "20px" }}>
          <TeamMint owner={owner} teamMinted={totalTeam} teamCap={teamCap} onMinted={refetch} />
        </div>
      )}
    </div>
  );
}
