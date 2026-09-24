import type { Config } from 'tailwindcss'

export default <Config>{
  content: [],
  theme: {
    extend: {
      colors: {
        cream: '#f5e7df',
        dark: '#1f1d1d',
        accent: {
          orange: '#ff6b4a',
          gold: '#f6c177',
          purple: '#9b7cff',
        },
      },
      fontFamily: {
        display: ['CabinetGrotesk', 'Alexandria', 'Arial', 'Helvetica', 'sans-serif'],
        body: ['Satoshi', 'IBMPlexSansArabic', 'Arial', 'Helvetica', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.025em',
      },
      borderRadius: {
        block: '40px',
        card: '15px',
      },
    },
  },
  plugins: [],
}
