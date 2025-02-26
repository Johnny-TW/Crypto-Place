module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        gray: {
          customGray: '#ECEDF8',
        },
        green: {
          customGreen: '#00FF00',
          lightGreen: '#ccffcc',
          darkGreen: '#006400',
        },
        purple: {
          // Basic color
          customPurple: '#6C63FF',
          lightPurple: '#e0b3ff',
          darkPurple: '#4b0082',
        },
        blue: {
          lightBlue: '#add8e6',
          darkBlue: '#00008b',
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
        red: {
          lightRed: '#ffcccb',
          customRed: '#ff0000',
          darkRed: '#8b0000',
        },
        yellow: {
          lightYellow: '#ffffe0',
          customYellow: '#ffff00',
          darkYellow: '#ffd700',
        },
      },
      spacing: {
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      fontFamily: {
        sans: [
          'Graphik', 'sans-serif',
        ],
        serif: [
          'Merriweather', 'serif',
        ],
      },
    },
  },
  plugins: [],
};
