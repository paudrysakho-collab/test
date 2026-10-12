import React from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { Star } from "./Star";
const loadLocalFont = (family: string, file: string, weight: string): string => {
  const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight });
  const handle = delayRender(`font ${family}`);
  face
    .load()
    .then(() => {
      document.fonts.add(face);
      continueRender(handle);
    })
    .catch((err) => cancelRender(err));
  return family;
};

const montserrat = loadLocalFont("Montserrat", "montserrat.woff2", "800");
const kaushan = loadLocalFont("Kaushan Script", "kaushan.woff2", "400");
const serif = loadLocalFont("Cardo", "cardo.woff2", "700");

export type StoryProps = {
  title: string;
  dates: string;
  tagline: string;
  address: string[];
  phone: string;
  legal: string;
};

const BADGES = [
  { pct: "50%", color: "#f58fa0", x: 135 },
  { pct: "40%", color: "#e8301f", x: 335 },
  { pct: "30%", color: "#2196e0", x: 535 },
  { pct: "20%", color: "#ffe600", x: 760 },
  { pct: "10%", color: "#3ddc1f", x: 975 },
];

const PHOTOS = [
  { src: "champagne.jpg", color: "#f58fa0", x: 150, y: 1255, size: 400 },
  { src: "terrines.jpg", color: "#2196e0", x: 560, y: 1255, size: 400 },
  { src: "chocolats.jpg", color: "#7a1f2e", x: 960, y: 1255, size: 420 },
  { src: "spiritueux.jpg", color: "#ffe600", x: 150, y: 1675, size: 400 },
  { src: "sacs.jpg", color: "#3ddc1f", x: 560, y: 1675, size: 400 },
  { src: "vins.jpg", color: "#e8301f", x: 960, y: 1675, size: 400 },
];

/** Pop-in with a spring, starting at `delay` frames. */
const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 140 } });
};

export const Story: React.FC<StoryProps> = ({ title, dates, tagline, address, phone, legal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = usePop(0, 14);
  const t1 = usePop(10);
  const t2 = usePop(20);

  const facadeScale = interpolate(frame, [0, 10 * fps], [1.0, 1.12], { extrapolateRight: "clamp" });
  const facadeOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lc = usePop(45, 8);
  const shake = frame > 60 && frame < 120 ? Math.sin(frame * 1.6) * 1.5 : 0;
  const pulse = 1 + 0.03 * Math.sin(frame / 5);

  const card = usePop(90);

  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {/* Canvas designed at 1125x2000 (Canva story), scaled to 1080x1920 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1125,
          height: 2000,
          transform: "scale(0.96)",
          transformOrigin: "0 0",
        }}
      >
        {/* Black header */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1125, height: 400, background: "#000" }} />
        <Img
          src={staticFile("logo.png")}
          style={{
            position: "absolute",
            left: 262,
            top: 0,
            width: 600,
            transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
            opacity: logoIn,
          }}
        />
        {[
          { text: title, top: 205, p: t1 },
          { text: dates, top: 305, p: t2 },
        ].map(({ text, top, p }) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 0,
              width: 1125,
              top,
              textAlign: "center",
              color: "#fff",
              fontFamily: montserrat,
              fontWeight: 800,
              fontSize: top === 205 ? 54 : 52,
              letterSpacing: -2,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
            }}
          >
            {text}
          </div>
        ))}

        {/* Storefront */}
        <div style={{ position: "absolute", left: 10, top: 400, width: 1105, height: 600, overflow: "hidden", opacity: facadeOpacity }}>
          <Img
            src={staticFile("facade.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${facadeScale})` }}
          />
        </div>

        {/* LAST CHANCE */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1125,
            top: 585,
            textAlign: "center",
            fontFamily: kaushan,
            fontSize: 125,
            color: "#e8301f",
            whiteSpace: "nowrap",
            WebkitTextStroke: "2px #8a1208",
            textShadow: "0 6px 18px rgba(0,0,0,0.55)",
            opacity: lc,
            transform: `rotate(${-4 + shake}deg) scale(${interpolate(lc, [0, 1], [2.4, 1]) * pulse})`,
          }}
        >
          {tagline}
        </div>

        {/* Address card */}
        <div
          style={{
            position: "absolute",
            left: 575,
            top: 705,
            width: 525,
            height: 150,
            borderRadius: 18,
            background: "#fff",
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 25,
            padding: "22px 0 0 78px",
            boxSizing: "border-box",
            lineHeight: 1.25,
            opacity: card,
            transform: `translateX(${interpolate(card, [0, 1], [200, 0])}px)`,
          }}
        >
          {address.map((l) => (
            <div key={l}>{l}</div>
          ))}
          <div style={{ marginTop: 24 }}>{phone}</div>
          <svg style={{ position: "absolute", left: 18, top: 22 }} width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <svg style={{ position: "absolute", left: 18, top: 88 }} width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 7.5l2 3-1.2 1.2a8 8 0 004 4l1.2-1.2 3 2-1.5 2c-4 .4-10-5.5-9.5-9.5z" />
          </svg>
        </div>

        {/* Discount badges */}
        {BADGES.map((b, i) => {
          const p = usePop(100 + i * 8, 9);
          return (
            <div
              key={b.pct}
              style={{
                position: "absolute",
                left: b.x - 85,
                top: 870,
                transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-60, 0])}deg)`,
              }}
            >
              <Star size={170} color={b.color} border={0}>
                <div style={{ color: "#fff", fontFamily: montserrat, fontWeight: 800, fontSize: 62, lineHeight: 1 }}>{b.pct}</div>
                <div style={{ color: "#fff", fontFamily: montserrat, fontSize: 24, marginTop: 4 }}>SALE</div>
              </Star>
            </div>
          );
        })}

        {/* Photo starbursts */}
        {PHOTOS.map((ph, i) => {
          const p = usePop(150 + i * 14, 11);
          const drift = interpolate(frame, [150, 300], [0, i % 2 ? -8 : 8], { extrapolateLeft: "clamp" });
          return (
            <div
              key={ph.src}
              style={{
                position: "absolute",
                left: ph.x - ph.size / 2,
                top: ph.y - ph.size / 2,
                transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [25, 0]) + drift}deg)`,
                opacity: p,
              }}
            >
              <Star size={ph.size} color={ph.color} photo={ph.src} border={9} />
            </div>
          );
        })}

        {/* Legal mention — always visible */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1125,
            top: 1950,
            textAlign: "center",
            fontFamily: montserrat,
            fontWeight: 800,
            fontSize: 19,
            color: "#111",
          }}
        >
          {legal}
        </div>
      </div>
    </AbsoluteFill>
  );
};
