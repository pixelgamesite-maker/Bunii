import { creamInk, serif } from "@/lib/bunii-theme";
import { useAuth } from "@/lib/auth";
import { SiteShell } from "@/components/bunii/SiteShell";
import { SignInCard } from "@/components/bunii/SignInCard";
import { BuniiReaction } from "@/components/bunii/BuniiReaction";

export default function Game() {
  const { session, loading } = useAuth();

  return (
    <SiteShell>
      <style>{`
        .stagewrap{
          flex:1;display:flex;flex-direction:column;align-items:center;
          gap:16px;padding:clamp(24px,5vh,48px) clamp(16px,4vw,32px) clamp(36px,7vh,68px);
        }
        .stagewrap h1{
          margin:0;text-align:center;font-family:${serif};font-weight:800;
          font-size:clamp(1.8rem,5.4vw,2.6rem);line-height:1.05;letter-spacing:-.02em;
        }
        .stagewrap .lede{
          margin:0 0 6px;text-align:center;font-weight:300;font-size:.95rem;
          color:${creamInk}a6;max-width:40ch;line-height:1.55;
        }
      `}</style>

      <main className="stagewrap">
        <h1>How fast are you?</h1>
        <p className="lede">Five Buniis on the rack. Any of them can let go. Catch them, bank the points.</p>

        {loading ? null : session ? (
          <BuniiReaction />
        ) : (
          <SignInCard title="Sign in to play." body="Points from every run are saved to your X account." />
        )}
      </main>
    </SiteShell>
  );
}
