/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
          mytheme: {
            "primary": "#ac7ff4",
            "secondary": "#18b6f6",
            "accent": "#e66dff",
            "neutral": "#14161F",
            "base-100": "#EDEDED",
            "info": "#3B80C9",
            "success": "#ac7ff4",
            "warning": "#FAB905",
            "error": "#F52314",
          },
      },    ],
  },
  plugins: [require("daisyui")],
};
