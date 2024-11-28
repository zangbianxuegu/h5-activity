import { createVNode, render } from 'vue'
import Share from '@/components/Share'
import type {
  NGSHARE_SHARE_CHANNEL,
  NgshareShareImageConfig,
  NgshareShareLinkConfig,
} from './types'

export interface ShareFormatConfig {
  targetElByHover?: string | HTMLElement
}

export const showShare = (
  shareFormatConfig: ShareFormatConfig,
  shareChannel: NGSHARE_SHARE_CHANNEL[] | [] = [],
  shareLinkConfig: NgshareShareLinkConfig,
  shareImageConfig: NgshareShareImageConfig,
): void => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const vnode = createVNode(Share, {
    shareFormatConfig,
    shareChannel,
    shareLinkConfig,
    shareImageConfig,
    closed() {
      vnode.appContext?.app.unmount()
      div.remove()
    },
  })
  render(vnode, div)
}
