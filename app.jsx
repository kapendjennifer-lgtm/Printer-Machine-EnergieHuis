// App — wires together kiosk + screens + receipt + tweaks panel.

const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

// helpers
function formatDate(d) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} · ${h}:${m}`;
}

const TWEAK_DEFAULTS = {
  accent: "terra",
  cabinetColor: "ochre",
  showStickers: true,
  showGrain: true,
  language: "English",
};

const ACCENT_HEX = {
  terra:  "#C95F3C",
  olive:  "#6E7E3F",
  mustard:"#C9952A",
  brick:  "#A8493B",
};

// ─── ResponsiveStage ─────────────────────────────────────────────────────────
// Wraps a fixed-size canvas (760×1280) and scales it to fit the viewport.
// Always preserves aspect ratio so the printer + tear edge stay visible.

function ResponsiveStage({ children, wide }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  const STAGE_W = wide ? 1200 : 760;
  const STAGE_H = 1280;

  useLayoutEffect(() => {
    function fit() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const PAD = vw < 500 ? 8 : 24;
      const s = Math.min((vw - PAD * 2) / STAGE_W, (vh - PAD * 2) / STAGE_H);
      setScale(Math.min(1.4, Math.max(0.2, s)));
    }
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, [STAGE_W, STAGE_H]);

  return (
    <div className="kiosk-stage-outer">
      <div
        ref={ref}
        className="kiosk-stage"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Full-size receipt preview shown next to the kiosk in the printing + done phases.
// During printing, content is progressively revealed top-down to match the
// physical paper emerging from the slot.
function ReceiptPreview({ answers, dateStr, ticketNo, printing, printSession }) {
  const PRINT_DURATION = 4200;
  const [progress, setProgress] = React.useState(printing ? 0 : 1);
  const rafRef = React.useRef(null);
  const paperRef = React.useRef(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function downloadReceipt() {
    const node = paperRef.current;
    if (!node || saving || !window.htmlToImage) return;
    setSaving(true);
    try {
      // wait for fonts so the captured paper matches the screen
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const dataUrl = await window.htmlToImage.toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--paper").trim() || "#F8F2E2",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `EnergieHuis-receipt-${ticketNo}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
    } catch (err) {
      console.error("receipt download failed", err);
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    if (!printing) { setProgress(1); return; }
    setProgress(0);
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / PRINT_DURATION);
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [printing, printSession]);

  return (
    <div className="kiosk-preview">
      <div style={{
        position: "relative",
        transform: printing ? "rotate(-0.6deg)" : "rotate(-1deg)",
        transition: "transform 500ms ease",
      }}>
        {/* sticky label — only after print finishes */}
        {!printing && (
          <div style={{
            position: "absolute",
            top: -22, left: -18,
            background: "var(--accent-mustard)",
            color: "var(--ink)",
            padding: "8px 16px 7px",
            borderRadius: "16px 22px 16px 22px",
            fontFamily: "Caveat, cursive",
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1,
            transform: "rotate(-6deg)",
            boxShadow: "0 3px 0 rgba(60,30,10,0.20), 0 6px 14px rgba(60,30,10,0.16)",
            border: "1.4px solid rgba(60,30,10,0.18)",
            zIndex: 2,
            whiteSpace: "nowrap",
            animation: "preview-pop 480ms cubic-bezier(.2,1.2,.4,1) 240ms backwards",
          }}>
            ↑ your printed copy
          </div>
        )}

        {/* live-printing badge */}
        {printing && (
          <div style={{
            position: "absolute",
            top: -16, right: -10,
            background: "var(--accent-terra)",
            color: "white",
            padding: "6px 12px 5px",
            borderRadius: 999,
            fontFamily: "Special Elite, monospace",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            boxShadow: "0 3px 0 var(--accent-brick)",
            zIndex: 3,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "white",
              animation: "preview-blink 0.9s ease-in-out infinite",
            }} />
            printing live
          </div>
        )}

        {/* Decorative tape */}
        {!printing && (
          <div style={{
            position: "absolute",
            top: -10, right: 30,
            width: 64, height: 22,
            background: "rgba(255, 245, 200, 0.55)",
            border: "1px solid rgba(60,30,10,0.10)",
            transform: "rotate(8deg)",
            boxShadow: "0 2px 6px rgba(60,30,10,0.10)",
            zIndex: 1,
            animation: "preview-pop 480ms cubic-bezier(.2,1.2,.4,1) 360ms backwards",
          }} />
        )}

        {/* progressive reveal during printing */}
        <div ref={paperRef} style={{
          filter: printing ? "none" : "drop-shadow(0 18px 30px rgba(60,30,10,0.30))",
          clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)`,
          transition: printing ? "none" : "clip-path 200ms ease-out",
        }}>
          <Receipt answers={answers} dateStr={dateStr} ticketNo={ticketNo} />
        </div>

        {/* scrolling print head line at the bottom of currently-printed region */}
        {printing && progress < 1 && (
          <div style={{
            position: "absolute",
            left: 0, right: 0,
            top: `calc(${progress * 100}% - 2px)`,
            height: 4,
            background: "linear-gradient(90deg, transparent, var(--accent-terra), transparent)",
            opacity: 0.85,
            transition: "top 200ms linear",
          }} />
        )}
      </div>

      <div style={{
        fontFamily: "Caveat, cursive",
        fontSize: 20,
        color: "rgba(60,30,10,0.6)",
        textAlign: "center",
        transform: "rotate(-1deg)",
        maxWidth: 280,
        minHeight: 28,
      }}>
        {printing
          ? <>watch your tips appear ↑</>
          : <>full version — same as the paper in your hand</>}
      </div>

      {/* download the printed copy as an image */}
      {!printing && (
        <button
          type="button"
          onClick={downloadReceipt}
          disabled={saving}
          style={{
            background: saved ? "var(--accent-olive)" : "white",
            color: saved ? "white" : "var(--ink)",
            border: "1.8px solid rgba(60,30,10,0.2)",
            borderRadius: "16px 20px 16px 22px",
            padding: "12px 22px 11px",
            fontFamily: "Archivo Narrow, sans-serif",
            fontWeight: 700, fontSize: 17, letterSpacing: "0.03em",
            cursor: saving ? "wait" : "pointer",
            boxShadow: saved
              ? "0 4px 0 rgba(60,30,10,0.18)"
              : "0 4px 0 rgba(60,30,10,0.16)",
            transform: "rotate(-0.6deg)",
            display: "flex", alignItems: "center", gap: 10,
            transition: "background 200ms ease, color 200ms ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {saved
              ? <path d="M3 9 L7 13 L15 4" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              : <>
                  <path d="M9 2 V11 M5 7.5 L9 11.5 L13 7.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 14.5 H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>}
          </svg>
          {saving ? "Saving…" : saved ? "Saved to your device" : "Download a copy"}
        </button>
      )}

      <style>{`
        @keyframes preview-blink { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes preview-pop {
          from { opacity: 0; transform: rotate(-12deg) scale(0.6); }
          to   { opacity: 1; transform: rotate(-6deg) scale(1); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const EMPTY_ANSWERS_LOCAL = { tenure: null, bills: null, household: null, homeType: null, winter: null };

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // phase: welcome | question | printing | done
  const [phase, setPhase] = useState("welcome");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS_LOCAL);
  const [ticketSeed] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [printedAt, setPrintedAt] = useState(null);
  const [printSession, setPrintSession] = useState(0); // increments each fresh receipt
  const [shareMode, setShareMode] = useState(null); // null | "email" | "sms" | "qr"

  const activeQuestions = useMemo(() => getActiveQuestions(answers), [answers]);

  // if the user's previous answer made the current step invalid (e.g. switched
  // tenure from rent → own, dropping the "bills" question), snap stepIdx back
  // into bounds.
  useEffect(() => {
    if (phase === "question" && stepIdx >= activeQuestions.length) {
      setStepIdx(Math.max(0, activeQuestions.length - 1));
    }
  }, [activeQuestions.length, phase, stepIdx]);

  // apply accent var globally for screens
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-terra", ACCENT_HEX[tweaks.accent] || ACCENT_HEX.terra);
  }, [tweaks.accent]);

  // auto-reset after done — paused while share sheet is open
  useEffect(() => {
    if (phase !== "done" || shareMode) return;
    const t = setTimeout(() => { handleReset(); }, 28000);
    return () => clearTimeout(t);
  }, [phase, printSession, shareMode]);

  function setAnswer(key, val) {
    setAnswers((a) => {
      const next = { ...a, [key]: val };
      // clear bills if tenure changes away from rent
      if (key === "tenure" && val !== "rent") next.bills = null;
      return next;
    });
  }

  function handleStart() {
    setStepIdx(0);
    setPhase("question");
  }

  function handleBack() {
    if (phase !== "question") return;
    if (stepIdx === 0) return setPhase("welcome");
    setStepIdx((i) => i - 1);
  }
  function handleNext() {
    if (phase !== "question") return;
    if (stepIdx < activeQuestions.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setPrintedAt(new Date());
      setPrintSession((s) => s + 1);
      setPhase("printing");
    }
  }

  function handleReset() {
    setAnswers(EMPTY_ANSWERS_LOCAL);
    setStepIdx(0);
    setPhase("welcome");
  }
  function handlePrintAgain() {
    setPrintSession((s) => s + 1);
    setPrintedAt(new Date());
    setPhase("printing");
  }

  // ticket number = seed + session counter
  const ticketNo = String(ticketSeed + printSession).padStart(4, "0");

  let screen;
  if (phase === "welcome") {
    screen = <WelcomeScreen onStart={handleStart} language={tweaks.language} />;
  } else if (phase === "question") {
    screen = (
      <QuestionScreen
        stepIdx={stepIdx}
        activeQuestions={activeQuestions}
        answers={answers}
        setAnswer={setAnswer}
        onBack={handleBack}
        onNext={handleNext}
        language={tweaks.language}
        accent={`var(--accent-terra)`}
      />
    );
  } else if (phase === "printing") {
    screen = <PrintingScreen />;
  } else if (phase === "done") {
    screen = (
      <>
        <DoneScreen
          onReset={handleReset}
          onPrintAgain={handlePrintAgain}
          onShare={(mode) => setShareMode(mode)}
        />
        {shareMode && (
          <ShareSheet
            mode={shareMode}
            answers={answers}
            ticketNo={ticketNo}
            onClose={() => setShareMode(null)}
          />
        )}
      </>
    );
  }

  // map phase to receipt phase
  const feedPhase = phase === "printing" ? "printing"
    : phase === "done" ? "done"
    : "idle";

  const stageContent = (
    <ResponsiveStage wide={phase === "done" || phase === "printing"}>
      <div className="kiosk-column">
        <KioskCabinet
          cabinetColor={tweaks.cabinetColor}
          printing={phase === "printing"}
          ready={phase === "done"}
          paperFeed={
            (phase === "printing" || phase === "done") && printedAt ? (
              <ReceiptFeeder
                key={printSession}
                answers={answers}
                phase={feedPhase}
                dateStr={formatDate(printedAt)}
                ticketNo={ticketNo}
                onPrinted={() => setPhase("done")}
              />
            ) : null
          }
        >
          {screen}
        </KioskCabinet>

        {/* environment caption beneath the kiosk — hidden while paper is hanging out */}
        {phase !== "printing" && phase !== "done" && (
          <div style={{
            fontFamily: "Caveat, cursive",
            fontSize: 22,
            color: "rgba(60,30,10,0.55)",
            textAlign: "center",
            marginTop: 6,
            maxWidth: 600,
            transform: "rotate(-0.6deg)",
          }}>
            Energy advice kiosk · prototype · tap the screen, the receipt prints below
          </div>
        )}
      </div>

      {(phase === "done" || phase === "printing") && printedAt && (
        <ReceiptPreview
          answers={answers}
          dateStr={formatDate(printedAt)}
          ticketNo={ticketNo}
          printing={phase === "printing"}
          printSession={printSession}
        />
      )}
    </ResponsiveStage>
  );

  return (
    <>
      {stageContent}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Look">
          <TweakColor
            label="Accent"
            value={ACCENT_HEX[tweaks.accent]}
            options={Object.keys(ACCENT_HEX).map(k => ACCENT_HEX[k])}
            onChange={(hex) => {
              const key = Object.keys(ACCENT_HEX).find(k => ACCENT_HEX[k] === hex) || "terra";
              setTweak("accent", key);
            }}
          />
          <TweakSelect
            label="Cabinet"
            value={tweaks.cabinetColor}
            options={["ochre","sage","rust","walnut"]}
            onChange={(v) => setTweak("cabinetColor", v)}
          />
        </TweakSection>
        <TweakSection label="Demo">
          <TweakSelect
            label="Language pill"
            value={tweaks.language}
            options={["English", "Nederlands", "العربية", "Türkçe", "Français"]}
            onChange={(v) => setTweak("language", v)}
          />
          <TweakButton
            label="▸ Skip to printing demo"
            onClick={() => {
              setAnswers({ tenure: "rent", bills: "separate", household: "partner", homeType: "apartment", winter: "cold" });
              setPrintedAt(new Date());
              setPrintSession((s) => s + 1);
              setPhase("printing");
            }}
          />
          <TweakButton label="↻ Reset to welcome" onClick={handleReset} secondary />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
