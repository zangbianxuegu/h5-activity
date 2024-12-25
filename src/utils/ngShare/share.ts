import { createVNode, render } from 'vue'
import Share from '@/components/Share'
import type {
  NgshareChannel,
  NgshareShareImageConfig,
  NgshareShareLinkConfig,
} from './types'

export interface ShareFormatConfig {
  targetElByHover?: string | HTMLElement
}

/**
 * @title showShare 分享事件
 * @param shareFormatConfig 分享格式配置
 * @param shareChannel 分享渠道
 * @param shareLinkConfig 分享链接配置
 * @param shareImageConfig 分享图片配置
 * @param beforeClickShareChannel 在点击分享渠道前触发
 */
export const showShare = (
  shareFormatConfig: ShareFormatConfig,
  shareChannel: NgshareChannel[] | [] = [],
  shareLinkConfig: NgshareShareLinkConfig,
  shareImageConfig: NgshareShareImageConfig,
  beforeClickShareChannel?: () => void,
): void => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const vnode = createVNode(Share, {
    shareFormatConfig,
    shareChannel,
    shareLinkConfig,
    shareImageConfig,
    beforeClickShareChannel,
    closed() {
      vnode.appContext?.app.unmount()
      div.remove()
    },
  })
  render(vnode, div)
}
