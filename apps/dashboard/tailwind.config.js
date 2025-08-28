import baseConfig from "@repo/tailwind-config";

/** @type {import('tailwindcss').Config} */
const config = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Dashboard-specific theme extensions can go here
    },
  },
};

export default config;
