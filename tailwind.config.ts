import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'path-draw': {
          'to': { strokeDashoffset: '0' },
        },
        'toast-success-icon': {
          '0%': { transform: 'scale(0.5) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.1) rotate(10deg)', opacity: '1' },
          '80%': { transform: 'scale(0.9) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' }
        },
        'toast-destructive-icon': {
            '0%': { transform: 'translateX(0) scale(0.5)', opacity: '0' },
            '30%': { transform: 'translateX(0) scale(1.1)', opacity: '1' },
            '40%': { transform: 'translateX(-5px) scale(1.1)' },
            '50%': { transform: 'translateX(5px) scale(1.1)' },
            '60%': { transform: 'translateX(-5px) scale(1.1)' },
            '70%': { transform: 'translateX(5px) scale(1.1)' },
            '80%': { transform: 'translateX(0) scale(1.1)' },
            '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'path-draw': 'path-draw 3s ease-out 0.8s forwards',
        'toast-success-icon': 'toast-success-icon 0.6s ease-out forwards',
        'toast-destructive-icon': 'toast-destructive-icon 0.8s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
