import { lighten, darken } from "../styling/utils";

function getImage(name: string) {
  return new URL(`./${name}`, import.meta.url).href;
}

const themes = {
  one: {
    accent: "#f64270",
    background: "#2f3b52",
    wallpaper: {
      mobile: getImage("one-mobile.jpg"),
      desktop: getImage("one-desktop.jpg"),
    },
    paper: { opacity: 0.6 },
    switch: {
      track: darken("#2f3b52", 0.2),
      checked: "#f64270",
      unchecked: lighten("#2f3b52", 0.2),
    },
  },
  two: {
    accent: "#9c88ff",
    background: "#131626",
    wallpaper: {
      mobile: getImage("two-mobile.jpg"),
      desktop: `${getImage("two-desktop.jpg")}`,
    },
    paper: { opacity: 0.5 },
    switch: {
      track: darken("#2f3b52", 0.8),
      checked: "#9c88ff",
      unchecked: lighten("#2f3b52", 0.6),
    },
  },
  three: {
    accent: "#00cec9",
    background: "#2f3b52",
    wallpaper: {
      mobile: getImage("three-mobile.jpg"),
      desktop: `${getImage("three-desktop.jpg")}`,
    },
    paper: { opacity: 0.5 },
    switch: {
      track: darken("#2f3b52", 0.8),
      checked: "#00cec9",
      unchecked: "#85a299",
    },
  },
};

export default themes;
