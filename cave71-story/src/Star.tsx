import React from "react";
import { Img, staticFile } from "remotion";

const starPolygon = (points: number, inner: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 50 : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
};

const OUTER = starPolygon(18, 44);
const INNER = starPolygon(18, 43.2);

/** Starburst badge (the "sale" stickers and photo blobs of the Canva design). */
export const Star: React.FC<{
  size: number;
  color: string;
  children?: React.ReactNode;
  photo?: string;
  border?: number;
}> = ({ size, color, children, photo, border = 7 }) => {
  const inset = (border / size) * 100;
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: color, clipPath: OUTER }} />
      {photo ? (
        <div
          style={{
            position: "absolute",
            inset: `${inset}%`,
            clipPath: INNER,
            overflow: "hidden",
          }}
        >
          <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
