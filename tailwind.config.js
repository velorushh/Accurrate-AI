/** @type {import('tailwindcss').Config} */
export default {
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
        apolloDark: '#1f4a4c',
        apolloRed: '#e67e6c',
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
