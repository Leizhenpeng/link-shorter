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

            "primary": "#18b6f6",

            "secondary": "#ac7ff4",

            "accent": "#e66dff",

            "neutral": "#14161F",

            "base-100": "#EDEDED",

            "info": "#4A7BCF",

            "success": "#1BE4D0",

            "warning": "#C99F08",

            "error": "#F0385A",
          },
      },    ],
  },
  plugins: [require("daisyui")],
};
