/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
        inter: ["Inter"],
      },
      colors: {
        teal: "#3FC2C4",
        smokewhite: "#fdfdfd",
        charcoalgray: "#2e2e2e",
      },
      boxShadow: {
        "3xl": "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;",
      },
    },
  },
  plugins: [],
};
