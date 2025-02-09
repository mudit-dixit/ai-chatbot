const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    content: [
      "./modules/**/*.tsx",
      "./ui/**/*.tsx",
      "./index.html",
      "./src/**/*.tsx/*.jsx",
      "./pages/**/*.tsx",
      "./pages/*.tsx",
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', '...defaultTheme.fontFamily.sans'],
      },
    },
  },}