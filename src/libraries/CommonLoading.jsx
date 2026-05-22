// src/components/common/CommonLoading.jsx
import React from "react";
import { FiLoader } from "react-icons/fi";

/* ------------------------------------------------------------
   helpers
------------------------------------------------------------ */
const cx = (...cls) => cls.filter(Boolean).join(" ");

/* fullscreen wrapper */
const FullscreenWrap = ({ children, className = "" }) => (
  <div
    className={cx(
      "fixed inset-0 flex items-center justify-center bg-white/80 z-[9999]",
      className
    )}
  >
    {children}
  </div>
);

/* keyframes */
const Keyframes = () => (
  <style>{`
    @keyframes dot-bounce {
      0%, 80%, 100% { transform: scale(0); opacity: .3; }
      40% { transform: scale(1); opacity: 1; }
    }
    @keyframes folding-cube {
      0%, 10% { transform: perspective(140px) rotateX(-180deg); opacity: 0 }
      25%, 75% { transform: perspective(140px) rotateX(0deg); opacity: 1 }
      90%, 100% { transform: perspective(140px) rotateY(180deg); opacity: 0 }
    }
    @keyframes img-pulse {
      0%, 100% { transform: translateZ(0) scale(1); opacity: .95; }
      50% { transform: translateZ(0) scale(1.03); opacity: 1; }
    }
  `}</style>
);

/* tiny util to merge class color vs css color */
const getColorStyle = (color, isBorder = false) => {
  if (!color) return {};
  if (isBorder) {
    // for circle spinner: set border color and transparent top
    return { borderColor: color, borderTopColor: "transparent" };
  }
  return { color };
};
const getBgStyle = (color) => (color ? { backgroundColor: color } : {});


/* ============================================================
   2) Icon Spinner (FiLoader)
============================================================ */
export const SpinnerLoading = ({
  message = "Loading...",
  fullscreen = false,
  size = 32,            // px
  color,                // CSS color
  colorClass = "text-primary-1",
  angle = 0,
  duration = 0.9,
  className = "",
}) => {
  const content = (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <FiLoader
        className={cx(color ? "" : colorClass)}
        style={{
          width: size,
          height: size,
          ...getColorStyle(color),
          transform: `rotate(${angle}deg)`,
          animation: `spinIcon ${duration}s linear infinite`,
        }}
      />
      {message ? (
        <p className="text-sm text-gray-500 tracking-tight">{message}</p>
      ) : null}
      <style>{`
        @keyframes spinIcon { to { transform: rotate(${360 + angle}deg); } }
      `}</style>
    </div>
  );

  if (fullscreen) return <FullscreenWrap>{content}</FullscreenWrap>;
  return content;
};












