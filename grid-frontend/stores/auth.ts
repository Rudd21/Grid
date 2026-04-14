import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any | null,
        isInitialized: false,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        userId: (state) => state.user?.sub || null
    },
    actions: {
        async fetchUser() {
            try{
                // Використовуй саме $fetch для екшенів
                const data = await $fetch('http://localhost:8000/auth/profile', {
                    method: 'GET',
                    credentials: 'include',
                })
                
                this.user = data

            }catch(e){
                this.user = null
            }finally{
                this.isInitialized = true
            }
        },

        async logout(){
            try{
                await $fetch('http://localhost:8000/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                })

                this.user = null

                navigateTo('/login')

                console.log("До зустрічі в Oasis!");
            }catch(error){
                console.error("Помилка при виході:", error);
            }
        }
    }
})