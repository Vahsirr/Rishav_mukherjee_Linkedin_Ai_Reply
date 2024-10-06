/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{js,jsx,ts,tsx}','./entrypoints/popup.{js,jsx,ts,tsx}','./entrypoints.{js,jsx,ts,tsx}'],// Configure Tailwind Css to give access to the following folder
  theme: {
    extend: {},
  },
  plugins: [],
}

