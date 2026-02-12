import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Scans your app router files
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // Scans pages router (if any)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scans components
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",     
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;