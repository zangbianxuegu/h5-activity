import { createVNode, render } from 'vue'
import DialogModal from '@/views/DayOfDesign01PostSubmit/components/ConfirmDialog.vue'

export const showConfirmDialog = (text: string): Promise<void> => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  let vnode: VNode
  function closeModal(): void {
    vnode.appContext?.app.unmount()
    div.remove()
  }
  return new Promise((resolve, reject) => {
    vnode = createVNode(DialogModal, {
      text,
      modalType: 'alert',
      onConfirm() {
        closeModal()
        resolve()
      },
      onClose() {
        closeModal()
        reject(new Error())
      },
    })
    render(vnode, div)
  })
}
