// App — wires together kiosk + screens + receipt + tweaks panel.

const { useState, useEffect, useRef, useMemo } = React;

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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
