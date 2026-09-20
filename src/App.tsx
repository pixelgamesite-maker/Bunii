import { Router as WouterRouter, Route, Switch } from "wouter";
import Home from "@/pages/home";
import Game from "@/pages/game";

function App() {
  return (
    <div className="dark">
      <WouterRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route>
            <div
              style={{
                background: "#050504",
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 700,
                fontSize: "2rem",
                color: "#6fa8c4",
              }}
            >
              404 — NOT FOUND
            </div>
          </Route>
        </Switch>
      </WouterRouter>
    </div>
  );
}

export default App;
