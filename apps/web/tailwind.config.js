/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        accent: '#e74c3c',
        light: '#ecf0f1',
        dark: '#2c3e50',
        success: '#2ecc71',
        warning: '#f39c12',
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'custom': '8px',
      },
    },
  },
  plugins: [],
}