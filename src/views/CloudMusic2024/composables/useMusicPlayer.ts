import { showToast } from 'vant'
import { setAudioState } from '@/apis/base'

export function useMusicPlayer(audioElementRef: Ref<HTMLAudioElement | null>): {
  isPlaying: Ref<boolean>
  togglePlay: () => void
} {
  const isPlaying = ref(true)

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

  onMounted(() => {
    setAudioState({
      mute: true,
    }).catch((error) => {
      showToast(error.message)
    })
  })

  onBeforeUnmount(() => {
    audioElementRef.value?.pause()
    audioElementRef.value = null
    setAudioState({
      mute: false,
    }).catch((error) => {
      showToast(error.message)
    })
  })

  return {
    isPlaying,
    togglePlay,
  }
}
