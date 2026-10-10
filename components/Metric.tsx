export function Metric({ value, label, tone }: { value: string | number; label: string; tone?: "good" | "bad" }) {
  return (
    <div className={`metric ${tone ?? ""}`}>
      <b className="mono">{value}</b>
      <span>{label}</span>
    </div>
  );
}
