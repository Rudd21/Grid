import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./provider/**/*.vue",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
        colors: {
            myWhite: '#FFF8F8',
            myBeige: '#E9DFC3',
            mySea: '#1B56FD',
            myBlue: '#0118D8'
        }
    },
    fontFamily:{
      boldonse: ['Boldonse', 'sans-serif'],
      saira: ['Saira', 'sans-serif']
    },
    boxShadow:{
      regular: ['8px 6px 0px 5px #000000']
    }
  },
}