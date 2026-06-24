import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "window-open" | "allocating" | "awarded" | "expired";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Posted",
  "window-open": "Window open",
  allocating: "Allocating",
  awarded: "Awarded",
  expired: "Expired",
};

export function ShiftCardCSS() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);

  const countRef = useRef(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearProgressTimer() {
    if (progressTimerRef.current !== null) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }

  function clearPhaseTimer() {
    if (phaseTimerRef.current !== null) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }

  function drop() {
    if (phase !== "idle") return;
    countRef.current = 0;
    setCount(0);
    setProgress(0);
    setPhase("window-open");

    clearProgressTimer();
    let p = 0;
    progressTimerRef.current = setInterval(() => {
      p = Math.min(p + 100 / 60, 100);
      setProgress(p);
      if (p >= 100) clearProgressTimer();
    }, 100);
  }

  function addEntrant() {
    if (phase !== "window-open") return;
    countRef.current += 1;
    setCount(countRef.current);
  }

  function closeWindow() {
    if (phase !== "window-open") return;
    clearProgressTimer();
    setProgress(100);
    setPhase("allocating");

    phaseTimerRef.current = setTimeout(() => {
      const outcome: Phase = countRef.current > 0 ? "awarded" : "expired";
      setPhase(outcome);
      phaseTimerRef.current = setTimeout(() => {
        setPhase("idle");
        setProgress(0);
        setCount(0);
        countRef.current = 0;
      }, 1500);
    }, 800);
  }

  useEffect(
    () => () => {
      clearProgressTimer();
      clearPhaseTimer();
    },
    [],
  );

  const showBar = phase !== "idle";
  const showCount = phase === "window-open" || phase === "allocating";
  const showWinner = phase === "awarded" || phase === "expired";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: 32,
      }}
    >
      <div
        style={{
          width: 320,
          height: 220,
          borderRadius: 14,
          background: "#14181f",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#9ba3af",
          }}
        >
          {PHASE_LABEL[phase]}
        </div>

        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "#2a2f38",
            overflow: "hidden",
            opacity: showBar ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#7fe3c8",
              borderRadius: 3,
              transition: "width 0.08s linear",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#9ba3af",
            opacity: showCount ? 1 : 0,
            transition: "opacity 0.3s",
            minHeight: 20,
          }}
        >
          {count === 0 ? "No entrants yet" : `${count} interested`}
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 26,
            fontWeight: 700,
            color: phase === "awarded" ? "#7fe3c8" : "#ff9b7a",
            opacity: showWinner ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          {phase === "awarded" ? "Awarded" : "Expired"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Btn onClick={drop} disabled={phase !== "idle"} color="#7fe3c8">
          Drop a shift
        </Btn>
        <Btn
          onClick={addEntrant}
          disabled={phase !== "window-open"}
          color="#9ba3af"
        >
          + Entrant ({count})
        </Btn>
        <Btn
          onClick={closeWindow}
          disabled={phase !== "window-open"}
          color="#ff9b7a"
        >
          Close window
        </Btn>
      </div>

      <p
        style={{
          color: "#6b7280",
          fontSize: 13,
          margin: 0,
          fontFamily: "monospace",
        }}
      >
        phase: {phase} · entrants: {count}
      </p>
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 20px",
        borderRadius: 8,
        border: "none",
        background: disabled ? "#1e2430" : color,
        color: disabled ? "#4b5563" : "#14181f",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: 14,
        transition: "background 0.15s",
      }}
    >
      {children}
    </button>
  );
}
