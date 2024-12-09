import { createVNode, render } from 'vue'
import DialogModal from '@/views/DayOfDesign01PostSubmit/components/ConfirmDialog.vue'
import { type ConfirmIconType } from '@/types/activity/dayofdesign01'

export const showConfirmDialog = (
  text: string,
  iconName?: ConfirmIconType,
): Promise<void> => {
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
      iconName,
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
