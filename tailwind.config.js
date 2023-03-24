/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      poppins: ["Poppins"],
      inter: ["Inter"],
    },
    colors: {
      teal: "#3FC2C4",
      smokewhite: "#fdfdfd",
      charcoalgray: "#2e2e2e",
      white: "#ffffff",
    },
  },
  plugins: [],
};
