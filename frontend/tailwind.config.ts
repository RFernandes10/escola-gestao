import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme (default)
        'bg-marketing': '#08090a',
        'bg-panel': '#0f1011',
        'bg-surface': '#191a1b',
        'bg-elevated': '#28282c',
        
        'text-primary': '#f7f8f8',
        'text-secondary': '#d0d6e0',
        'text-tertiary': '#8a8f98',
        'text-muted': '#62666d',
        
        'brand': '#5e6ad2',
        'accent': '#7170ff',
        'accent-hover': '#828fff',
        
        'success': '#27a644',
        'success-light': '#10b981',
        
        'border-subtle': 'rgba(255,255,255,0.05)',
        'border-standard': 'rgba(255,255,255,0.08)',
        'border-default': '#23252a',

        // Light theme
        'light-bg': '#f7f8f8',
        'light-surface': '#ffffff',
        'light-elevated': '#f5f6f7',
        
        'light-text-primary': '#1a1a1a',
        'light-text-secondary': '#52525b',
        'light-text-tertiary': '#71717a',
        'light-text-muted': '#a1a1aa',
        
        'light-border': '#e4e4e7',
      },
      fontFamily: {
        'sans': ['Inter Variable', 'SF Pro Display', '-apple-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': 'rgba(0,0,0,0.03) 0px 1.2px 0px',
        'ring': 'rgba(0,0,0,0.2) 0px 0px 0px 1px',
        'dialog': '0 8px 2px rgba(0,0,0,0), 0 5px 2px rgba(0,0,0,0.01), 0 3px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.07)',
        'focus': 'rgba(0,0,0,0.1) 0px 4px 12px',
      },
    },
  },
  plugins: [],
};

export default config;