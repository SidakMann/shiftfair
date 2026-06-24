import { ShiftCard } from "./ShiftCard";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0d12",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <ShiftCard />
    </div>
  );
}
