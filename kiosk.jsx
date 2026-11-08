// Kiosk cabinet — the physical frame around the touchscreen + printer slot.
// Renders a warm-painted plywood pillar housing a portrait tablet and a
// thermal printer slot below. Children are rendered inside the tablet screen.

const cabinetStyles = {
  outer: {
    position: "relative",
    width: 720,
    minHeight: 1160,
    margin: "0 auto",
    filter: "drop-shadow(0 60px 60px rgba(60,30,10,0.28))",
  },
  body: {
    position: "relative",
    zIndex: 2,
    width: 720,
    background: "var(--cabinet)",
    borderRadius: "36px 36px 18px 18px",
    paddingTop: 36,
    paddingBottom: 30,
    paddingLeft: 28,
    paddingRight: 28,
    // painted wood feel
    backgroundImage: `
      linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.12) 100%),
      repeating-linear-gradient(94deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 9px),
      radial-gradient(60% 80% at 50% 0%, rgba(255,255,255,0.14), transparent 60%)
    `,
    boxShadow: `
      inset 0 2px 0 rgba(255,255,255,0.22),
      inset 0 -6px 0 rgba(0,0,0,0.18),
      inset 6px 0 0 rgba(0,0,0,0.06),
      inset -6px 0 0 rgba(0,0,0,0.06)
    `,
    border: "1px solid rgba(0,0,0,0.10)",
  },
  signPlate: {
    position: "absolute",
    top: -6,
    left: "50%",
    transform: "translateX(-50%) rotate(-1deg)",
    background: "var(--cabinet-trim)",
    color: "var(--ink)",
    padding: "10px 28px 8px",
    borderRadius: 8,
    boxShadow: "0 4px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
    border: "1.5px solid rgba(60,30,10,0.18)",
    fontFamily: "Caveat, cursive",
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    zIndex: 4,
  },
  // little hanging tag string
  string: {
    position: "absolute",
    top: -22, left: "50%",
    width: 1, height: 16,
    background: "rgba(0,0,0,0.35)",
    transform: "translateX(-50%)",
  },
  // corner brass screws
  screw: (corner) => {
    const positions = {
      tl: { top: 14, left: 14 },
      tr: { top: 14, right: 14 },
      bl: { bottom: 14, left: 14 },
      br: { bottom: 14, right: 14 },
    };
    return {
      position: "absolute",
      width: 10, height: 10,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, #E2C58A, var(--brass) 60%, #6E4F2A)",
      boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3)",
      ...positions[corner],
    };
  },
  bezel: {
    position: "relative",
    width: "100%",
    height: 920,
    background: "#1a1410",
    borderRadius: 28,
    padding: 14,
    boxShadow: `
      inset 0 0 0 1.5px rgba(255,255,255,0.04),
      inset 0 2px 12px rgba(0,0,0,0.6),
      0 0 0 2px rgba(0,0,0,0.25),
      0 8px 28px rgba(0,0,0,0.28)
    `,
  },
  screen: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    background: "var(--screen-bg)",
    overflow: "hidden",
    boxShadow: "inset 0 0 60px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)",
  },
  // tiny dot for "camera"
  cam: {
    position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)",
    width: 6, height: 6, borderRadius: "50%",
    background: "#0a0807",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
    zIndex: 3,
  },
  // gap between tablet and the printer
  printerHousing: {
    marginTop: 22,
    position: "relative",
    zIndex: 1,
    background: "rgba(0,0,0,0.18)",
    borderRadius: 14,
    padding: "12px 18px 14px",
    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(255,255,255,0.06)",
  },
  printerLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,245,225,0.7)",
    fontFamily: "Special Elite, monospace",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    marginBottom: 8,
  },
  slot: {
    position: "relative",
    height: 22,
    borderRadius: 4,
    background:
      "linear-gradient(180deg, #0a0706 0%, #181210 40%, #0a0706 80%)",
    boxShadow:
      "inset 0 4px 8px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,255,255,0.04)",
    overflow: "visible",
  },
  // serrated tear edge along the front of the slot
  teeth: {
    position: "absolute",
    left: 6, right: 6, bottom: -1,
    height: 9,
    background:
      "linear-gradient(180deg, #E8DDC4, #C9B98E)",
    clipPath:
      "polygon(0% 0%, 100% 0%, 99% 50%, 97.5% 100%, 95% 50%, 93% 100%, 90.5% 50%, 88% 100%, 85.5% 50%, 83% 100%, 80.5% 50%, 78% 100%, 75.5% 50%, 73% 100%, 70.5% 50%, 68% 100%, 65.5% 50%, 63% 100%, 60.5% 50%, 58% 100%, 55.5% 50%, 53% 100%, 50.5% 50%, 48% 100%, 45.5% 50%, 43% 100%, 40.5% 50%, 38% 100%, 35.5% 50%, 33% 100%, 30.5% 50%, 28% 100%, 25.5% 50%, 23% 100%, 20.5% 50%, 18% 100%, 15.5% 50%, 13% 100%, 10.5% 50%, 8% 100%, 5.5% 50%, 3% 100%, 1% 50%)",
  },
  // status LEDs
  leds: {
    position: "absolute", right: 16, top: 12,
    display: "flex", gap: 6, alignItems: "center",
  },
  // base plinth
  base: {
    position: "relative",
    zIndex: 1,
    width: 740,
    height: 36,
    margin: "-6px auto 0",
    borderRadius: "0 0 18px 18px",
    background: "linear-gradient(180deg, var(--cabinet-shadow), #6B3E29)",
    boxShadow: "0 18px 36px rgba(40,18,4,0.4)",
  },
};

function StatusLED({ color, pulse }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%",
      background: color,
      boxShadow: `0 0 6px ${color}, inset 0 0 1px rgba(0,0,0,0.5)`,
      animation: pulse ? "kiosk-blink 1.4s ease-in-out infinite" : "none",
    }} />
  );
}

function KioskCabinet({ children, paperFeed, printing, ready, cabinetColor }) {
  const colors = {
    ochre:  { body: "#C97B5C", shadow: "#9C5B40", trim: "#F2E7CF" },
    sage:   { body: "#7C8C5E", shadow: "#5D6B43", trim: "#EEE7C9" },
    rust:   { body: "#A3553B", shadow: "#7A3B26", trim: "#F1E1C5" },
    walnut: { body: "#7D5237", shadow: "#553722", trim: "#EFDEBF" },
  };
  const c = colors[cabinetColor] || colors.ochre;

  return (
    <div style={cabinetStyles.outer}>
      <style>{`
        @keyframes kiosk-blink { 0%,100% { opacity: 0.35 } 50% { opacity: 1 } }
      `}</style>
      <div style={{
        ...cabinetStyles.body,
        background: c.body,
        ["--cabinet"]: c.body,
        ["--cabinet-shadow"]: c.shadow,
        ["--cabinet-trim"]: c.trim,
      }}>
        {/* hanging sign / nameplate */}
        <div style={cabinetStyles.string} />
        <div style={{ ...cabinetStyles.signPlate, background: c.trim }}>
          ✿ Energy advice · drop by anytime
        </div>

        {/* corner screws */}
        <span style={cabinetStyles.screw("tl")} />
        <span style={cabinetStyles.screw("tr")} />
        <span style={cabinetStyles.screw("bl")} />
        <span style={cabinetStyles.screw("br")} />

        {/* tablet */}
        <div style={cabinetStyles.bezel}>
          <span style={cabinetStyles.cam} />
          <div style={cabinetStyles.screen} data-screen-label="kiosk screen">
            {children}
          </div>
        </div>

        {/* printer housing */}
        <div style={cabinetStyles.printerHousing}>
          <div style={cabinetStyles.printerLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="9" width="18" height="9" rx="1.5" stroke="rgba(255,245,225,0.7)" strokeWidth="1.5" />
              <rect x="6" y="4" width="12" height="6" rx="0.5" stroke="rgba(255,245,225,0.7)" strokeWidth="1.5" />
              <rect x="7" y="14" width="10" height="6" rx="0.5" stroke="rgba(255,245,225,0.7)" strokeWidth="1.5" />
            </svg>
            <span>Thermal printer · receipts free</span>
            <div style={cabinetStyles.leds}>
              <StatusLED color="#7BC47F" />
              <StatusLED color={printing ? "#E8B441" : "#5A4A3A"} pulse={printing} />
            </div>
          </div>
          <div style={cabinetStyles.slot}>
            {/* paper feeding out — handled by parent via paperFeed children */}
            {paperFeed}
            <div style={cabinetStyles.teeth} />
          </div>
        </div>
      </div>
      <div style={cabinetStyles.base} />
    </div>
  );
}

Object.assign(window, { KioskCabinet });
