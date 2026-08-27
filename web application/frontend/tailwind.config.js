export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#2D5A27',
          secondary: '#5D8A56',
          tertiary: '#8DA781',
          background: '#FBFDF9',
          surface: '#FFFFFF',
          onSurface: '#1A1C19',
          dark: {
            primary: '#90D680',
            secondary: '#B9CCB0',
            tertiary: '#DCE6D5',
            background: '#10140F',
            surface: '#1A1F18',
          },
          error: '#BA1A1A',
          success: '#2E7D32',
          warning: '#F9A825',
          neon: '#90D680',
        },
        agri: {
          light: '#e8f5e9',
          primary: '#2e7d32', // Deep professional green
          dark: '#1b5e20',
          accent: '#ff8f00', // Earthy orange/amber for alerts
          surface: '#fcfcfc',
        }
      },
      boxShadow: {
        glass: '0 32px 120px rgba(15, 23, 42, 0.18)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        gradientRadial: 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
