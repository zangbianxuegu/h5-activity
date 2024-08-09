<template>
  <div class="container w-full">
    <van-button :color="linkBtnConfig.color" @click="onClickLinkBtn()">
      <div class="link-text">
        <van-icon v-if="!isJumpDirectly" name="edit" />
        <span class="truncate">
          {{ props.linkName }}
        </span>
      </div>
      <div
        class="link-edit"
        v-if="!isDefaultLink && isJumpDirectly"
        @click.stop="onClickLinkEditBtn()"
      >
        <van-icon name="edit" />
      </div>
    </van-button>
    <van-action-sheet
      v-model:show="actionSheetObject.show"
      :actions="actionSheetObject.actions"
      @select="onSelectActionSheet"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  linkName: string
  link: string
  isDefaultLink: boolean
  isJumpDirectly?: boolean
}
const props = defineProps<Props>()

const emits = defineEmits(['edit', 'remove'])

const linkBtnConfig = computed(() => {
  let color = 'linear-gradient(to right, rgb(0, 176, 155), rgb(150, 201, 61))'
  if (props.isJumpDirectly) {
    color = 'linear-gradient(to right, rgb(55, 59, 68), rgb(66, 134, 244))'
  }
  return {
    color,
  }
})

const actionSheetObject = reactive({
  show: false,
  actions: ref(),
})
actionSheetObject.actions = computed(() => {
  const defaultList = [{ name: 'http' }, { name: 'https' }]
  if (!props.isDefaultLink) {
    defaultList.push({ name: '编辑' })
    defaultList.push({ name: '删除' })
  }
  return defaultList
})
const onSelectActionSheet = ({ name }: { name: string }): void => {
  actionSheetObject.show = false
  if (name === 'https' || name === 'http') {
    const protocol = props.link.includes('https') ? 'https' : 'http'
    goToLink(props.link.replace(protocol, name))
  } else {
    if (name === '编辑') {
      emits('edit', props.id)
    } else if (name === '删除') {
      emits('remove', props.id)
    }
  }
}

const onClickLinkBtn = (): void => {
  if (props.isJumpDirectly) {
    goToLink(props.link)
  } else {
    actionSheetObject.show = true
  }
}

const onClickLinkEditBtn = (): void => {
  actionSheetObject.show = true
}

const goToLink = (link: string): void => {
  location.href = link
}
</script>

<style scoped lang="scss">
.container :deep(.van-popover__wrapper) {
  width: 100%;
}
.container :deep(.van-button) {
  width: 100%;
  padding: 0;
  .van-button__content {
    width: 100%;
    .van-button__text {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      div {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &.link-text {
          flex: 1;
          overflow: hidden;
          padding: 0 5px;
        }
        &.link-edit {
          width: 100px;
          border-left: 1px solid #ccc;
          i {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
