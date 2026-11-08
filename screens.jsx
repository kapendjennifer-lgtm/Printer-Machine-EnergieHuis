// Screens — the touchscreen UI states inside the kiosk tablet.

// ─── SHARED SVG DECOR ────────────────────────────────────────────────────────

function HandUnderline({ color = "var(--accent-terra)", width = 220, style }) {
  // wobbly hand-drawn underline
  return (
    <svg width={width} height="14" viewBox="0 0 220 14" fill="none" style={style}>
      <path
        d="M3 8 C 30 2, 60 12, 92 6 S 158 12, 188 5 S 215 9, 218 7"
        stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

function Squiggle({ color = "var(--ink-faint)", width = 60, style }) {
  return (
    <svg width={width} height="10" viewBox="0 0 60 10" fill="none" style={style}>
      <path d="M2 6 Q 8 1 14 6 T 26 6 T 38 6 T 50 6 T 58 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PaperStar({ size = 28, color = "var(--accent-mustard)", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={style}>
      <path
        d="M16 2 L19 12 L29 13 L21 19 L24 29 L16 23 L8 29 L11 19 L3 13 L13 12 Z"
        fill={color} stroke="rgba(60,30,10,0.25)" strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sticker({ children, color, rotate = -3, style }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "5px 12px",
      background: color,
      color: "var(--ink)",
      fontFamily: "Caveat, cursive",
      fontWeight: 700,
      fontSize: 20,
      lineHeight: 1,
      borderRadius: "12px 18px 14px 20px",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 2px 0 rgba(60,30,10,0.18)",
      border: "1.2px solid rgba(60,30,10,0.18)",
      ...style,
    }}>{children}</span>
  );
}

// little house icon, drawn simply
function HouseGlyph({ kind = "house", size = 56 }) {
  const stroke = "var(--ink)";
  if (kind === "apartment") {
    return (
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
        <path d="M10 50 V18 L28 8 L46 18 V50 Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" fill="rgba(214,167,50,0.18)" />
        <rect x="18" y="22" width="6" height="7" stroke={stroke} strokeWidth="1.8" fill="white" />
        <rect x="32" y="22" width="6" height="7" stroke={stroke} strokeWidth="1.8" fill="white" />
        <rect x="18" y="33" width="6" height="7" stroke={stroke} strokeWidth="1.8" fill="white" />
        <rect x="32" y="33" width="6" height="7" stroke={stroke} strokeWidth="1.8" fill="white" />
        <rect x="24" y="42" width="8" height="8" stroke={stroke} strokeWidth="1.8" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M6 28 L28 8 L50 28 V50 H6 Z" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" fill="rgba(110,126,63,0.20)" />
      <rect x="22" y="32" width="12" height="18" stroke={stroke} strokeWidth="1.8" fill="white" />
      <circle cx="31" cy="42" r="1" fill={stroke} />
      <rect x="11" y="32" width="8" height="8" stroke={stroke} strokeWidth="1.8" fill="white" />
      <rect x="37" y="32" width="8" height="8" stroke={stroke} strokeWidth="1.8" fill="white" />
    </svg>
  );
}

// people glyphs
function PeopleGlyph({ kind, size = 56 }) {
  const stroke = "var(--ink)";
  const fill = "rgba(201,95,60,0.18)";
  const head = (cx, cy, r) => (
    <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth="2.2" fill={fill} />
  );
  const body = (cx, cy) => (
    <path d={`M ${cx-9} ${cy+14} Q ${cx} ${cy+5} ${cx+9} ${cy+14} L ${cx+9} ${cy+22} L ${cx-9} ${cy+22} Z`} stroke={stroke} strokeWidth="2.2" fill={fill} strokeLinejoin="round" />
  );
  if (kind === "solo") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      {head(28, 20, 7)} {body(28, 28)}
    </svg>
  );
  if (kind === "partner") return (
    <svg width={size} height={size} viewBox="0 0 64 56">
      {head(20, 20, 6.5)} {body(20, 28)}
      {head(44, 20, 6.5)} {body(44, 28)}
    </svg>
  );
  if (kind === "family") return (
    <svg width={size} height={size} viewBox="0 0 72 56">
      {head(18, 20, 6.5)} {body(18, 28)}
      {head(40, 20, 6.5)} {body(40, 28)}
      {head(58, 28, 5)} <path d={`M 51 46 Q 58 38 65 46 L 65 50 L 51 50 Z`} stroke={stroke} strokeWidth="2.2" fill={fill} strokeLinejoin="round" />
    </svg>
  );
  if (kind === "house") return (
    <svg width={size} height={size} viewBox="0 0 72 56">
      {head(14, 22, 5.5)} {body(14, 30)}
      {head(34, 18, 6)} {body(34, 26)}
      {head(54, 22, 5.5)} {body(54, 30)}
    </svg>
  );
  return null;
}

// thermometer / sun glyphs
function FeelGlyph({ kind, size = 56 }) {
  const stroke = "var(--ink)";
  if (kind === "cold") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="14" stroke={stroke} strokeWidth="2.2" fill="rgba(74,135,154,0.18)" />
      <path d="M28 14 V42 M14 28 H42 M18 18 L38 38 M38 18 L18 38" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
  if (kind === "mild") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <path d="M14 30 Q 22 22 28 30 T 42 30" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M14 38 Q 22 30 28 38 T 42 38" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3" fill={stroke} />
    </svg>
  );
  if (kind === "warm") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="9" stroke={stroke} strokeWidth="2.2" fill="rgba(214,167,50,0.30)" />
      {[0,45,90,135,180,225,270,315].map((a, i) => (
        <line key={i}
          x1={28 + 14*Math.cos(a*Math.PI/180)}
          y1={28 + 14*Math.sin(a*Math.PI/180)}
          x2={28 + 21*Math.cos(a*Math.PI/180)}
          y2={28 + 21*Math.sin(a*Math.PI/180)}
          stroke={stroke} strokeWidth="2.2" strokeLinecap="round"
        />
      ))}
    </svg>
  );
  return null;
}

// key / door icons for own/rent
function TenureGlyph({ kind, size = 56 }) {
  const stroke = "var(--ink)";
  if (kind === "own") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="20" cy="22" r="9" stroke={stroke} strokeWidth="2.4" fill="rgba(214,167,50,0.30)" />
      <circle cx="20" cy="22" r="2.5" fill={stroke} />
      <path d="M28 22 L46 22 M40 22 V30 M44 22 V28" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
  if (kind === "rent") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <path d="M16 50 V18 L28 10 L40 18 V50 Z" stroke={stroke} strokeWidth="2.2" fill="rgba(110,126,63,0.18)" strokeLinejoin="round" />
      <rect x="24" y="30" width="10" height="20" stroke={stroke} strokeWidth="2" fill="white" />
      <circle cx="32" cy="40" r="1" fill={stroke} />
    </svg>
  );
  return null;
}

// envelope / bills icons
function BillsGlyph({ kind, size = 56 }) {
  const stroke = "var(--ink)";
  const fill = "rgba(201,95,60,0.18)";
  if (kind === "included") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <rect x="8" y="14" width="40" height="28" rx="3" stroke={stroke} strokeWidth="2.2" fill={fill} />
      <path d="M8 14 L28 30 L48 14" stroke={stroke} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M20 38 L26 44 L38 30" stroke="var(--accent-olive)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (kind === "partial") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <rect x="6" y="12" width="28" height="22" rx="2.5" stroke={stroke} strokeWidth="2" fill={fill} />
      <path d="M6 12 L20 24 L34 12" stroke={stroke} strokeWidth="2" fill="none" />
      <rect x="22" y="24" width="28" height="22" rx="2.5" stroke={stroke} strokeWidth="2" fill="rgba(214,167,50,0.22)" />
      <path d="M22 24 L36 36 L50 24" stroke={stroke} strokeWidth="2" fill="none" />
    </svg>
  );
  if (kind === "separate") return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <rect x="10" y="10" width="30" height="20" rx="2" stroke={stroke} strokeWidth="2" fill={fill} />
      <path d="M10 10 L25 22 L40 10" stroke={stroke} strokeWidth="2" fill="none" />
      <rect x="18" y="26" width="30" height="20" rx="2" stroke={stroke} strokeWidth="2" fill="rgba(110,126,63,0.18)" />
      <path d="M18 26 L33 38 L48 26" stroke={stroke} strokeWidth="2" fill="none" />
    </svg>
  );
  return null;
}

// ─── PAGE CHROME ─────────────────────────────────────────────────────────────

const screenStyles = {
  page: {
    position: "absolute", inset: 0,
    padding: "32px 36px 28px",
    display: "flex", flexDirection: "column",
    background: "var(--screen-bg)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logo: {
    fontFamily: "Bricolage Grotesque, serif",
    fontWeight: 800,
    fontSize: 24,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    display: "flex", alignItems: "center", gap: 8,
  },
  langPill: {
    background: "white",
    border: "1.5px solid rgba(60,30,10,0.18)",
    borderRadius: 999,
    padding: "8px 14px 8px 16px",
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
    display: "flex", alignItems: "center", gap: 8,
    cursor: "pointer",
    boxShadow: "0 2px 0 rgba(60,30,10,0.10)",
  },
  progressRow: {
    display: "flex", alignItems: "center", gap: 8,
    marginTop: 18, marginBottom: 12,
  },
  progressDot: (active, done) => ({
    width: active ? 28 : 10, height: 10,
    borderRadius: 999,
    background: done ? "var(--accent-olive)" : active ? "var(--accent-terra)" : "rgba(60,30,10,0.16)",
    transition: "all 250ms ease",
  }),
  stepLabel: {
    fontFamily: "Special Elite, monospace",
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ink-faint)",
    marginLeft: 4,
  },
  questionWrap: {
    flex: 1,
    display: "flex", flexDirection: "column",
    paddingTop: 6,
  },
  hint: {
    fontFamily: "Caveat, cursive",
    fontSize: 22,
    color: "var(--accent-terra)",
    marginBottom: 4,
    transform: "rotate(-1deg)",
    display: "inline-block",
  },
  questionTitle: {
    fontFamily: "Bricolage Grotesque, serif",
    fontWeight: 800,
    fontSize: 52,
    lineHeight: 0.96,
    letterSpacing: "-0.025em",
    color: "var(--ink)",
    marginTop: 4,
    marginBottom: 18,
  },
  cardGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginTop: 4,
    alignContent: "start",
  },
  cardGrid3: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
    marginTop: 4,
  },
  card: (selected, tilt) => ({
    background: "white",
    borderRadius: "22px 28px 24px 30px",
    border: selected ? "2.5px solid var(--accent-terra)" : "1.8px solid rgba(60,30,10,0.16)",
    padding: "22px 22px 20px",
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12,
    cursor: "pointer",
    transform: `rotate(${tilt}deg)`,
    transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
    boxShadow: selected
      ? "0 6px 0 var(--accent-brick), 0 12px 22px rgba(60,30,10,0.10)"
      : "0 4px 0 rgba(60,30,10,0.10), 0 6px 14px rgba(60,30,10,0.06)",
    position: "relative",
    minHeight: 120,
    textAlign: "left",
    fontFamily: "inherit",
    color: "inherit",
  }),
  cardLabel: {
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 700,
    fontSize: 26,
    lineHeight: 1.05,
    letterSpacing: "-0.005em",
  },
  cardSub: {
    fontFamily: "Caveat, cursive",
    fontSize: 18,
    color: "var(--ink-faint)",
    lineHeight: 1,
  },
  bottomBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: 18,
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "var(--ink-soft)",
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "10px 4px",
    display: "flex", alignItems: "center", gap: 8,
  },
  nextBtn: (enabled, accent) => ({
    background: enabled ? accent : "rgba(60,30,10,0.12)",
    color: enabled ? "white" : "var(--ink-faint)",
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: "0.04em",
    border: "none",
    borderRadius: "18px 22px 18px 22px",
    padding: "16px 30px 14px",
    cursor: enabled ? "pointer" : "not-allowed",
    boxShadow: enabled ? "0 5px 0 rgba(60,30,10,0.22)" : "none",
    transform: enabled ? "rotate(-0.5deg)" : "none",
    display: "flex", alignItems: "center", gap: 10,
    transition: "all 180ms ease",
  }),
};

function Header({ language }) {
  return (
    <div style={screenStyles.header}>
      <div style={screenStyles.logo}>
        <PaperStar size={26} color="var(--accent-mustard)" style={{ transform: "rotate(-12deg)" }} />
        <span>EnergieHuis</span>
        <span style={{ fontFamily: "Caveat", fontSize: 18, color: "var(--ink-faint)", fontWeight: 600, marginLeft: 4, transform: "rotate(-2deg)", display: "inline-block" }}>
          · Delft
        </span>
      </div>
      <div style={screenStyles.langPill} role="button" aria-label="Change language">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M1.5 7 H 12.5 M 7 1.5 Q 4 7 7 12.5 M 7 1.5 Q 10 7 7 12.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
        {language}
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

function Progress({ step, total, label }) {
  return (
    <div style={screenStyles.progressRow}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={screenStyles.progressDot(i === step, i < step)} />
      ))}
      <span style={screenStyles.stepLabel}>{step + 1}/{total} · {label}</span>
    </div>
  );
}

function ChoiceCard({ icon, label, hint, selected, onClick, tilt, accentSticker }) {
  return (
    <button style={screenStyles.card(selected, tilt)} onClick={onClick} type="button">
      {accentSticker && (
        <span style={{ position: "absolute", top: -10, right: 12 }}>
          {accentSticker}
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
        <span style={{
          flex: "0 0 auto",
          width: 64, height: 64,
          borderRadius: "18px 22px 18px 22px",
          background: "var(--screen-bg)",
          border: "1.4px solid rgba(60,30,10,0.14)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
          <span style={screenStyles.cardLabel}>{label}</span>
          {hint && <span style={screenStyles.cardSub}>{hint}</span>}
        </div>
        <span style={{
          width: 22, height: 22, borderRadius: "50%",
          border: "2px solid " + (selected ? "var(--accent-terra)" : "rgba(60,30,10,0.25)"),
          background: selected ? "var(--accent-terra)" : "transparent",
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {selected && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
      </div>
    </button>
  );
}

function FooterNav({ onBack, onNext, nextEnabled, nextLabel = "Next", accent }) {
  return (
    <div style={screenStyles.bottomBar}>
      <button style={screenStyles.backBtn} onClick={onBack} type="button">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back
      </button>
      <button
        style={screenStyles.nextBtn(nextEnabled, accent)}
        onClick={nextEnabled ? onNext : undefined}
        type="button" disabled={!nextEnabled}
      >
        {nextLabel}
        <svg width="18" height="14" viewBox="0 0 18 14"><path d="M2 7 H 14 M 10 2 L 15 7 L 10 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}

// ─── WELCOME ─────────────────────────────────────────────────────────────────

function WelcomeScreen({ onStart, language }) {
  return (
    <div style={screenStyles.page} data-screen-label="01 Welcome">
      <Header language={language} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12px", position: "relative" }}>
        {/* decorative stars */}
        <PaperStar size={36} color="var(--accent-mustard)" style={{ position: "absolute", top: 20, left: 20, transform: "rotate(-18deg)" }} />
        <PaperStar size={22} color="var(--accent-terra)" style={{ position: "absolute", top: 80, right: 30, transform: "rotate(12deg)" }} />
        <PaperStar size={30} color="var(--accent-olive)" style={{ position: "absolute", bottom: 100, left: 30, transform: "rotate(8deg)" }} />

        <Sticker color="#F1E0B6" rotate={-3} style={{ marginBottom: 22 }}>
          ♥ Free · takes 2 minutes
        </Sticker>

        <h1 className="display" style={{
          fontWeight: 800, fontSize: 80, lineHeight: 0.94,
          letterSpacing: "-0.03em", color: "var(--ink)",
          textAlign: "center", margin: 0, maxWidth: 540,
        }}>
          Save energy
          <br />
          <span style={{ color: "var(--accent-terra)", display: "inline-block", position: "relative" }}>
            at home
            <HandUnderline color="var(--accent-mustard)" width={220} style={{ position: "absolute", left: 0, right: 0, margin: "0 auto", bottom: -14, display: "block" }} />
          </span>
          ,
          <br />
          one tip at a time.
        </h1>

        <p style={{
          marginTop: 36, maxWidth: 460, textAlign: "center",
          fontFamily: "Archivo Narrow, sans-serif",
          fontSize: 20, lineHeight: 1.35, color: "var(--ink-soft)",
          fontWeight: 500,
        }}>
          Answer four quick questions about your home.
          We'll print three small ideas you can try this week —
          on the house.
        </p>

        <button
          onClick={onStart}
          style={{
            marginTop: 44,
            background: "var(--accent-terra)",
            color: "white",
            border: "none",
            fontFamily: "Bricolage Grotesque, serif",
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: "-0.01em",
            padding: "22px 64px 18px",
            borderRadius: "36px 44px 36px 44px",
            boxShadow: "0 8px 0 var(--accent-brick), 0 14px 28px rgba(60,30,10,0.18)",
            cursor: "pointer",
            transform: "rotate(-1deg)",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          Tap to start
          <svg width="28" height="22" viewBox="0 0 28 22"><path d="M2 11 H 22 M 16 3 L 24 11 L 16 19" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <p className="hand" style={{ marginTop: 22, color: "var(--ink-faint)", fontSize: 22, transform: "rotate(-1deg)" }}>
          your tips print below ↓
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
        <div style={{ fontFamily: "Special Elite, monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          015Duurzaam · community kiosk · Delft
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Caveat", fontSize: 18, color: "var(--ink-faint)" }}>
          <Squiggle width={30} />
          come say hi inside
        </div>
      </div>
    </div>
  );
}

// ─── QUESTION SCREEN ─────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    key: "tenure",
    short: "Tenure",
    hint: "let's start here →",
    title: "Do you own or rent your home?",
    options: [
      { id: "own",  label: "I own my home",  hint: "free to renovate", icon: <TenureGlyph kind="own" />,  tilt: -0.6 },
      { id: "rent", label: "I rent my home", hint: "tips that don't need permission", icon: <TenureGlyph kind="rent" />, tilt: 0.5 },
    ],
    cols: 1,
  },
  {
    key: "bills",
    short: "Bills",
    hint: "on your contract →",
    title: "Are utilities included in your rent?",
    onlyIf: (a) => a.tenure === "rent",
    options: [
      { id: "included",  label: "Yes, all-in rent",   hint: "energy + water in one number", icon: <BillsGlyph kind="included" />,  tilt: -0.5 },
      { id: "partial",   label: "Some are",           hint: "e.g. water yes, energy no",     icon: <BillsGlyph kind="partial" />,   tilt: 0.4 },
      { id: "separate",  label: "No, I pay them",     hint: "I see every bill directly",     icon: <BillsGlyph kind="separate" />,  tilt: -0.3 },
    ],
    cols: 1,
  },
  {
    key: "household",
    short: "Household",
    hint: "your people →",
    title: "Who do you share this home with?",
    options: [
      { id: "solo",     label: "Just me",            hint: "one set of habits", icon: <PeopleGlyph kind="solo" />,    tilt: -0.5 },
      { id: "partner",  label: "Me + partner",       hint: "two routines to align", icon: <PeopleGlyph kind="partner" />, tilt: 0.4 },
      { id: "family",   label: "Family with kids",   hint: "busy, warm, lights on", icon: <PeopleGlyph kind="family" />, tilt: 0.4 },
      { id: "house",    label: "Housemates",         hint: "shared bills, shared wins", icon: <PeopleGlyph kind="house" />, tilt: -0.6 },
    ],
    cols: 2,
  },
  {
    key: "homeType",
    short: "Home type",
    hint: "your place →",
    title: "What kind of home is it?",
    options: [
      { id: "apartment", label: "Apartment / flat", hint: "shared walls, smaller footprint", icon: <HouseGlyph kind="apartment" />, tilt: -0.4 },
      { id: "house",     label: "House",            hint: "more sides exposed to the cold", icon: <HouseGlyph kind="house" />,     tilt: 0.5 },
    ],
    cols: 1,
  },
  {
    key: "winter",
    short: "Comfort",
    hint: "honestly now →",
    title: "How does it feel in winter?",
    options: [
      { id: "cold", label: "Often cold",      hint: "draughts, chilly corners", icon: <FeelGlyph kind="cold" />, tilt: -0.5 },
      { id: "mild", label: "Sometimes chilly", hint: "okay-ish, room by room",   icon: <FeelGlyph kind="mild" />, tilt: 0.4 },
      { id: "warm", label: "Comfortable",     hint: "we keep it cosy",          icon: <FeelGlyph kind="warm" />, tilt: -0.3 },
    ],
    cols: 1,
  },
];

function getActiveQuestions(answers) {
  return QUESTIONS.filter((q) => !q.onlyIf || q.onlyIf(answers));
}

function QuestionScreen({ stepIdx, activeQuestions, answers, setAnswer, onBack, onNext, language, accent }) {
  const q = activeQuestions[stepIdx];
  const value = answers[q.key];
  const grid = q.cols === 2 ? screenStyles.cardGrid : screenStyles.cardGrid3;
  const isLast = stepIdx === activeQuestions.length - 1;

  return (
    <div style={screenStyles.page} data-screen-label={`0${stepIdx + 2} ${q.title}`}>
      <Header language={language} />
      <Progress step={stepIdx} total={activeQuestions.length} label={q.short} />

      <div style={screenStyles.questionWrap}>
        <span style={screenStyles.hint}>{q.hint}</span>
        <h2 style={screenStyles.questionTitle}>{q.title}</h2>

        <div style={grid}>
          {q.options.map((opt) => (
            <ChoiceCard
              key={opt.id}
              icon={opt.icon}
              label={opt.label}
              hint={opt.hint}
              selected={value === opt.id}
              onClick={() => setAnswer(q.key, opt.id)}
              tilt={opt.tilt}
            />
          ))}
        </div>
      </div>

      <FooterNav
        onBack={onBack}
        onNext={onNext}
        nextEnabled={!!value}
        nextLabel={isLast ? "Get my receipt" : "Next"}
        accent={accent}
      />
    </div>
  );
}

// ─── PRINTING (loader) ───────────────────────────────────────────────────────

function PrintingScreen() {
  const [phase, setPhase] = React.useState(0);
  const phrases = [
    "Reading your answers…",
    "Looking up Delft homes like yours…",
    "Choosing three habits that fit…",
    "Warming up the printer…",
    "Almost ready!",
  ];
  React.useEffect(() => {
    const t = setInterval(() => setPhase((p) => Math.min(p + 1, phrases.length - 1)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={screenStyles.page} data-screen-label="06 Printing">
      <Header language="English" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Sticker color="#E7D9B8" rotate={-2}>finding what works ⌁</Sticker>
        <div style={{
          fontFamily: "Bricolage Grotesque, serif",
          fontWeight: 800, fontSize: 60, lineHeight: 0.95,
          letterSpacing: "-0.025em", color: "var(--ink)",
          textAlign: "center", maxWidth: 460,
        }}>
          One moment, <br />
          we're cooking up<br />
          <span style={{ color: "var(--accent-terra)", position: "relative", display: "inline-block" }}>
            your tips.
            <HandUnderline color="var(--accent-olive)" width={180} style={{ position: "absolute", left: 0, right: 0, margin: "0 auto", bottom: -12 }} />
          </span>
        </div>

        {/* spinner — three stamps animating */}
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 14, height: 14, borderRadius: "50%",
              background: "var(--accent-terra)",
              animation: `kiosk-pulse 1.1s ${i*0.16}s ease-in-out infinite`,
            }} />
          ))}
        </div>

        <p style={{
          fontFamily: "Special Elite, monospace",
          fontSize: 16, color: "var(--ink-faint)", textAlign: "center",
          letterSpacing: "0.02em", margin: 0, minHeight: 24,
        }}>
          {phrases[phase]}
        </p>

        <style>{`
          @keyframes kiosk-pulse {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.4 }
            40% { transform: scale(1.15); opacity: 1 }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── DONE ────────────────────────────────────────────────────────────────────

function DoneScreen({ onReset, onPrintAgain, onShare }) {
  return (
    <div style={screenStyles.page} data-screen-label="07 Take your receipt">
      <Header language="English" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 16px", textAlign: "center" }}>
        <Sticker color="#D8E2BE" rotate={-2}>receipt ready ⚡</Sticker>
        <h2 style={{
          fontFamily: "Bricolage Grotesque, serif",
          fontWeight: 800, fontSize: 56, lineHeight: 0.96,
          letterSpacing: "-0.03em", color: "var(--ink)", margin: 0,
          maxWidth: 520,
        }}>
          All done!<br />
          <span style={{ color: "var(--accent-olive)" }}>Tear your receipt</span>
          <br /> off below.
        </h2>
        <p className="hand" style={{ fontSize: 24, color: "var(--accent-terra)", margin: 0, transform: "rotate(-1deg)" }}>
          ↓ careful, paper is warm ↓
        </p>

        {/* Send-to-phone section */}
        <div style={{
          marginTop: 14,
          width: "100%",
          maxWidth: 560,
          background: "white",
          border: "1.6px solid rgba(60,30,10,0.16)",
          borderRadius: "22px 28px 22px 28px",
          padding: "18px 18px 20px",
          boxShadow: "0 5px 0 rgba(60,30,10,0.10)",
          transform: "rotate(-0.4deg)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <Squiggle width={40} color="var(--accent-mustard)" />
            <span style={{
              fontFamily: "Caveat, cursive", fontSize: 24, fontWeight: 700,
              color: "var(--ink)",
            }}>
              Want it on your phone too?
            </span>
            <Squiggle width={40} color="var(--accent-mustard)" style={{ transform: "scaleX(-1)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <ShareButton
              icon={
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                  <rect x="1" y="1" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 3 L14 13 L26 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
                </svg>
              }
              label="Email"
              hint="to your inbox"
              tint="rgba(201,95,60,0.10)"
              onClick={() => onShare("email")}
            />
            <ShareButton
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M3 5 Q 3 3 5 3 H 21 Q 23 3 23 5 V 16 Q 23 18 21 18 H 11 L 5 23 V 18 Q 3 18 3 16 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
                  <circle cx="9" cy="11" r="1.4" fill="currentColor" />
                  <circle cx="13" cy="11" r="1.4" fill="currentColor" />
                  <circle cx="17" cy="11" r="1.4" fill="currentColor" />
                </svg>
              }
              label="Text"
              hint="SMS / WhatsApp"
              tint="rgba(110,126,63,0.12)"
              onClick={() => onShare("sms")}
            />
            <ShareButton
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="2" y="2"  width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="16" y="2" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="2" y="16" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="5" y="5"  width="2" height="2" fill="currentColor" />
                  <rect x="19" y="5" width="2" height="2" fill="currentColor" />
                  <rect x="5" y="19" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="14" width="3" height="3" fill="currentColor" />
                  <rect x="19" y="14" width="2" height="2" fill="currentColor" />
                  <rect x="14" y="19" width="2" height="2" fill="currentColor" />
                  <rect x="19" y="21" width="3" height="3" fill="currentColor" />
                </svg>
              }
              label="QR code"
              hint="scan to receive"
              tint="rgba(214,167,50,0.18)"
              onClick={() => onShare("qr")}
            />
          </div>
          <p style={{
            margin: "12px 0 0",
            fontFamily: "Special Elite, monospace",
            fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--ink-faint)", textAlign: "center",
          }}>
            we won't keep your details · sent once, then forgotten
          </p>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={onPrintAgain}
            style={{
              background: "transparent",
              border: "2px solid rgba(60,30,10,0.25)",
              borderRadius: "18px 22px 18px 22px",
              padding: "12px 22px 10px",
              fontFamily: "Archivo Narrow, sans-serif", fontWeight: 700, fontSize: 16,
              color: "var(--ink-soft)", letterSpacing: "0.04em",
              cursor: "pointer",
            }}
          >
            ↻ Print again
          </button>
          <button
            onClick={onReset}
            style={{
              background: "var(--accent-terra)", color: "white",
              border: "none",
              borderRadius: "18px 22px 18px 22px",
              padding: "12px 26px 10px",
              fontFamily: "Archivo Narrow, sans-serif", fontWeight: 700, fontSize: 16,
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 5px 0 var(--accent-brick)",
            }}
          >
            Start over
          </button>
        </div>

        <div style={{ marginTop: 8, fontFamily: "Special Elite, monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          auto-reset in a moment · session forgotten
        </div>
      </div>
    </div>
  );
}

function ShareButton({ icon, label, hint, tint, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      background: tint,
      border: "1.6px solid rgba(60,30,10,0.18)",
      borderRadius: "16px 20px 16px 20px",
      padding: "14px 8px 12px",
      cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      color: "var(--ink)",
      boxShadow: "0 3px 0 rgba(60,30,10,0.12)",
      fontFamily: "inherit",
    }}>
      <span style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "white",
        border: "1.4px solid rgba(60,30,10,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--ink)",
      }}>{icon}</span>
      <span style={{ fontFamily: "Archivo Narrow, sans-serif", fontWeight: 700, fontSize: 17 }}>{label}</span>
      <span style={{ fontFamily: "Caveat, cursive", fontSize: 15, color: "var(--ink-faint)", lineHeight: 1 }}>{hint}</span>
    </button>
  );
}

Object.assign(window, {
  WelcomeScreen, QuestionScreen, PrintingScreen, DoneScreen,
  QUESTIONS, getActiveQuestions, HandUnderline, PaperStar, Squiggle, Sticker,
});
