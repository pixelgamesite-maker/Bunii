import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { creamInk, goldLine, plum, plumDeep, plumLift, sans, serif, surface, violetGlow } from "@/lib/bunii-theme";
import { PINNED_TWEET_URL, X_PROFILE_URL, isValidHandle, isXStatusUrl, recordEntry } from "@/lib/bunii-gate";

const STEPS = ["Handle", "Follow", "Comment", "Enter"];

export function ArcadeGate({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [, navigate] = useLocation();

  const [step, setStep] = useState(0);
  const [handle, setHandle] = useState("");
  const [handleErr, setHandleErr] = useState("");
  const [visitedProfile, setVisitedProfile] = useState(false);
  const [visitedTweet, setVisitedTweet] = useState(false);
  const [commentUrl, setCommentUrl] = useState("");
  const [commentErr, setCommentErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  useEffect(() => {
    if (!open) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose, saving]);

  if (!open) return null;

  function submitHandle() {
    if (!isValidHandle(handle)) {
      setHandleErr("Letters, numbers and underscores only — up to 15.");
      return;
    }
    setHandleErr("");
    setStep(1);
  }

  function submitComment() {
    if (!isXStatusUrl(commentUrl)) {
      setCommentErr("Paste the link to your comment on X.");
      return;
    }
    setCommentErr("");
    setStep(3);
  }

  async function enterArcade() {
    setSaveErr("");
    setSaving(true);
    const res = await recordEntry(handle, commentUrl);
    setSaving(false);

    if (!res.ok) {
      setSaveErr(res.message ?? "Couldn't save your entry.");
      return;
    }
    onClose();
    navigate("/game");
  }

  return (
    <div
      className="gate"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <style>{`
        .gate{
          position:fixed;inset:0;z-index:200;
          display:flex;align-items:center;justify-content:center;padding:18px;
          background:${plumDeep}e8;
          backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
          font-family:${sans};color:${creamInk};
          animation:gfade .25s ease both;
        }
        .panel{
          position:relative;width:100%;max-width:440px;
          border-radius:24px;padding:26px 24px 24px;
          background:
            radial-gradient(90% 60% at 50% 0%, ${plumLift} 0%, transparent 70%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}40, 0 50px 90px -40px #000;
          animation:grise .35s cubic-bezier(.2,.7,.25,1) both;
        }
        .close{
          position:absolute;top:16px;right:18px;
          background:none;border:none;cursor:pointer;line-height:1;
          font-size:1.1rem;color:${creamInk}4d;transition:color .2s ease;
        }
        .close:hover{color:${creamInk};}
        .close:disabled{opacity:.3;cursor:default;}

        .rail{display:flex;gap:6px;margin-bottom:20px;}
        .rail span{
          flex:1;height:3px;border-radius:999px;background:${creamInk}1a;
          transition:background .35s ease,box-shadow .35s ease;
        }
        .rail span.on{background:${goldLine};box-shadow:0 0 12px ${goldLine}80;}

        .eyebrow{margin:0 0 6px;font-size:.6rem;letter-spacing:.26em;
          text-transform:uppercase;color:${goldLine};}
        .panel h2{margin:0 0 8px;font-family:${serif};font-weight:800;
          font-size:1.6rem;line-height:1.1;letter-spacing:-.01em;}
        .panel .lede{margin:0 0 18px;font-weight:300;font-size:.92rem;
          line-height:1.55;color:${creamInk}a6;}

        .field{
          width:100%;background:${plumDeep}cc;color:${creamInk};
          border:1px solid ${goldLine}40;border-radius:999px;
          padding:14px 20px;font-family:${sans};font-size:.9rem;outline:none;
          transition:border-color .2s ease;
        }
        .field:focus{border-color:${goldLine};}
        .field::placeholder{color:${creamInk}40;}

        .btn{
          width:100%;margin-top:12px;
          font-family:${sans};font-size:.76rem;font-weight:600;
          letter-spacing:.18em;text-transform:uppercase;
          color:${plumDeep};background:${goldLine};
          border:none;border-radius:999px;padding:15px;cursor:pointer;
          transition:transform .2s ease,filter .2s ease,opacity .2s ease;
        }
        .btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.08);}
        .btn:disabled{opacity:.35;cursor:not-allowed;}

        .btn--ghost{
          display:block;text-align:center;
          color:${creamInk};background:transparent;border:1px solid ${goldLine}59;
        }
        .btn--ghost:hover{background:${surface};transform:translateY(-2px);}

        .err{margin:8px 0 0;font-size:.8rem;color:#E88A6A;}
        .hint{margin:12px 0 0;font-size:.76rem;line-height:1.5;color:${creamInk}59;}

        .checks{margin:0 0 4px;padding:0;list-style:none;
          display:flex;flex-direction:column;gap:9px;}
        .checks li{display:flex;gap:10px;align-items:flex-start;font-size:.88rem;
          font-weight:300;color:${creamInk}c4;line-height:1.45;}
        .checks i{
          flex-shrink:0;width:18px;height:18px;border-radius:50%;margin-top:1px;
          border:1px solid ${goldLine}66;font-style:normal;
          display:flex;align-items:center;justify-content:center;
          font-size:.62rem;color:${goldLine};
        }

        .done{display:flex;flex-direction:column;align-items:center;
          text-align:center;gap:10px;padding:8px 0 4px;}
        .seal{
          width:58px;height:58px;border-radius:50%;
          background:radial-gradient(circle at 34% 30%, #F0E2C4, ${goldLine});
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 34px -6px ${goldLine}aa;
          animation:gstamp .5s cubic-bezier(.2,1.3,.4,1) both;
        }
        .handle{font-family:${serif};font-weight:800;font-size:1.05rem;color:${goldLine};}

        @keyframes gfade{from{opacity:0}to{opacity:1}}
        @keyframes grise{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes gstamp{from{transform:scale(0) rotate(-16deg);opacity:0}to{transform:none;opacity:1}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
      `}</style>

      <div className="panel" role="dialog" aria-modal="true" aria-label="Arcade entry">
        <button className="close" onClick={onClose} disabled={saving} aria-label="Close">
          ✕
        </button>

        <div className="rail">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? "on" : ""} />
          ))}
        </div>

        {step === 0 && (
          <>
            <p className="eyebrow">Step one of four</p>
            <h2>Who's playing?</h2>
            <p className="lede">Your X handle holds your spot. No password, no wallet yet.</p>
            <input
              className="field"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="@yourhandle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitHandle();
              }}
            />
            {handleErr && <p className="err">{handleErr}</p>}
            <button className="btn" onClick={submitHandle} disabled={!handle.trim()}>
              Done
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="eyebrow">Step two of four</p>
            <h2>Follow Bunii.</h2>
            <p className="lede">The arcade opens to followers. Takes a second.</p>
            <a
              className="btn btn--ghost"
              href={X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setVisitedProfile(true)}
            >
              Open X and follow
            </a>
            <button className="btn" onClick={() => setStep(2)} disabled={!visitedProfile}>
              I followed
            </button>
            {!visitedProfile && <p className="hint">Open the link first — the button unlocks after.</p>}
          </>
        )}

        {step === 2 && (
          <>
            <p className="eyebrow">Step three of four</p>
            <h2>Like, comment, tag two.</h2>
            <ul className="checks">
              <li>
                <i>1</i>Like the pinned post.
              </li>
              <li>
                <i>2</i>Comment on it and tag two frens.
              </li>
              <li>
                <i>3</i>Copy your comment's link and paste it below.
              </li>
            </ul>
            <a
              className="btn btn--ghost"
              href={PINNED_TWEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setVisitedTweet(true)}
            >
              Open the pinned post
            </a>
            <input
              className="field"
              style={{ marginTop: "12px" }}
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://x.com/you/status/..."
              value={commentUrl}
              onChange={(e) => setCommentUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitComment();
              }}
            />
            {commentErr && <p className="err">{commentErr}</p>}
            <button className="btn" onClick={submitComment} disabled={!visitedTweet || !commentUrl.trim()}>
              Submit link
            </button>
          </>
        )}

        {step === 3 && (
          <div className="done">
            <div className="seal">
              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" aria-hidden>
                <path d="M2 9.5L8.5 16L22 2.5" stroke={plumDeep} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="eyebrow" style={{ margin: 0 }}>
              Cleared
            </p>
            <h2 style={{ margin: 0 }}>The doors are open.</h2>
            <p className="handle">@{handle.replace(/^@/, "")}</p>
            <p className="lede" style={{ margin: 0 }}>
              You won't be asked again on this device.
            </p>
            {saveErr && <p className="err">{saveErr}</p>}
            <button className="btn" onClick={enterArcade} disabled={saving}>
              {saving ? "Saving..." : "Step into the arcade"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
