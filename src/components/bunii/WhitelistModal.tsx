import { useEffect, useState, type CSSProperties, type FocusEvent } from "react";
import { gold, goldLight, sans, serif } from "@/lib/bunii-theme";
import { PINNED_TWEET_URL } from "@/lib/bunii-data";
import { supabase } from "@/lib/supabase";
import { isValidEvm, isValidUrl } from "@/lib/validators";
import { FlipCard } from "./FlipCard";

const inp: CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,0.5)",
  border: `1px solid ${gold}22`,
  borderRadius: "6px",
  padding: "9px 11px",
  fontSize: "0.8rem",
  color: "#fff",
  fontFamily: sans,
  outline: "none",
  transition: "border 0.2s",
  boxSizing: "border-box",
};

function focusInp(e: FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = `${gold}66`;
}
function blurInp(e: FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = `${gold}22`;
}

/**
 * Whitelist ("BuniiList") application modal.
 * Fully self-contained: owns its own form state, mission-completion state,
 * localStorage persistence, and Supabase submission. The parent only needs
 * to render <WhitelistModal open={} onClose={} />.
 */
export function WhitelistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [twitter, setTwitter] = useState("");
  const [wallet, setWallet] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [twitterConfirmed, setTwitterConfirmed] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [walletConfirmed, setWalletConfirmed] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("bunii_whitelist_v1");
      if (s) {
        const p = JSON.parse(s);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
      const submitted = localStorage.getItem("bunii_whitelist_submitted");
      if (submitted === "true") setAlreadySubmitted(true);
    } catch {
      // localStorage unavailable — form just won't persist across reloads
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("bunii_whitelist_v1", JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
      } catch {
        // ignore
      }
    }
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = quoteConfirmed && isValidUrl(quoteUrl);
  const c4 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;

  async function submit() {
    if (!allDone) {
      setErr("Complete all missions first.");
      return;
    }
    if (alreadySubmitted) {
      setErr("You have already submitted an application.");
      return;
    }

    setErr("");
    setSending(true);

    const { error: e } = await supabase.from("bunii_whitelist").insert([
      {
        wallet: wallet.trim(),
        twitter: twitter.trim(),
        quote_url: quoteUrl.trim(),
      },
    ]);

    setSending(false);

    if (e) {
      setErr("Something went wrong. Try again.");
    } else {
      setSuccess(true);
      try {
        localStorage.setItem("bunii_whitelist_submitted", "true");
      } catch {
        // ignore
      }
      setAlreadySubmitted(true);
    }
  }

  function closeModal() {
    onClose();
    if (!alreadySubmitted) {
      setSuccess(false);
      setErr("");
    }
  }

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "94vh",
          overflowY: "auto",
          background: "#0d0b07",
          border: `1px solid ${gold}22`,
          borderRadius: "16px",
          padding: "28px 22px 24px",
          animation: "modalIn 0.3s ease both",
          position: "relative",
          boxShadow: `0 40px 80px rgba(0,0,0,0.9), 0 0 60px ${gold}08`,
        }}
      >
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.22)",
            fontSize: "1.1rem",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {alreadySubmitted ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: `${gold}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M2 9L8 15L20 2" stroke={gold} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase", color: gold, margin: "0 0 6px" }}>
              Already Applied
            </p>
            <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Application Received.</h2>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.6 }}>
              Your spot has been saved. Selected wallets will be added before mint.
            </p>
            <button
              onClick={closeModal}
              style={{
                marginTop: "24px",
                fontFamily: sans,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#050504",
                background: gold,
                border: "none",
                borderRadius: "6px",
                padding: "12px 28px",
                cursor: "pointer",
              }}
            >
              BACK TO HOME
            </button>
          </div>
        ) : success ? (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                animation: "stamp 0.5s cubic-bezier(0.23,1,0.32,1) both",
                boxShadow: `0 8px 24px ${gold}44`,
              }}
            >
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M2 9L8 15L20 2" stroke="#0a0800" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase", color: gold, margin: "0 0 6px" }}>
              Application Sent
            </p>
            <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>You Are Under Review.</h2>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.6 }}>
              Selected wallets will be added before mint.
            </p>
            <button
              onClick={closeModal}
              style={{
                marginTop: "24px",
                fontFamily: sans,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#050504",
                background: gold,
                border: "none",
                borderRadius: "6px",
                padding: "12px 28px",
                cursor: "pointer",
              }}
            >
              BACK TO HOME
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "22px" }}>
              <p style={{ fontFamily: sans, fontSize: "0.55rem", letterSpacing: "0.26em", textTransform: "uppercase", color: gold, margin: "0 0 4px" }}>
                BuniiList Application
              </p>
              <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "0.02em" }}>
                Claim Your Spot
              </h2>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", margin: "0 0 14px", lineHeight: 1.5 }}>
                Complete the missions and submit your wallet for BuniiList review.
              </p>
              <div style={{ height: "2px", background: `${gold}18`, borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: "2px",
                    background: `linear-gradient(90deg,${gold},${goldLight})`,
                    width: `${([c1, c2, c3, c4].filter(Boolean).length / 4) * 100}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <p style={{ fontFamily: sans, fontSize: "0.62rem", color: `${gold}66`, margin: "6px 0 0", letterSpacing: "0.08em" }}>
                {[c1, c2, c3, c4].filter(Boolean).length} of 4 missions complete
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {/* Card 1 — X Handle */}
              <FlipCard index={0} icon="𝕏" title="Who Are You?" subtitle="Mission 01 / 04" done={c1} locked={false}>
                <p style={{ margin: "0 0 7px", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Your X handle
                </p>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setTwitterConfirmed(true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={inp}
                  onFocus={focusInp}
                  onBlur={blurInp}
                />
                {!c1 && twitter.trim().length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTwitterConfirmed(true);
                    }}
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      background: `${gold}22`,
                      color: gold,
                      border: `1px solid ${gold}44`,
                      borderRadius: "4px",
                      padding: "6px",
                      fontFamily: sans,
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Confirm
                  </button>
                )}
                {c1 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "5px 0 0" }}>Identity confirmed</p>}
              </FlipCard>

              {/* Card 2 — Like & Tag 2 friends */}
              <FlipCard
                index={1}
                icon="↺"
                title="Like & Tag 2 Frens"
                subtitle="Mission 02 / 04"
                done={c2}
                locked={!c1}
                onFlip={() => {
                  window.open(PINNED_TWEET_URL, "_blank");
                  setTimeout(() => setTasks((p) => ({ ...p, like: true })), 800);
                }}
              >
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                  {c2 ? "Like & comment confirmed." : "Like the pinned post and tag 2 friends in the comments on X."}
                </p>
                {c2 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "8px 0 0" }}>Missions done</p>}
              </FlipCard>

              {/* Card 3 — Quote Pinned Tweet */}
              <FlipCard
                index={2}
                icon="↗"
                title="Quote Pinned Tweet"
                subtitle="Mission 03 / 04"
                done={c3}
                locked={!c2}
                onFlip={() => {
                  window.open(PINNED_TWEET_URL, "_blank");
                }}
              >
                {!c3 ? (
                  <>
                    <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                      Quote the pinned tweet on X with "BUNII" and tag 2 friends. Then paste your quote link below.
                    </p>
                    <p style={{ margin: "8px 0 0", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Quote tweet link
                    </p>
                    <input
                      type="url"
                      placeholder="https://x.com/yourhandle/status/..."
                      value={quoteUrl}
                      onChange={(e) => setQuoteUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isValidUrl(quoteUrl)) setQuoteConfirmed(true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={inp}
                      onFocus={focusInp}
                      onBlur={blurInp}
                    />
                    {quoteUrl && !isValidUrl(quoteUrl) && (
                      <p style={{ fontFamily: sans, fontSize: "0.6rem", color: "#e05050", margin: "4px 0 0" }}>Needs valid http:// or https:// link</p>
                    )}
                    {isValidUrl(quoteUrl) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuoteConfirmed(true);
                        }}
                        style={{
                          marginTop: "8px",
                          width: "100%",
                          background: `${gold}22`,
                          color: gold,
                          border: `1px solid ${gold}44`,
                          borderRadius: "4px",
                          padding: "6px",
                          fontFamily: sans,
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        Verify Link
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: 0 }}>Quote verified</p>
                )}
              </FlipCard>

              {/* Card 4 — Wallet */}
              <FlipCard index={3} icon="◈" title="Claim Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                <p style={{ margin: "0 0 7px", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  EVM address
                </p>
                <input
                  type="text"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidEvm(wallet)) setWalletConfirmed(true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={inp}
                  onFocus={focusInp}
                  onBlur={blurInp}
                />
                {wallet && !isValidEvm(wallet) && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: "#e05050", margin: "4px 0 0" }}>Invalid address</p>}
                {!c4 && isValidEvm(wallet) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWalletConfirmed(true);
                    }}
                    style={{
                      marginTop: "8px",
                      width: "100%",
                      background: `${gold}22`,
                      color: gold,
                      border: `1px solid ${gold}44`,
                      borderRadius: "4px",
                      padding: "6px",
                      fontFamily: sans,
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Confirm Wallet
                  </button>
                )}
                {c4 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "4px 0 0" }}>Wallet confirmed</p>}
                <p style={{ fontFamily: sans, fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", margin: "6px 0 0", lineHeight: 1.4 }}>
                  Never share private keys or seed phrases.
                </p>
              </FlipCard>
            </div>

            {err && <p style={{ fontFamily: sans, fontSize: "0.78rem", color: "#e05050", margin: "0 0 10px", fontWeight: 500 }}>{err}</p>}

            <button
              onClick={submit}
              disabled={sending || !allDone}
              style={{
                width: "100%",
                background: allDone ? gold : "rgba(255,255,255,0.04)",
                color: allDone ? "#050504" : "rgba(255,255,255,0.18)",
                border: `1px solid ${allDone ? gold : "rgba(255,255,255,0.06)"}`,
                borderRadius: "6px",
                padding: "15px",
                fontFamily: sans,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: allDone && !sending ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                boxShadow: allDone ? `0 8px 24px ${gold}33` : "none",
              }}
            >
              {sending ? "Saving..." : allDone ? "JOIN THE BUNIILIST" : "Complete all missions to unlock"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
