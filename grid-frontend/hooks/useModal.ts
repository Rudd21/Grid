import type { ModalContext } from "~/provider/ModalProvider.vue"

export function useModal(){
    const modal = inject<ModalContext>('modal')

    if(!modal){
        throw new Error("Провайдер модалочки не знайдений")
    }

    return modal
}