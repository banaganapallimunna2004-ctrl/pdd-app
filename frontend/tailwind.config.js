export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 32px 120px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        gradientRadial: 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
