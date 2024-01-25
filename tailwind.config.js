/** 
 * Configuración de Tailwind CSS
 * 
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  // Modo "just-in-time" para mejorar el rendimiento
  mode: 'jit',
  // Rutas de contenido para las cuales se generará el CSS
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Personalizaciones del tema
  theme: {
    extend: {
      // Añadir nuevas propiedades al tema, como gradientes y colores personalizados
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'cdt-orange': '#F49C18',
        'cdt-blue': '#3D6DB1',
        'cdt-textBlue': 'rgba(11, 11, 119, 0.73)',
        'cdt-bgBlue': '#001933',
        'cdt-links': '#818181'
      },
      boxShadow: {
        'cdt-shadow': 'inset 1px 2px 2px rgba(206, 145, 54, 0.36)',
      },
      focusVisible: {
        'focusVisible': 'rgba(244, 156, 24, 0.26)',
      },
    },
  },
  // Deshabilitar preflight para tener un control total sobre los estilos
  corePlugins: {
    preflight: false,
  },
  // Plugins adicionales, como soporte para formularios de Tailwind CSS
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
