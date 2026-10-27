// Portfolio color themes, cycled in this order. Every visit starts on the first one (pink);
// the choice is intentionally not persisted.
export const THEMES = ["pink", "blue", "purple"] as const;
export type PortfolioTheme = (typeof THEMES)[number];

export const THEME_COLORS: Record<PortfolioTheme, string> = {
  pink: "#F9A8D4",
  blue: "#93B8FF",
  purple: "#C4A7FF",
};
