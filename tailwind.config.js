/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { 
          DEFAULT: 'hsl(var(--primary))', 
          foreground: 'hsl(var(--primary-foreground))' 
        },
        secondary: { 
          DEFAULT: 'hsl(var(--secondary))', 
          foreground: 'hsl(var(--secondary-foreground))' 
        },
        muted: { 
          DEFAULT: 'hsl(var(--muted))', 
          foreground: 'hsl(var(--muted-foreground))' 
        },
        accent: { 
          DEFAULT: 'hsl(var(--accent))', 
          foreground: 'hsl(var(--accent-foreground))' 
        },
        card: { 
          DEFAULT: 'hsl(var(--card))', 
          foreground: 'hsl(var(--card-foreground))' 
        },
        border: 'hsl(var(--border))',
        // Gemini & Light Master Colors
        gemini: {
          bg: '#131314',
          card: '#28282B',
          cardHover: '#333336',
          border: '#3c4043',
          sidebar: '#1e1f20',
          text: '#e3e3e3',
          muted: '#9aa0a6',
        },
        light: {
          bg: '#F4F4F4',
          card: '#FFFFFF',
          cardHover: '#FAFAFA',
          border: '#E5E5E5',
          text: '#202124',
          muted: '#5f6368',
        },
        // Brand Yellow Accent
        accentYellow: {
          DEFAULT: '#ebf212',
          hover: '#dce30e',
          light: '#fbfd82',
        },
        sand: {
          10: '#f7f5f2',
          30: '#efefeb',
          40: '#edebe8',
          60: '#736f6c',
          70: '#47423d',
          80: '#252521',
        },
        lime: '#ebf212',
        navy: '#3EC5E8',
        mauve: '#2AAECE',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '12px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        sans:  ['ABC Diatype', 'system-ui', 'sans-serif'],
        serif: ['ABC Diatype', 'system-ui', 'sans-serif'],
        body:  ['ABC Diatype', 'system-ui', 'sans-serif'],
        inter: ['ABC Diatype', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'all': 'all',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
