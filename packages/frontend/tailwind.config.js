const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-y': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-50%)' },
        },
        'slide-y-invert': {
          '0%, 100%': { transform: 'translateY(-50%) ' },
          '50%': { transform: 'translateY(0px) ' },
        }
      },
      animation: {
        'slide-y': 'slide-y 140s linear infinite',
        'slide-y-invert': 'slide-y-invert 140s linear infinite',
      },
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
      },
      transitionDuration: {
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
