import { Session } from '@/utils/storage'

export function useTransitions(): {
  bodyTransitionName: Ref<string>
  headTransitionName: Ref<string>
  mainTransitionName: Ref<string>
} {
  const sessionIsVisitedKey = 'isVisitedMoominTestGod'
  const isVisited = Session.get(sessionIsVisitedKey)
  const bodyTransitionName = ref('')
  const headTransitionName = ref('')
  const mainTransitionName = ref('')
  if (!isVisited) {
    bodyTransitionName.value = 'fade-in-body'
    headTransitionName.value = 'fade-in-head'
    mainTransitionName.value = 'fade-in-main'
  }

  onMounted(() => {
    Session.set(sessionIsVisitedKey, true)
  })

  return {
    bodyTransitionName,
    headTransitionName,
    mainTransitionName,
  }
}
