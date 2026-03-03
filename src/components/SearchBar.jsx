import PropTypes from "prop-types";

export default function SearchBar({ city, onChange, onSubmit, accent }) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem" }}>🔍</span>
        <input
          type="text" value={city} onChange={e => onChange(e.target.value)}
          placeholder="Rechercher une ville..."
          style={{
            width: "100%", background: "rgba(255,255,255,0.07)", color: "white",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.875rem",
            padding: "0.85rem 1rem 0.85rem 2.8rem", outline: "none",
            fontSize: "0.95rem", boxSizing: "border-box",
          }}
        />
      </div>
      <button type="submit" style={{
        background: accent, color: "#0f172a", border: "none",
        borderRadius: "0.875rem", padding: "0.85rem 1.75rem",
        cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
      }}>
        Rechercher
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  city: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  accent: PropTypes.string.isRequired,
};