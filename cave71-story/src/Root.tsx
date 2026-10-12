import { Composition } from "remotion";
import { Story, StoryProps } from "./Story";

export const FPS = 30;
export const DURATION = 10 * FPS;

const defaultProps: StoryProps = {
  title: "LE COIN DES BONNES AFFAIRES À REZÉ",
  dates: "DU 19 SEPTEMBRE AU 3 OCTOBRE 2026",
  tagline: "LAST CHANCE !!!",
  address: ["71 AVENUE DE LA LIBERATION", "44400 REZÉ"],
  phone: "02.49.62.66.45",
  legal: "L’ABUS D’ALCOOL EST DANGEREUX POUR LA SANTE À CONSOMMER AVEC MODERATION",
};

export const Root: React.FC = () => (
  <Composition
    id="Story"
    component={Story}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
  />
);
