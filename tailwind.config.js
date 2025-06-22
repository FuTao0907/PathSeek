/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'slide-in-from-top': 'slideInFromTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'zoom-in': 'zoomIn 0.2s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'checkmark': 'checkmark 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        slideInFromTop: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px) scale(0.9) rotateX(-10deg)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'translateY(-5px) scale(0.98) rotateX(-2deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1) rotateX(0deg)',
          },
        },
        zoomIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        checkmark: {
          '0%': {
            transform: 'scale(0) rotate(45deg)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.2) rotate(45deg)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}