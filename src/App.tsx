import { Link, Router as WouterRouter, Route, Switch } from "wouter";
import Home from "@/pages/home";
import Game from "@/pages/game";
import Social from "@/pages/social";
import { BuniiProvider } from "@/lib/bunii-account";
import { SiteShell } from "@/components/bunii/SiteShell";
import { serif } from "@/lib/bunii-theme";

function NotFound() {
  return (
    <SiteShell>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <p className="eyebrow">404</p>
        <h1 style={{ margin: 0, fontFamily: serif, fontWeight: 800, fontSize: "2.2rem" }}>Nothing hopping here.</h1>
        <Link href="/" className="btn" style={{ marginTop: 8 }}>
          Back home
        </Link>
      </main>
    </SiteShell>
  );
}

function App() {
  return (
    <div className="dark">
      <BuniiProvider>
        <WouterRouter>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/game" component={Game} />
            <Route path="/social" component={Social} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
      </BuniiProvider>
    </div>
  );
}

export default App;
