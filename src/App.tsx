import "@rainbow-me/rainbowkit/styles.css";
import { Router as WouterRouter, Route, Switch } from "wouter";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { color, displayType, radius } from "@/lib/theme";
import Layout from "@/components/layout";

import Home from "@/pages/home";
import Mint from "@/pages/mint";
import Admin from "@/pages/admin";
import Checker from "@/pages/checker";
import NavLink from "@/components/nav-link";

const queryClient = new QueryClient();

const rainbowTheme = lightTheme({
  accentColor: "#251634",
  accentColorForeground: "#FFF6E2",
  borderRadius: "large",
  fontStack: "system",
});

function NotFound() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "110px 20px", textAlign: "center" }}>
      <h1 style={{ ...displayType, fontWeight: 700, fontSize: "clamp(2.6rem, 9vw, 4.2rem)", letterSpacing: "-0.04em", lineHeight: 0.95, margin: "0 0 18px" }}>
        Nothing in this burrow.
      </h1>
      <p style={{ color: color.inkSoft, fontSize: "1.05rem", margin: "0 0 32px" }}>
        That page doesn't exist. Head back to the homepage or the mint.
      </p>
      <NavLink
        href="/"
        className="press"
        style={{ display: "inline-block", fontWeight: 600, padding: "15px 28px", borderRadius: radius.pill, background: color.ink, color: color.moon }}
      >
        Back home
      </NavLink>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <TooltipProvider>
            <WouterRouter>
              <Layout>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/mint" component={Mint} />
                  <Route path="/checker" component={Checker} />
                  <Route path="/admin" component={Admin} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
