import { showToast } from 'vant'
import { setAudioState } from '@/apis/base'

export function useMusicPlayer(audioElementRef: Ref<HTMLAudioElement | null>): {
  isPlaying: Ref<boolean>
  togglePlay: () => void
} {
  const isPlaying = ref(false)

  /**
   * @function handleAudioEnded
   * @description 处理音乐播放结束
   * @returns {void}
   */
  function handleAudioEnded(): void {
    isPlaying.value = false
    if (audioElementRef.value) {
      audioElementRef.value.currentTime = 0
    }
  }
  /**
   * @function togglePlay
   * @description 切换音乐播放暂停
   * @returns {void}
   */
  function togglePlay(): void {
    const audioElement = audioElementRef.value
    if (audioElement) {
      if (isPlaying.value) {
        audioElement.pause()
      } else {
        // 静音播放，浏览器可能允许
        audioElement.muted = true
        void audioElement.play().catch((error) => {
          console.log('music player error: ', error)
          showToast('音乐播放受限，点击页面以允许播放')
        })
        audioElement.muted = false // 取消静音，用户交互后
      }
      isPlaying.value = !isPlaying.value
    }
  }

  /**
   * @function handleVisibilityChange
   * @description 处理页面可见性事件
   * @returns {void}
   */
  function handleVisibilityChange(): void {
    if (document.hidden) {
      if (isPlaying.value) {
        togglePlay()
      }
    }
  }

  /**
   * @function setAppAudioState
   * @description 设置游戏音频状态
   * @param mute 是否静音
   */
  function setAppAudioState(mute: boolean): void {
    setAudioState({
      mute,
    }).catch((error) => {
      showToast(error.message)
    })
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    audioElementRef.value?.addEventListener('ended', handleAudioEnded)
    setAppAudioState(true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    audioElementRef.value?.removeEventListener('ended', handleAudioEnded)
    audioElementRef.value?.pause()
    audioElementRef.value = null
    setAppAudioState(false)
  })

  return {
    isPlaying,
    togglePlay,
  }
}
