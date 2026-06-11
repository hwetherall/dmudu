import { useState, useEffect } from "react";
import { C, MONO, SERIF } from "./theme.js";
import Overview from "./views/Overview.jsx";
import Schema from "./views/Schema.jsx";
import Calibration from "./views/Calibration.jsx";
import Worlds from "./views/Worlds.jsx";
import Regret from "./views/Regret.jsx";
import Pathway from "./views/Pathway.jsx";
import Findings from "./views/Findings.jsx";

const TABS = [
  { id: "overview", label: "Overview", View: Overview },
  { id: "schema", label: "1 · Extract", View: Schema },
  { id: "calibration", label: "2 · Calibrate", View: Calibration },
  { id: "worlds", label: "3–4 · Worlds", View: Worlds },
  { id: "regret", label: "5 · Regret", View: Regret },
  { id: "pathway", label: "6 · Pathway", View: Pathway },
  { id: "findings", label: "Findings", View: Findings },
];

function initialTab() {
  const h = window.location.hash.replace("#", "");
  return TABS.some(t => t.id === h) ? h : "overview";
}

export default function App() {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (window.location.hash.replace("#", "") !== tab) window.location.hash = tab;
    window.scrollTo(0, 0);
  }, [tab]);

  useEffect(() => {
    const onHash = () => setTab(initialTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const { View } = TABS.find(t => t.id === tab);

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper }}>
      {/* ── app chrome ── */}
      <div style={{ background: C.navy, borderBottom: `3px solid ${C.amber}` }} className="px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3" style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div>
            <div className="text-lg" style={{ fontFamily: SERIF, color: "#fff", fontWeight: 700 }}>
              Samsung LEO <span style={{ color: C.amber }}>·</span> Deep Uncertainty Workbench
            </div>
            <div className="text-xs" style={{ color: C.ice }}>
              Innovera · the worked example behind the Pedram pack · every number cited, derived, computed, or declared
            </div>
          </div>
          <nav className="flex flex-wrap gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-3 py-1.5 rounded text-xs"
                style={{
                  fontFamily: MONO, cursor: "pointer",
                  background: t.id === tab ? C.amber : "rgba(202,220,252,0.10)",
                  color: t.id === tab ? C.navy : C.ice,
                  fontWeight: t.id === tab ? 700 : 400,
                  border: `1px solid ${t.id === tab ? C.amber : "rgba(202,220,252,0.25)"}`,
                }}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="px-6 py-5" style={{ maxWidth: 1180, margin: "0 auto" }}>
        <View go={setTab} />
        <footer className="text-xs mt-6 pb-6 text-center" style={{ fontFamily: MONO, color: C.muted }}>
          The LLM framed the worlds and proposed the parameter shifts; the ~200-line cash engine computed every number on these pages — live, in your browser.
        </footer>
      </main>
    </div>
  );
}
