import type { Notification } from "~/types/notification";

const notificationState = ref(false);
const notifications = ref<Notification[] | null>(null);

let pollingInterval: ReturnType<typeof setInterval> | null = null

export function useNotification(){
    const auth = useAuthStore()

    function openNotification(){
        notificationState.value = true
    }

    function closeNotification(){
        notificationState.value = false
    }

    async function reqNotification() {
        if(!auth.userId) return;

        try{
            notifications.value = await $fetch(`http://localhost:8000/notification/${auth.userId}`,{
                method: 'GET',
                credentials: 'include'
            })
        }catch(error){
            console.error("Виникла помилка запиту сповіщень: ", error)
        }
    }

    async function makeAsRead(notifId: string) {
        try{
            await $fetch(`http://localhost:8000/notification/${notifId}`,{
                method: 'PATCH',
                credentials: 'include'
            })
        }catch(error){
            console.error("Виникла помилка при позначенні повідомлення як прочитаного: ", error)
        }
    }

    async function deleteNotification(notifId: string) {
        try{
            await $fetch(`http://localhost:8000/notification/${notifId}`,{
                method: 'DELETE',
                credentials: 'include'
            })
            
            if(notifications.value){
                notifications.value = notifications.value.filter(n => n.id !== notifId);
            }

        }catch(error){
            console.error('Виникла помилка при видалені сповіщення: ', error)
        }
    }

    function startPolling(){
        if(pollingInterval) return;

        reqNotification()
        pollingInterval = setInterval(reqNotification, 1000 * 30);
    }

    function stopPolling(){
        if(pollingInterval){
            clearInterval(pollingInterval)
            pollingInterval = null
        }
    }


    return { notificationState, notifications, openNotification, closeNotification, reqNotification, makeAsRead, deleteNotification, startPolling, stopPolling }
}