import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import PropTypes from "prop-types";

export default function AnimatedTemp({ value, accent }) {
  const ref = useRef(null);
  const prev = useRef(0);

  useEffect(() => {
    const obj = { val: prev.current };
    gsap.to(obj, {
      val: value,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + "°";
      },
    });
    prev.current = value;
  }, [value]);

  return (
    <span
      ref={ref}
      style={{
        fontSize: "6.5rem",
        fontWeight: 200,
        color: "white",
        lineHeight: 1,
        textShadow: `0 0 60px ${accent}55`,
      }}
    >
      {value}°
    </span>
  );
}

AnimatedTemp.propTypes = {
  value: PropTypes.number.isRequired,
  accent: PropTypes.string.isRequired,
};
