/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FCF9F3',
          dim: '#DCDAD4',
          bright: '#FCF9F3',
          lowest: '#FFFFFF',
          low: '#F6F3ED',
          container: '#F0EEE7',
          high: '#EAE8E2',
          highest: '#E5E2DC',
        },
        primary: {
          DEFAULT: '#4A6B8A',
          dark: '#354D63',
          light: '#E9EFF5',
          container: '#4A6B8A',
          deep: '#315371',
          fixed: '#CEE5FF',
        },
        secondary: {
          DEFAULT: '#E6A017',
          hover: '#C58913',
          amber: '#FCB32E',
          dark: '#805600',
          light: '#FFDDAF',
        },
        ink: {
          DEFAULT: '#1C1C18',
          base: '#2E2E2A',
          muted: '#5C5C56',
          variant: '#42474D',
        },
        borderline: {
          DEFAULT: '#D1C7B7',
          variant: '#E5DECE',
          subtle: '#C2C7CE',
        },
        status: {
          success: '#2D7A4D',
          'success-bg': '#EAF4EE',
          'success-border': '#A3D9B5',
          warning: '#D97706',
          'warning-bg': '#FDF6E9',
          'warning-border': '#F5D28A',
          error: '#C93D33',
          'error-bg': '#FCECEB',
          'error-border': '#F5B5B0',
          info: '#2B6CB0',
          'info-bg': '#E9EFF5',
          'info-border': '#A8CAED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        mono: ['monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(46, 46, 42, 0.05)',
        dropdown: '0 4px 12px -2px rgba(46, 46, 42, 0.08)',
        modal: '0 12px 32px -4px rgba(46, 46, 42, 0.16)',
      },
    },
  },
  plugins: [],
}
