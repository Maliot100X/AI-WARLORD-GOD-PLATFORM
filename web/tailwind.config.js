/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // WARLORD COLORS
        warlord: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          pink: '#EC4899',
          amber: '#F59E0B',
          green: '#10B981',
          red: '#EF4444',
          blue: '#3B82F6',
          dark: '#0F0F1A',
          darker: '#080810',
        },
        // TRADING COLORS
        trading: {
          profit: '#10B981',
          loss: '#EF4444',
          neutral: '#6B7280',
          signal: '#8B5CF6',
          volume: '#3B82F6',
        },
        // API FACTORY COLORS
        api: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'warlord-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)',
        'trading-gradient': 'linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #F59E0B 100%)',
        'api-gradient': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
        'github-gradient': 'linear-gradient(135deg, #24292E 0%, #444D56 50%, #6A737D 100%)',
        'vps-gradient': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
