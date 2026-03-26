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
            testColor: 'red'
        }
    },
  },
}