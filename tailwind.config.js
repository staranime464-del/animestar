 /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ ADDED: components folder
  ],
  theme: {
    extend: {
      // ✅ Custom colors for dark gray + green theme
      colors: {
        'dark-gray': {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#636363',
          600: '#4A4A4A',
          700: '#3d3d3d',
          800: '#2d2d2d',
          900: '#1f1f1f',
          950: '#141414',
        },
        'anime-green': {
          50: '#f0fdf0',
          100: '#dcfcdc',
          200: '#bbf7bb',
          300: '#86ee86',
          400: '#60cc3f',
          500: '#4CAF50',
          600: '#3a8a3d',
          700: '#2f6c31',
          800: '#29572a',
          900: '#244826',
          950: '#0f270f',
        },
        'anime-red': {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fccccc',
          300: '#f9a8a8',
          400: '#f47272',
          500: '#FF5252',
          600: '#e11d1d',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        'anime-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'anime-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        'anime-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF9800',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      // ✅ Custom animations (इन्हें जोड़ें)
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-in-down': 'fade-in-down 0.3s ease-in-out',
        'card-load': 'card-load 0.5s ease-out forwards', // ✅ AnimeCard के लिए
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-soft': 'bounce-soft 2s infinite',
        'pulse-soft': 'pulse-soft 2s infinite',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'gradient-shift': 'gradient-shift 3s ease infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite alternate',
        'text-glow': 'text-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'card-load': { // ✅ AnimeCard animation
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' }
        },
        'gradient-shift': {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': { 
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'border-glow': {
          'from': { 
            'box-shadow': '0 0 5px rgba(96, 204, 63, 0.5), 0 0 10px rgba(96, 204, 63, 0.3), 0 0 15px rgba(96, 204, 63, 0.1)',
            'border-color': 'rgba(96, 204, 63, 0.5)'
          },
          'to': { 
            'box-shadow': '0 0 10px rgba(96, 204, 63, 0.8), 0 0 20px rgba(96, 204, 63, 0.5), 0 0 30px rgba(96, 204, 63, 0.2)',
            'border-color': 'rgba(96, 204, 63, 0.8)'
          }
        },
        'text-glow': {
          'from': { 
            'text-shadow': '0 0 5px rgba(96, 204, 63, 0.5), 0 0 10px rgba(96, 204, 63, 0.3)'
          },
          'to': { 
            'text-shadow': '0 0 10px rgba(96, 204, 63, 0.8), 0 0 20px rgba(96, 204, 63, 0.5), 0 0 30px rgba(96, 204, 63, 0.2)'
          }
        }
      },
      // ✅ Custom gradients
      backgroundImage: {
        'gradient-green': 'linear-gradient(to right, #60CC3F, #4CAF50)',
        'gradient-green-dark': 'linear-gradient(to right, #4CAF50, #3a8a3d)',
        'gradient-green-hover': 'linear-gradient(to right, #4CAF50, #60CC3F)',
        'gradient-gray': 'linear-gradient(to bottom right, #636363, #4A4A4A)',
        'gradient-dark': 'linear-gradient(to bottom right, #4A4A4A, #2d2d2d)',
        'gradient-radial-green': 'radial-gradient(circle at center, #60CC3F 0%, #4CAF50 50%, #3a8a3d 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(96, 204, 63, 0.1) 50%, transparent 100%)',
      },
      // ✅ Custom box shadows
      boxShadow: {
        'green-glow': '0 0 15px rgba(96, 204, 63, 0.5)',
        'green-glow-lg': '0 0 30px rgba(96, 204, 63, 0.7)',
        'green-glow-xl': '0 0 50px rgba(96, 204, 63, 0.9)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(96, 204, 63, 0.3)',
        'inner-green': 'inset 0 2px 4px 0 rgba(96, 204, 63, 0.3)',
        'neon-green': '0 0 5px #60CC3F, 0 0 10px #60CC3F, 0 0 15px #60CC3F, 0 0 20px #60CC3F',
      },
      // ✅ Custom border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      // ✅ Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      // ✅ Custom font sizes
      fontSize: {
        'xxs': '0.625rem',
        '10xl': '10rem',
        '11xl': '12rem',
      },
      // ✅ Custom transition properties
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'transform': 'transform',
        'all': 'all',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      // ✅ Custom opacity
      opacity: {
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
      },
    }
  },
  plugins: [],
}