export default function StatusState({ type, message, onRetry }: { type: "empty" | "error"; message: string; onRetry?: () => void }) {
  return <div className="p-8 text-center"><p className="font-semibold">{type === "error" ? "Something went wrong" : "Nothing here yet"}</p><p className="muted mt-1">{message}</p>{onRetry && <button type="button" className="btn-secondary mt-4" onClick={onRetry}>Try again</button>}</div>;
}
