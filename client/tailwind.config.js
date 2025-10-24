export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  'dark-blue': '#1a2332',
  'mid-blue': '#2563eb',
  'light-blue': '#3b82f6',
  'accent-blue': '#60a5fa',
  'hover-blue': '#1e3a5f',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'glow-strong': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-intense': '0 0 30px rgba(59, 130, 246, 0.7)',
      },
      fontFamily: {
        mono: ['monospace'],
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply font-mono uppercase tracking-[0.25em] font-bold border-2 transition-all duration-300 cursor-pointer backdrop-blur-md shadow-glow text-white': {},
        },
        '.btn:hover': {
          'text-shadow': '0 0 10px rgba(96,165,250,0.85)',
        },
        '.btn-primary': {
          '@apply bg-light-blue bg-opacity-85 border-accent-blue border-opacity-70 shadow-glow': {},
        },
        '.btn-primary:hover': {
          '@apply bg-hover-blue bg-opacity-90 border-opacity-100 shadow-glow-intense': {},
        },
        '.btn-secondary': {
          '@apply bg-transparent text-accent-blue border-accent-blue border-opacity-50': {},
        },
        '.btn-secondary:hover': {
          '@apply bg-hover-blue bg-opacity-70 border-accent-blue border-opacity-90 text-white shadow-glow-strong': {},
        },
        '.btn-ghost': {
          '@apply bg-transparent text-accent-blue border-accent-blue border-opacity-50': {},
        },
        '.btn-ghost:hover': {
          '@apply bg-hover-blue bg-opacity-60 border-opacity-90 text-white': {},
        },
        '.icon-btn': {
          '@apply inline-flex items-center gap-2 px-4 py-2 text-sm': {},
        },
        '.panel': {
          '@apply relative bg-dark-blue bg-opacity-80 backdrop-blur-xl shadow-glow p-8 border-2 border-accent-blue border-opacity-30': {},
        },
        '.panel:hover': {
          '@apply shadow-glow-strong bg-opacity-85 border-opacity-60': {},
        },
        '.heading': {
          '@apply text-white text-2xl sm:text-3xl font-mono font-bold text-center mb-4 uppercase tracking-[0.3em]': {},
          'letter-spacing': '0.3em',
        },
        '.heading-rule': {
          '@apply h-px w-32 mx-auto bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-60 mb-6': {},
        },
        '.input': {
          '@apply w-full bg-dark-blue bg-opacity-70 backdrop-blur-md border-2 border-light-blue border-opacity-50 text-white px-5 py-4 font-mono text-base placeholder:text-accent-blue placeholder:opacity-40 focus:border-accent-blue focus:border-opacity-90 focus:bg-opacity-90 focus:outline-none transition-all duration-300': {},
        },
        '.label': {
          '@apply block text-sm text-accent-blue opacity-90 tracking-[0.2em] uppercase font-bold mb-3': {},
        },
        '.link-underline': {
          '@apply text-accent-blue border-b-2 border-accent-blue border-opacity-40 hover:text-white hover:border-opacity-80 transition-all duration-300': {},
        },
      })
    }
  ],
  darkMode: 'class',
}