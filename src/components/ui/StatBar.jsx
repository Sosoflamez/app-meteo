import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import PropTypes from "prop-types";

export default function StatBar({ value, max, accent }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current)
      gsap.fromTo(ref.current, { width: 0 }, {
        width: `${Math.min((value / max) * 100, 100)}%`,
        duration: 1, ease: "power2.out", delay: 0.5,
      });
  }, [value]);

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 5, width: "100%", overflow: "hidden", marginTop: 6 }}>
      <div ref={ref} style={{ height: "100%", background: accent, borderRadius: 999, width: 0 }} />
    </div>
  );
}

StatBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  accent: PropTypes.string.isRequired,
};