// src/components/HomeIndicator.tsx
import bar from "../assets/ui/Home Indicator.svg";

/* padding: L116 R115 T19 B8 / frame: 375×32 */
const HomeIndicator = () => (
  <div
    style={{
      position: "fixed",
      left: "50%",
      bottom: 0,
      transform: "translateX(-50%)",
      width: 375,
      height: 32,
      paddingLeft: 116,
      paddingRight: 115,
      paddingTop: 19,
      paddingBottom: 8,
      boxSizing: "border-box",
      pointerEvents: "none",
      zIndex: 9,
    }}
  >
    <img
      src={bar}
      alt=""
      style={{ width: "100%", height: 5, display: "block" }}
    />
  </div>
);
export default HomeIndicator;
