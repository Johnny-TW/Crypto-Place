module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          customGreen: '#00FF00',
        },
        purple: {
          // Basic color
          customPurple: '#6C63FF',
        },
        blue: {
          950: '#17275c',
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      spacing: {
        128: '32rem',
      },
      fontFamily: {
        sans: [
          'Graphik', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
