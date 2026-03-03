import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import PropTypes from "prop-types";

export default function WeatherIconAnim({ icon }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.killTweensOf(ref.current);
    gsap.fromTo(ref.current,
      { scale: 0, rotate: -15, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
    gsap.to(ref.current, { y: -16, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
    gsap.to(ref.current, { rotate: 6, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
  }, [icon]);

  return (
    <div ref={ref} style={{
      fontSize: "7rem", display: "inline-block",
      filter: "drop-shadow(0 0 40px rgba(255,255,255,0.15))",
    }}>
      {icon}
    </div>
  );
}

WeatherIconAnim.propTypes = {
  icon: PropTypes.string.isRequired,
};