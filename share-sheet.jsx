// Share Sheet — overlay shown when user taps Email / Text / QR on the Done screen.

const shareStyles = {
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(43,34,24,0.50)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24, zIndex: 50,
    animation: "share-fadein 220ms ease",
  },
  sheet: {
    width: "100%", maxWidth: 540,
    background: "var(--screen-bg)",
    border: "1.8px solid rgba(60,30,10,0.2)",
    borderRadius: "24px 28px 24px 28px",
    padding: "22px 22px 18px",
    boxShadow: "0 24px 60px rgba(60,30,10,0.35), 0 6px 0 rgba(60,30,10,0.18)",
    transform: "rotate(-0.4deg)",
    position: "relative",
    fontFamily: "Archivo Narrow, sans-serif",
  },
  closeX: {
    position: "absolute", top: 12, right: 14,
    width: 36, height: 36, borderRadius: "50%",
    border: "1.5px solid rgba(60,30,10,0.2)", background: "white",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--ink-soft)",
  },
  title: {
    fontFamily: "Bricolage Grotesque, serif",
    fontWeight: 800, fontSize: 34, lineHeight: 1,
    letterSpacing: "-0.025em",
    color: "var(--ink)", margin: "2px 0 4px",
  },
  subtitle: {
    fontFamily: "Caveat, cursive",
    fontSize: 20, color: "var(--accent-terra)",
    margin: "0 0 14px",
  },
  field: {
    width: "100%",
    background: "white",
    border: "1.6px solid rgba(60,30,10,0.22)",
    borderRadius: 12,
    padding: "14px 16px",
    fontFamily: "Special Elite, monospace",
    fontSize: 22, letterSpacing: "0.02em",
    color: "var(--ink)",
    minHeight: 28,
    display: "flex", alignItems: "center",
  },
  caret: {
    display: "inline-block", width: 2, height: 22,
    background: "var(--accent-terra)", marginLeft: 1,
    animation: "share-caret 1.05s steps(2) infinite",
  },
  legalRow: {
    display: "flex", gap: 10, alignItems: "center",
    margin: "12px 0 4px",
    fontFamily: "Archivo Narrow, sans-serif",
    fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.3,
  },
  legalBox: (checked) => ({
    width: 22, height: 22, borderRadius: 5,
    border: "1.8px solid " + (checked ? "var(--accent-terra)" : "rgba(60,30,10,0.3)"),
    background: checked ? "var(--accent-terra)" : "white",
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  }),
  // keyboard
  kb: {
    marginTop: 14,
    background: "rgba(60,30,10,0.08)",
    border: "1.4px solid rgba(60,30,10,0.16)",
    borderRadius: 14,
    padding: 8,
    display: "flex", flexDirection: "column", gap: 6,
  },
  kbRow: { display: "flex", gap: 6, justifyContent: "center" },
  key: (wide) => ({
    flex: wide ? `${wide} 1 0` : "1 1 0",
    minWidth: 0,
    height: 42,
    background: "white",
    border: "1.4px solid rgba(60,30,10,0.18)",
    borderRadius: 8,
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 600, fontSize: 16,
    color: "var(--ink)",
    cursor: "pointer",
    boxShadow: "0 2px 0 rgba(60,30,10,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    userSelect: "none",
    padding: 0,
  }),
  // actions
  actions: {
    display: "flex", gap: 10, justifyContent: "flex-end",
    marginTop: 12,
  },
  primary: (enabled) => ({
    background: enabled ? "var(--accent-terra)" : "rgba(60,30,10,0.18)",
    color: enabled ? "white" : "var(--ink-faint)",
    border: "none",
    borderRadius: "14px 18px 14px 18px",
    padding: "14px 24px 12px",
    fontFamily: "Archivo Narrow, sans-serif", fontWeight: 700, fontSize: 17,
    letterSpacing: "0.04em",
    cursor: enabled ? "pointer" : "not-allowed",
    boxShadow: enabled ? "0 4px 0 var(--accent-brick)" : "none",
  }),
  secondary: {
    background: "transparent",
    border: "2px solid rgba(60,30,10,0.22)",
    borderRadius: "14px 18px 14px 18px",
    padding: "12px 18px 10px",
    fontFamily: "Archivo Narrow, sans-serif", fontWeight: 700, fontSize: 15,
    color: "var(--ink-soft)", letterSpacing: "0.04em",
    cursor: "pointer",
  },
  // QR view
  qrCard: {
    background: "white",
    border: "2px dashed rgba(60,30,10,0.3)",
    borderRadius: 12,
    padding: 18,
    margin: "8px auto 6px",
    width: 256, height: 256,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  // success state
  successWrap: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    padding: "18px 8px 10px", textAlign: "center",
  },
  checkBubble: {
    width: 84, height: 84, borderRadius: "50%",
    background: "var(--accent-olive)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 5px 0 rgba(60,30,10,0.18), 0 12px 24px rgba(60,30,10,0.18)",
    animation: "share-pop 360ms cubic-bezier(.2,1.2,.4,1) backwards",
  },
};

// ─── QR-LIKE GLYPH ───────────────────────────────────────────────────────────
// Deterministic pseudo-QR. Not a real QR — it's the right visual vocabulary
// (finder patterns + alignment + random-looking data cells). For an interactive
// prototype that's exactly the right fidelity.

function FakeQR({ payload, size = 220 }) {
  // 25x25 grid
  const N = 25;
  // simple deterministic PRNG from string
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  const cells = React.useMemo(() => {
    let seed = hash(payload || "x");
    const arr = Array(N * N).fill(0);
    const rand = () => {
      seed = Math.imul(seed ^ (seed >>> 15), 2246822519);
      seed = Math.imul(seed ^ (seed >>> 13), 3266489917);
      seed ^= seed >>> 16;
      return (seed >>> 0) / 4294967295;
    };
    for (let i = 0; i < arr.length; i++) arr[i] = rand() > 0.52 ? 1 : 0;
    // carve out finder patterns (top-left, top-right, bottom-left)
    const stamp = (x, y) => {
      for (let dx = 0; dx < 7; dx++) for (let dy = 0; dy < 7; dy++) {
        const onBorder = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const inner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        arr[(y + dy) * N + (x + dx)] = (onBorder || inner) ? 1 : 0;
      }
      // quiet zone around
      for (let dx = -1; dx <= 7; dx++) for (let dy = -1; dy <= 7; dy++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue;
        if (dx === -1 || dx === 7 || dy === -1 || dy === 7) arr[yy * N + xx] = 0;
      }
    };
    stamp(0, 0);
    stamp(N - 7, 0);
    stamp(0, N - 7);
    // alignment block bottom-right
    for (let dx = 0; dx < 5; dx++) for (let dy = 0; dy < 5; dy++) {
      const onBorder = dx === 0 || dx === 4 || dy === 0 || dy === 4;
      const center = dx === 2 && dy === 2;
      arr[(N - 6 + dy) * N + (N - 6 + dx)] = (onBorder || center) ? 1 : 0;
    }
    // timing patterns
    for (let i = 8; i < N - 8; i++) {
      arr[6 * N + i] = i % 2 === 0 ? 1 : 0;
      arr[i * N + 6] = i % 2 === 0 ? 1 : 0;
    }
    return arr;
  }, [payload]);

  const cell = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} style={{ shapeRendering: "crispEdges" }}>
      <rect x="0" y="0" width={N} height={N} fill="white" />
      {cells.map((v, i) => v ? (
        <rect key={i} x={i % N} y={Math.floor(i / N)} width="1.05" height="1.05" fill="var(--ink)" />
      ) : null)}
    </svg>
  );
}

// ─── ON-SCREEN KEYBOARDS ─────────────────────────────────────────────────────

const QWERTY = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m","-","_","."],
];

function Keyboard({ onKey, onBack, onAt, mode = "email" }) {
  return (
    <div style={shareStyles.kb}>
      {QWERTY.map((row, ri) => (
        <div key={ri} style={shareStyles.kbRow}>
          {row.map((k) => (
            <button key={k} style={shareStyles.key()} onClick={() => onKey(k)} type="button">{k}</button>
          ))}
        </div>
      ))}
      <div style={shareStyles.kbRow}>
        <button style={shareStyles.key(1.4)} onClick={() => onKey("0")} type="button">0</button>
        <button style={shareStyles.key(1.4)} onClick={() => onKey("1")} type="button">1</button>
        <button style={shareStyles.key(1.4)} onClick={() => onKey("2")} type="button">2</button>
        <button style={shareStyles.key(1.6)} onClick={onAt} type="button">@</button>
        <button style={shareStyles.key(2)} onClick={() => onKey(" ")} type="button">space</button>
        <button style={shareStyles.key(1.8)} onClick={onBack} type="button">⌫</button>
      </div>
    </div>
  );
}

function NumPad({ onKey, onBack }) {
  const layout = [["1","2","3"],["4","5","6"],["7","8","9"],["+","0","⌫"]];
  return (
    <div style={{ ...shareStyles.kb, padding: 10 }}>
      {layout.map((row, ri) => (
        <div key={ri} style={{ ...shareStyles.kbRow, gap: 8 }}>
          {row.map((k) => (
            <button
              key={k}
              style={{ ...shareStyles.key(), height: 54, fontSize: 22 }}
              onClick={() => k === "⌫" ? onBack() : onKey(k)}
              type="button"
            >{k}</button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── SHEET ───────────────────────────────────────────────────────────────────

function ShareSheet({ mode, onClose, answers, ticketNo }) {
  const [emailVal, setEmailVal] = React.useState("");
  const [phoneVal, setPhoneVal] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  // auto-dismiss success after a few seconds
  React.useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => onClose(), 3400);
    return () => clearTimeout(t);
  }, [sent, onClose]);

  // basic email regex (kiosk-grade)
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailVal);
  const validPhone = phoneVal.replace(/\D/g, "").length >= 8;

  const payloadUrl = `https://energiehuis.delft/r/${ticketNo}`;

  return (
    <div style={shareStyles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <style>{`
        @keyframes share-fadein { from { opacity: 0 } to { opacity: 1 } }
        @keyframes share-caret  { 50% { opacity: 0 } }
        @keyframes share-pop    { from { transform: scale(0.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes share-rotate { from { transform: rotate(-2deg) } to { transform: rotate(0.4deg) } }
      `}</style>

      <div style={shareStyles.sheet} onClick={(e) => e.stopPropagation()}>
        <button style={shareStyles.closeX} onClick={onClose} aria-label="Close" type="button">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        {sent ? (
          <div style={shareStyles.successWrap}>
            <div style={shareStyles.checkBubble}>
              <svg width="44" height="36" viewBox="0 0 44 36">
                <path d="M5 18 L17 30 L40 6" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{
              fontFamily: "Bricolage Grotesque, serif", fontWeight: 800, fontSize: 32,
              letterSpacing: "-0.02em", color: "var(--ink)",
            }}>
              {mode === "email" ? "Sent!" : "On its way!"}
            </div>
            <p style={{
              margin: 0, fontFamily: "Archivo Narrow, sans-serif", fontSize: 17,
              color: "var(--ink-soft)", lineHeight: 1.35, maxWidth: 360,
            }}>
              {mode === "email"
                ? <>Check <b>{emailVal}</b> in a minute. We've sent your three tips and your saving potential.</>
                : <>We've texted your three tips to <b>+{phoneVal}</b>. It usually lands in under a minute.</>}
            </p>
            <p className="hand" style={{ fontSize: 20, color: "var(--accent-terra)", margin: "4px 0 0" }}>
              don't forget the paper one below ↓
            </p>
          </div>
        ) : mode === "email" ? (
          <>
            <div style={shareStyles.subtitle}>email a copy →</div>
            <h3 style={shareStyles.title}>Where shall we send it?</h3>
            <div style={shareStyles.field}>
              {emailVal || <span style={{ color: "rgba(60,30,10,0.3)" }}>name@example.com</span>}
              <span style={shareStyles.caret} />
            </div>
            <div style={shareStyles.legalRow}>
              <span style={shareStyles.legalBox(consent)} onClick={() => setConsent(!consent)} role="checkbox" aria-checked={consent}>
                {consent && <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span>Send me this once. No newsletter, no follow-up, no list.</span>
            </div>
            <Keyboard
              mode="email"
              onKey={(k) => setEmailVal((v) => (v + k).slice(0, 48))}
              onBack={() => setEmailVal((v) => v.slice(0, -1))}
              onAt={() => setEmailVal((v) => v.includes("@") ? v : v + "@")}
            />
            <div style={shareStyles.actions}>
              <button style={shareStyles.secondary} onClick={onClose} type="button">Cancel</button>
              <button
                style={shareStyles.primary(validEmail && consent)}
                onClick={() => (validEmail && consent) && setSent(true)}
                disabled={!validEmail || !consent}
                type="button"
              >
                Send to my inbox ↗
              </button>
            </div>
          </>
        ) : mode === "sms" ? (
          <>
            <div style={shareStyles.subtitle}>text a copy →</div>
            <h3 style={shareStyles.title}>What's your number?</h3>
            <div style={shareStyles.field}>
              <span style={{ color: "var(--ink-soft)", marginRight: 6 }}>+</span>
              {phoneVal || <span style={{ color: "rgba(60,30,10,0.3)" }}>31 6 1234 5678</span>}
              <span style={shareStyles.caret} />
            </div>
            <div style={shareStyles.legalRow}>
              <span style={shareStyles.legalBox(consent)} onClick={() => setConsent(!consent)} role="checkbox" aria-checked={consent}>
                {consent && <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span>One text, then your number is forgotten.</span>
            </div>
            <NumPad
              onKey={(k) => setPhoneVal((v) => {
                if (v.length >= 15) return v;
                if (v.length > 0 && (v.length === 2 || v.length === 4 || v.length === 8)) return v + " " + k;
                return v + k;
              })}
              onBack={() => setPhoneVal((v) => v.replace(/\s$/, "").slice(0, -1))}
            />
            <div style={shareStyles.actions}>
              <button style={shareStyles.secondary} onClick={onClose} type="button">Cancel</button>
              <button
                style={shareStyles.primary(validPhone && consent)}
                onClick={() => (validPhone && consent) && setSent(true)}
                disabled={!validPhone || !consent}
                type="button"
              >
                Send by SMS ↗
              </button>
            </div>
          </>
        ) : (
          // QR
          <>
            <div style={shareStyles.subtitle}>your tips on your phone →</div>
            <h3 style={shareStyles.title}>Point your camera here</h3>
            <p style={{ fontFamily: "Archivo Narrow", fontSize: 15, color: "var(--ink-soft)", margin: "0 0 8px", maxWidth: 380 }}>
              Open the camera app and aim it at the square. The link opens your three tips — no app, no login, nothing to install.
            </p>
            <div style={shareStyles.qrCard}>
              <FakeQR payload={payloadUrl} size={220} />
            </div>
            <div style={{
              textAlign: "center",
              fontFamily: "Special Elite, monospace",
              fontSize: 13,
              color: "var(--ink-soft)",
              letterSpacing: "0.05em",
              wordBreak: "break-all",
            }}>
              {payloadUrl}
            </div>
            <div style={{
              ...shareStyles.legalRow,
              justifyContent: "center", marginTop: 14,
            }}>
              <span style={{ fontFamily: "Caveat", fontSize: 18, color: "var(--ink-faint)" }}>
                ☆ link expires in 24 hours · no account needed ☆
              </span>
            </div>
            <div style={shareStyles.actions}>
              <button style={shareStyles.secondary} onClick={onClose} type="button">Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ShareSheet });
