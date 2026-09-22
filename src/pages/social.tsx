import { useEffect, useState } from "react";
import { Link } from "wouter";
import { creamInk, goldLine, plum, plumDeep, plumLift, serif, surface } from "@/lib/bunii-theme";
import { useAuth } from "@/lib/auth";
import { claimTask, fetchTasks, type SocialTask } from "@/lib/bunii-api";
import { SiteShell, XGlyph } from "@/components/bunii/SiteShell";
import { SignInCard } from "@/components/bunii/SignInCard";
import { WalletClaim } from "@/components/bunii/WalletClaim";

function TaskRow({ task, done }: { task: SocialTask; done: boolean }) {
  const { applyStatus } = useAuth();
  const [opened, setOpened] = useState(false);
  const [proof, setProof] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function claim() {
    setErr("");
    setBusy(true);
    const res = await claimTask(task.key, task.needs_proof ? proof : undefined);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    applyStatus(res.data);
  }

  // Follow and like can't be verified, so the only friction is making
  // the trip to X. Comment and quote are checked on the server instead.
  const canClaim = task.needs_proof ? proof.trim().length > 0 : opened;

  return (
    <li className={`task${done ? " task--done" : ""}`}>
      <div className="task__head">
        <div className="task__text">
          <p className="task__label">{task.label}</p>
          <p className="task__hint">{done ? "Claimed." : task.hint}</p>
        </div>
        <span className="task__pts">+{task.points}</span>
      </div>

      {!done && (
        <div className="task__body">
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost btn--sm"
            onClick={() => setOpened(true)}
          >
            <XGlyph size={12} />
            Open on X
          </a>

          {task.needs_proof ? (
            <div className="task__proof">
              <input
                className="field"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://x.com/you/status/..."
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canClaim) claim();
                }}
              />
              <button type="button" className="btn btn--sm" onClick={claim} disabled={busy || !canClaim}>
                {busy ? "Checking…" : "Submit"}
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--sm" onClick={claim} disabled={busy || !canClaim}>
              {busy ? "Claiming…" : `Claim +${task.points}`}
            </button>
          )}
        </div>
      )}

      {err && <p className="err">{err}</p>}
    </li>
  );
}

export default function Social() {
  const { session, loading, status, statusError } = useAuth();
  const [tasks, setTasks] = useState<SocialTask[]>([]);
  const [tasksErr, setTasksErr] = useState("");

  useEffect(() => {
    fetchTasks().then((res) => {
      if (res.ok) setTasks(res.data);
      else setTasksErr(res.message);
    });
  }, []);

  const pct = status ? Math.min(100, (status.total / status.threshold) * 100) : 0;

  return (
    <SiteShell>
      <style>{`
        .social{
          flex:1;width:100%;max-width:760px;margin:0 auto;
          display:flex;flex-direction:column;gap:18px;
          padding:clamp(28px,6vh,56px) clamp(16px,4vw,32px) clamp(40px,8vh,80px);
        }
        .social__head{display:flex;flex-direction:column;gap:8px;margin-bottom:6px;}
        .social__head h1{margin:0;font-family:${serif};font-weight:800;
          font-size:clamp(2rem,6vw,2.8rem);line-height:1.02;letter-spacing:-.02em;}
        .social__head .lede{margin:0;font-weight:300;font-size:.98rem;line-height:1.55;
          color:${creamInk}a6;max-width:46ch;}

        .prog{
          border-radius:22px;padding:22px;
          background:
            radial-gradient(90% 70% at 0% 0%, ${plumLift} 0%, transparent 72%),
            linear-gradient(180deg, ${plum} 0%, ${plumDeep} 100%);
          box-shadow:inset 0 0 0 1px ${goldLine}40, 0 30px 60px -34px #000;
        }
        .prog__top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .prog__total{font-family:${serif};font-weight:800;font-size:clamp(2rem,6vw,2.6rem);
          line-height:1;color:${goldLine};font-variant-numeric:tabular-nums;}
        .prog__total small{font-family:inherit;font-size:.45em;color:${creamInk}73;margin-left:6px;}
        .prog__bar{height:6px;border-radius:999px;background:${creamInk}14;overflow:hidden;margin:16px 0 14px;}
        .prog__bar span{display:block;height:100%;border-radius:999px;
          background:linear-gradient(90deg, ${goldLine}, #F0D29A);box-shadow:0 0 14px ${goldLine}99;
          transition:width .7s cubic-bezier(.2,.7,.25,1);}
        .prog__split{display:flex;gap:22px;flex-wrap:wrap;font-size:.84rem;color:${creamInk}8c;}
        .prog__split b{color:${creamInk};font-weight:600;}
        .prog__split a{color:${goldLine};}

        .tasks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
        .task{
          border-radius:18px;padding:18px;
          background:${surface}80;box-shadow:inset 0 0 0 1px ${goldLine}26;
          display:flex;flex-direction:column;gap:14px;
          transition:box-shadow .3s ease,background .3s ease;
        }
        .task--done{background:${surface}40;box-shadow:inset 0 0 0 1px ${goldLine}14;}
        .task__head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;}
        .task__text{display:flex;flex-direction:column;gap:4px;min-width:0;}
        .task__label{margin:0;font-family:${serif};font-weight:700;font-size:1.08rem;line-height:1.2;}
        .task__hint{margin:0;font-weight:300;font-size:.86rem;line-height:1.5;color:${creamInk}8c;}
        .task__pts{
          flex-shrink:0;padding:6px 12px;border-radius:999px;
          font-family:${serif};font-weight:800;font-size:.9rem;color:${goldLine};
          background:${goldLine}14;box-shadow:inset 0 0 0 1px ${goldLine}40;
        }
        .task--done .task__label{color:${creamInk}8c;}
        .task--done .task__pts{color:${plumDeep};background:${goldLine};box-shadow:none;}
        .task__body{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
        .task__proof{display:flex;gap:8px;flex:1 1 280px;min-width:0;}
        .task__proof .btn{flex-shrink:0;}
        @media (max-width:520px){
          .task__body > .btn{flex:1 1 auto;}
          .task__proof{flex-direction:column;}
        }
      `}</style>

      <main className="social">
        <header className="social__head">
          <p className="eyebrow">Social</p>
          <h1>Earn your spot.</h1>
          <p className="lede">
            {status
              ? `${status.threshold.toLocaleString()} points unlocks a wallet slot. Tasks on X and runs in the arcade both count.`
              : "Tasks on X and runs in the arcade both earn points toward a wallet slot."}
          </p>
        </header>

        {loading ? null : !session ? (
          <SignInCard title="Sign in to earn." body="Tasks are tied to your X account, so each one only counts once." />
        ) : (
          <>
            <section className="prog">
              <div className="prog__top">
                <p className="eyebrow">Your points</p>
                {status && <p className="eyebrow" style={{ color: `${creamInk}73` }}>@{status.handle}</p>}
              </div>
              <p className="prog__total" style={{ margin: "10px 0 0" }}>
                {status ? status.total.toLocaleString() : "—"}
                <small>/ {status ? status.threshold.toLocaleString() : "5,000"}</small>
              </p>
              <div className="prog__bar" aria-hidden>
                <span style={{ width: `${pct}%` }} />
              </div>
              <div className="prog__split">
                <span>
                  Social <b>{status ? status.social_points.toLocaleString() : "—"}</b>
                </span>
                <span>
                  Arcade <b>{status ? status.game_points.toLocaleString() : "—"}</b>
                </span>
                <Link href="/game">Play for more →</Link>
              </div>
              {statusError && <p className="err" style={{ marginTop: 12 }}>{statusError}</p>}
            </section>

            {tasksErr && <p className="err">{tasksErr}</p>}

            <ul className="tasks">
              {tasks.map((t) => (
                <TaskRow key={t.key} task={t} done={!!status?.completed.includes(t.key)} />
              ))}
            </ul>

            <WalletClaim />
          </>
        )}
      </main>
    </SiteShell>
  );
}
