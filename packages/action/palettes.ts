import { DrawOptions as DrawOptions } from "@snk/svg-creator";

export const basePalettes: Record<
  string,
  Pick<
    DrawOptions,
    "colorDotBorder" | "colorEmpty" | "colorSnake" | "colorDots" | "dark"
  >
> = {
  "github-light": {
    colorDotBorder: "#1b1f230a",
    colorDots: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    colorEmpty: "#ebedf0",
    colorSnake: "purple",
  },
  "github-dark": {
    colorDotBorder: "#1b1f230a",
    colorEmpty: "#161b22",
    colorDots: ["#161b22", "#01311f", "#034525", "#0f6d31", "#00c647"],
    colorSnake: "purple",
  },
  "pacman-light": {
    colorDotBorder: "#1b1f230a",
    colorDots: ["#ebedf0", "#fee975", "#fedc56", "#ffcc00", "#ffaa00"],
    colorEmpty: "#ebedf0",
    colorSnake: "#FFCC00",
  },
  "pacman-dark": {
    colorDotBorder: "#1b1f230a",
    colorEmpty: "#161b22", 
    colorDots: ["#161b22", "#3a3000", "#5e4c00", "#806600", "#ffcc00"],
    colorSnake: "#FFCC00",
  },
};

// aliases
export const palettes = { ...basePalettes };
palettes["github"] = palettes["github-light"];
palettes["default"] = palettes["github"];
palettes["pacman"] = palettes["pacman-light"];
