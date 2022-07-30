const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      groups: ['example', 'example2'],
      colors: {
        'success': '#36D399',
        'error': '#F87272',
        'warning': '#FBBD23',
        'info': '#39BFF8',
        'base-100': '#283e71',
        'base-200': '#233662',
        'base-300': '#1e2d53',
        'base-400': '#182544',
        'base-500': '#131d35',
        'base-600': '#0f172a',
        'base-700': '#0d1526',
        'base-800': '#080c17',
        'base-900': '#030408',
      },
      transitionDelay: {
        '0': '0ms',
      }
    },
  },
  plugins: [
    plugin(({ addVariant, theme }) => {
      const groups = theme('groups') || {};

      Object.values(groups).forEach((group) => {
        addVariant(`group-${group}-hover`, () => {
          return `:merge(.group-${group}):hover &`
        })
      })
    }),
    require('tailwind-scrollbar-hide')
  ]
}
