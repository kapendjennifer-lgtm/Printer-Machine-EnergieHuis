// Receipt — the thermal-printed paper that comes out the slot.

// ─── TIP DATABASE ────────────────────────────────────────────────────────────
// Each tip has tags. We score them against the answer set and pick top 3.

const TIPS = [
  // standby / appliances — universal
  { id: "standby-hunt", tags: ["any"], cost: "free", title: "10-minute standby hunt",
    body: "This weekend, walk the whole home and switch every glowing light off at the wall — TV, microwave, chargers. A typical Delft flat saves €4–€7 a month doing this once."
  },
  { id: "fridge-back", tags: ["any"], cost: "free", title: "Pull the fridge out, dust the back",
    body: "Dust on the coils makes the motor work harder. Five minutes with a brush. The fridge runs quieter and cooler the same evening."
  },
  { id: "washing-cold", tags: ["any"], cost: "free", title: "Wash at 30°C, not 40°C",
    body: "Modern detergent is built for cold. Roughly 35% less energy per cycle, and clothes last longer too."
  },
  // heating / comfort — for cold/mild homes
  { id: "thermostat-down", tags: ["cold","mild"], cost: "free", title: "Drop the thermostat 1°C",
    body: "One degree lower for one winter saves about 6% on gas. Wear the chunky socks. You'll forget within a week."
  },
  { id: "curtain-trick", tags: ["cold","mild"], cost: "free", title: "Curtains down at dusk",
    body: "Closing curtains the moment it's dark traps a layer of warm air against the window. Open them again at sunrise to let heat in."
  },
  { id: "bleed-radiators", tags: ["cold","mild"], cost: "free", title: "Bleed your radiators",
    body: "If the top is cooler than the bottom, there's air inside. Two minutes with a small key (we lend them — ask inside)."
  },
  // draught / sealing — for cold homes
  { id: "draught-letterbox", tags: ["cold"], cost: "low", title: "Brush strip for the letterbox",
    body: "The letterbox is usually the biggest single hole in a front door. A €4 brush strip clips on in 30 seconds."
  },
  { id: "draught-door", tags: ["cold","mild"], cost: "free", title: "Towel along the front door",
    body: "Tonight, roll a towel along the bottom of the door. If the room feels warmer in an hour, you've found a job for a proper draught excluder."
  },
  // renter-friendly framing
  { id: "renter-rights", tags: ["rent"], cost: "free", title: "Know what your landlord owes you",
    body: "A renter has the right to a properly maintained, energy-fair home. If radiators don't get hot or windows whistle, that's the landlord's job — not yours. We can help you write the letter."
  },
  { id: "renter-monitor", tags: ["rent"], cost: "free", title: "Borrow our energy monitor",
    body: "Plug it into one socket for a week and see what's actually using power. Free loan from the desk — no deposit, no card."
  },
  // owner-specific
  { id: "owner-floor", tags: ["own"], cost: "med", title: "Insulate under the ground floor",
    body: "The cheapest big retrofit for a Delft house. Subsidised by the gemeente. Pays itself back in 4–6 winters."
  },
  { id: "owner-hr++", tags: ["own","cold"], cost: "med", title: "Swap single glazing for HR++",
    body: "Older Delft houses still have one or two single-pane windows somewhere. Replacing just the worst one or two often beats doing them all."
  },
  // multi-person households
  { id: "share-routine", tags: ["partner","family","house"], cost: "free", title: "One shared shutdown routine",
    body: "Agree on who flips the kitchen + living room off last each night. Two routines become one. The bill drops by itself."
  },
  { id: "kids-game", tags: ["family"], cost: "free", title: "Make it a kid game",
    body: "Whoever spots the most unnecessary lights on, wins something small. Kids are weirdly good at this and the habit sticks."
  },
  { id: "housemate-bill", tags: ["house"], cost: "free", title: "Stick the bill on the fridge",
    body: "Shared house, shared bill. Once everyone sees the number, the number goes down. No nagging required."
  },
  // apartment / house specific
  { id: "apt-block-letter", tags: ["apartment"], cost: "free", title: "One letter to the VvE",
    body: "Most savings in a flat live in the building, not your unit. Ask the owners' association about insulating the shared roof and stairwell — we have a template letter."
  },
  { id: "house-attic", tags: ["house","own"], cost: "med", title: "30 cm of attic wool",
    body: "Heat rises and leaves through the roof. Attic insulation is the highest-return job in a Delft house and the gemeente still has a subsidy."
  },
  // warm-comfort homes
  { id: "warm-tariff", tags: ["warm"], cost: "free", title: "Re-check your tariff",
    body: "If your home already feels good, the next saving is on the bill itself. Bring last month's invoice — we'll compare in five minutes."
  },
];

function scoreTip(tip, a) {
  let s = 0;
  if (tip.tags.includes("any")) s += 1;
  if (tip.tags.includes(a.tenure)) s += 4;
  if (tip.tags.includes(a.household)) s += 3;
  if (tip.tags.includes(a.homeType)) s += 3;
  if (tip.tags.includes(a.winter)) s += 4;
  return s;
}

function pickTips(answers) {
  const ranked = TIPS
    .map((t) => ({ t, s: scoreTip(t, answers) }))
    .sort((a, b) => b.s - a.s);
  const out = [];
  const seen = new Set();
  for (const { t } of ranked) {
    // dedupe by topic — try to avoid 3 standby tips
    const topic = t.id.split("-")[0];
    if (seen.has(topic)) continue;
    seen.add(topic);
    out.push(t);
    if (out.length === 3) break;
  }
  while (out.length < 3) {
    const fallback = ranked[out.length]?.t;
    if (!fallback) break;
    out.push(fallback);
  }
  return out;
}

function savingPotential(answers) {
  // crude rule: bigger savings if cold + own, smaller if warm + rent
  let p = 0;
  if (answers.winter === "cold") p += 2; else if (answers.winter === "mild") p += 1;
  if (answers.tenure === "own") p += 1;
  if (answers.homeType === "house") p += 1;
  if (answers.household === "family" || answers.household === "house") p += 1;
  if (p >= 4) return { level: "Big", pct: 85, blurb: "Plenty to gain — small habits + 1-2 fixes could shift your winter bill noticeably." };
  if (p >= 2) return { level: "Medium", pct: 55, blurb: "A handful of habits will show up on the next bill. One fix later this year could push it further." };
  return { level: "Small", pct: 25, blurb: "Not on your bill yet — but in your habits for the future. Worth doing for the routine alone." };
}

const ANSWER_LABELS = {
  tenure:   { own: "Owner", rent: "Renter" },
  household:{ solo: "Just me", partner: "Me + partner", family: "Family + kids", house: "Housemates" },
  homeType: { apartment: "Apartment", house: "House" },
  winter:   { cold: "Often cold", mild: "Sometimes chilly", warm: "Comfortable" },
};

// ─── RECEIPT VISUAL ──────────────────────────────────────────────────────────

const receiptStyles = {
  // outer animator — manages the slide-down "feeding" motion
  feeder: (progress) => ({
    position: "absolute",
    top: 21,                // align to bottom of slot
    left: "50%",
    transform: `translateX(-50%)`,
    width: 286,
    pointerEvents: "none",
    zIndex: 0,
  }),
  paper: {
    position: "relative",
    width: 286,
    background: "var(--paper)",
    color: "var(--ink)",
    padding: "16px 16px 0",
    fontFamily: "Special Elite, monospace",
    fontSize: 12,
    lineHeight: 1.4,
    boxShadow:
      "0 8px 22px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)",
    // paper grain
    backgroundImage:
      `radial-gradient(rgba(80,55,30,0.06) 1px, transparent 1px),
       radial-gradient(rgba(80,55,30,0.04) 1px, transparent 1px)`,
    backgroundSize: "3px 3px, 7px 7px",
    backgroundPosition: "0 0, 1.5px 2.5px",
  },
  // ragged tear bottom of receipt
  tearEdge: {
    width: "100%",
    height: 12,
    background: "var(--paper)",
    clipPath:
      "polygon(0% 0%, 4% 80%, 8% 30%, 12% 90%, 17% 40%, 22% 85%, 27% 30%, 32% 92%, 38% 35%, 44% 88%, 50% 30%, 56% 90%, 62% 35%, 68% 92%, 74% 30%, 80% 88%, 86% 35%, 92% 92%, 96% 30%, 100% 90%, 100% 0%)",
  },
  hr: {
    border: "none",
    borderTop: "1px dashed rgba(60,30,10,0.45)",
    margin: "10px 0",
  },
  brandRow: { textAlign: "center", marginTop: 2 },
  brandWord: {
    fontFamily: "Bricolage Grotesque, serif",
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    lineHeight: 1,
  },
  brandSub: {
    fontFamily: "Special Elite, monospace",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--ink-soft)",
    marginTop: 4,
  },
  metaRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 10, color: "var(--ink-soft)",
    letterSpacing: "0.04em",
  },
  sectionTitle: {
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--ink)",
    textAlign: "center",
    margin: "2px 0",
  },
  answerRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 12, padding: "2px 0",
    color: "var(--ink)",
  },
  answerLabel: { color: "var(--ink-soft)" },
  meter: {
    position: "relative",
    height: 14,
    width: "100%",
    background: "linear-gradient(90deg, #F3E7CB 0%, #D8C9A1 50%, #6E5A3C 100%)",
    borderRadius: 999,
    border: "1px solid rgba(60,30,10,0.3)",
    margin: "6px 0 4px",
    overflow: "visible",
  },
  meterDot: (pct) => ({
    position: "absolute",
    left: `${pct}%`,
    top: -3, transform: "translateX(-50%)",
    width: 20, height: 20,
    borderRadius: "50%",
    background: "var(--accent-terra)",
    border: "2px solid var(--ink)",
    boxShadow: "0 1px 0 rgba(0,0,0,0.2)",
  }),
  meterScale: {
    display: "flex", justifyContent: "space-between",
    fontFamily: "Special Elite, monospace",
    fontSize: 9, color: "var(--ink-soft)",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },
  tipNum: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 18, height: 18, borderRadius: "50%",
    border: "1.5px solid var(--ink)",
    fontFamily: "Bricolage Grotesque, serif",
    fontWeight: 800, fontSize: 11,
    marginRight: 6,
  },
  tipTitle: {
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 700, fontSize: 13,
    color: "var(--ink)", display: "flex", alignItems: "center",
    lineHeight: 1.15, marginBottom: 4,
  },
  tipBody: {
    fontFamily: "Special Elite, monospace",
    fontSize: 11, lineHeight: 1.4,
    color: "var(--ink-soft)",
  },
  firstStep: {
    fontFamily: "Archivo Narrow, sans-serif",
    fontWeight: 700, fontSize: 12,
    textAlign: "center", color: "var(--ink)",
    background: "rgba(214,167,50,0.25)",
    border: "1px dashed rgba(60,30,10,0.4)",
    padding: "8px 10px",
    margin: "4px 0",
    lineHeight: 1.25,
  },
  footer: {
    fontFamily: "Special Elite, monospace",
    fontSize: 10,
    textAlign: "center",
    color: "var(--ink-soft)",
    lineHeight: 1.4,
    padding: "0 6px",
  },
  qr: {
    width: 64, height: 64,
    margin: "4px auto",
    background:
      `repeating-conic-gradient(var(--ink) 0% 25%, var(--paper) 0% 50%) 0 0/8px 8px,
       repeating-linear-gradient(0deg, var(--ink) 0 1px, transparent 1px 4px),
       repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 4px)`,
    border: "2px solid var(--ink)",
    position: "relative",
  },
  qrCorner: (pos) => {
    const positions = {
      tl: { top: 2, left: 2 }, tr: { top: 2, right: 2 }, bl: { bottom: 2, left: 2 }
    };
    return {
      position: "absolute",
      width: 14, height: 14,
      border: "3px solid var(--ink)",
      background: "var(--paper)",
      ...positions[pos],
    };
  },
};

function QRish() {
  return (
    <div style={receiptStyles.qr}>
      <span style={receiptStyles.qrCorner("tl")} />
      <span style={receiptStyles.qrCorner("tr")} />
      <span style={receiptStyles.qrCorner("bl")} />
    </div>
  );
}

function Receipt({ answers, dateStr, ticketNo }) {
  const tips = React.useMemo(() => pickTips(answers), [answers]);
  const sp = React.useMemo(() => savingPotential(answers), [answers]);

  return (
    <div style={receiptStyles.paper} className="kiosk-receipt">
      {/* brand */}
      <div style={receiptStyles.brandRow}>
        <div style={receiptStyles.brandWord}>EnergieHuis</div>
        <div style={receiptStyles.brandSub}>015Duurzaam · Delft</div>
      </div>

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.metaRow}>
        <span>{dateStr}</span>
        <span>No. {ticketNo}</span>
      </div>

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.sectionTitle}>Your home</div>
      <div>
        <div style={receiptStyles.answerRow}>
          <span style={receiptStyles.answerLabel}>Tenure</span>
          <span>{ANSWER_LABELS.tenure[answers.tenure]}</span>
        </div>
        <div style={receiptStyles.answerRow}>
          <span style={receiptStyles.answerLabel}>Household</span>
          <span>{ANSWER_LABELS.household[answers.household]}</span>
        </div>
        <div style={receiptStyles.answerRow}>
          <span style={receiptStyles.answerLabel}>Home type</span>
          <span>{ANSWER_LABELS.homeType[answers.homeType]}</span>
        </div>
        <div style={receiptStyles.answerRow}>
          <span style={receiptStyles.answerLabel}>Winter feel</span>
          <span>{ANSWER_LABELS.winter[answers.winter]}</span>
        </div>
      </div>

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.sectionTitle}>Saving potential</div>
      <div style={receiptStyles.meter}>
        <span style={receiptStyles.meterDot(sp.pct)} />
      </div>
      <div style={receiptStyles.meterScale}>
        <span>Small</span><span>Medium</span><span>Big</span>
      </div>
      <div style={{
        textAlign: "center", fontFamily: "Archivo Narrow, sans-serif",
        fontWeight: 700, fontSize: 13, marginTop: 6, color: "var(--ink)",
      }}>
        {sp.level} — {sp.blurb}
      </div>

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.sectionTitle}>Three ideas for this week</div>
      {tips.map((t, i) => (
        <div key={t.id} style={{ marginTop: i === 0 ? 4 : 10 }}>
          <div style={receiptStyles.tipTitle}>
            <span style={receiptStyles.tipNum}>{i + 1}</span>
            {t.title}
          </div>
          <div style={receiptStyles.tipBody}>{t.body}</div>
        </div>
      ))}

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.sectionTitle}>Your first step</div>
      <div style={receiptStyles.firstStep}>
        {tips[0]?.title}.<br />
        <span style={{ fontFamily: "Caveat, cursive", fontWeight: 700, fontSize: 16, color: "var(--accent-terra)" }}>
          ↓ try it this weekend ↓
        </span>
      </div>

      <hr style={receiptStyles.hr} />

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <QRish />
        <div style={{ fontSize: 10, color: "var(--ink-soft)", lineHeight: 1.4, flex: 1 }}>
          <strong style={{ color: "var(--ink)", fontFamily: "Archivo Narrow", fontWeight: 700, fontSize: 11, display: "block", marginBottom: 3 }}>Questions?</strong>
          Scan, or just walk in. We're at <b>Vesteplein 100</b>, Wed–Sat 11–17. Free, no appointment.
        </div>
      </div>

      <hr style={receiptStyles.hr} />

      <div style={receiptStyles.footer}>
        ❀ Come back anytime ❀<br />
        Energiehuis · 015Duurzaam · Delft<br />
        <span style={{ fontSize: 8, letterSpacing: "0.2em" }}>** end of receipt **</span>
      </div>

      {/* tear-shaped bottom */}
      <div style={{ height: 18 }} />
      <div style={receiptStyles.tearEdge} />
    </div>
  );
}

// ─── ANIMATED FEEDER ─────────────────────────────────────────────────────────
// During the "printing" and "done" phases, this component renders a paper that
// slides down out of the printer slot. The fully-printed length is measured
// once and then revealed progressively via clip-path / translate.

function ReceiptFeeder({ answers, phase, dateStr, ticketNo, onPrinted }) {
  const PRINT_DURATION = 4200; // ms
  const [progress, setProgress] = React.useState(0); // 0..1
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    if (phase !== "printing" && phase !== "done") {
      setProgress(0);
      return;
    }
    if (phase === "done") { setProgress(1); return; }

    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / PRINT_DURATION);
      setProgress(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (onPrinted) {
        onPrinted();
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  if (phase === "idle" || phase === "welcome") return null;
  if (phase === "questions") return null;

  // wobble during print
  const wobble = phase === "printing"
    ? `translateX(calc(-50% + ${Math.sin(progress * 60) * 0.6}px))`
    : "translateX(-50%)";

  return (
    <div style={{
      position: "absolute",
      top: 21,
      left: "50%",
      transform: wobble,
      width: 286,
      zIndex: 0,
      pointerEvents: "none",
    }}>
      {/* clipping window — reveals more receipt as progress grows */}
      <div style={{
        // we use mask to fade the top edge into the slot
        maskImage: "linear-gradient(180deg, transparent 0, transparent 4px, black 18px)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0, transparent 4px, black 18px)",
        transition: phase === "done" ? "none" : undefined,
      }}>
        <div style={{
          // pull paper up by (1-progress) of its full height to reveal incrementally
          transform: `translateY(${(progress - 1) * 100}%)`,
          transition: phase === "done" ? "transform 200ms ease-out" : "none",
        }}>
          <Receipt answers={answers} dateStr={dateStr} ticketNo={ticketNo} />
        </div>
      </div>
      {/* subtle drop shadow under the dangling paper */}
      <div style={{
        position: "absolute",
        left: 14, right: 14,
        bottom: -16,
        height: 16,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.18), transparent 70%)",
        filter: "blur(2px)",
        opacity: 0.7,
      }} />
    </div>
  );
}

Object.assign(window, { Receipt, ReceiptFeeder, pickTips, savingPotential });
