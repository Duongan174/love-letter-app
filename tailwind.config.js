/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Khai báo 12 phông chữ
        'dancing': ['var(--font-dancing)'], 
        'lexend': ['var(--font-lexend)'],
        'arizonia': ['var(--font-arizonia)'], 
        'pacifico': ['var(--font-pacifico)'],
        'lobster': ['var(--font-lobster)'],
        'vibes': ['var(--font-vibes)'],
        'charm': ['var(--font-charm)'],
        'kaushan': ['var(--font-kaushan)'],
        'pinyon': ['var(--font-pinyon)'],
      },
    },
  },
  // Nếu bạn đã cài đặt @tailwindcss/typography trước đó, hãy bật lại dòng này:
  // plugins: [
  //   require('@tailwindcss/typography'),
  // ],
}