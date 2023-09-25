import { lighten, darken } from "../styling/utils";

function getImage(name: string) {
  return new URL(`./${name}`, import.meta.url).href;
}

const theme = {
  accent: "#f64270",
  background: "#2f3b52",
  wallpaper: {
    mobile: getImage("background-mobile.jpg"),
    desktop: getImage("background-desktop.jpg"),
  },
  paper: { opacity: 0.6 },
  switch: {
    track: darken("#2f3b52", 0.2),
    checked: "#f64270",
    unchecked: lighten("#2f3b52", 0.2),
  },
};

export default theme;
