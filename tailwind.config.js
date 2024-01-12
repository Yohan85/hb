/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: {
          900: "#4E02A5",
        },
        purple: {
          300: "#D6C1EE",
        },
        red: {
          400: "#DC6A6A",
          900: "#740E0E",
        },
        slate: {
          500: "#43927D",
        },
      },
      fontFamily: {
        motek: ["Motek", "sans-serif"],
      },
    },
  },
  plugins: [],
};
