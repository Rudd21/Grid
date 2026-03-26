import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const modalData = ref<any>(null) // Для передачі даних у модалку (наприклад, ID юзера)

  function open(data: any = null) {
    isOpen.value = true
    modalData.value = data
  }

  function close() {
    isOpen.value = false
    modalData.value = null
  }

  return { isOpen, modalData, open, close }
})