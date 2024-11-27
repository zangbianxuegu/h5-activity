<template>
  <div class="tab-container">
    <div class="tab-title-container">
      <div
        v-for="(item, index) in tabs"
        :key="(item as Tab).name"
        :class="[
          'tab-title',
          `tab-title${index + 1}`,
          currentTab === index ? 'active' : 'inactive',
        ]"
        @click="switchComponent(index)"
      ></div>
    </div>
    <div class="tab-content">
      <slot></slot>
      <!-- <component :is="tabs[currentTab].component"></component> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type InvitationCode from './InvitationCode.vue'
// import BindRewards from './BindRewards.vue'

interface Tab {
  name: string
  component: InstanceType<typeof InvitationCode>
}

defineProps({
  tabs: {
    type: Array,
    default: () => [
      // {
      // 	name: 'InvitationCode',
      // 	component: InvitationCode,
      // }
    ],
  },
  currentTab: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['switchTab'])

// const currentTab = ref(0)
// const tabs = [
// 	{
// 		name: 'InvitationCode',
// 		component: InvitationCode,
// 	},
// 	{
// 		name: 'BindRewards',
// 		component: BindRewards,
// 	},
// ]

// 切换组件
const switchComponent = (index: number): void => {
  // props.currentTab = index
  emit('switchTab', index)
}
</script>

<style lang="scss" scoped>
.tab-container {
  position: absolute;
  left: 50px;
  bottom: 50px;

  .tab-title-container {
    display: flex;
    justify-content: center;

    .tab-title {
      width: 218px;
      height: 58px;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 10;

      &.tab-title1 {
        margin-right: 10px;

        &.active {
          background-image: url('@/assets/images/invitation-code/tab1-active.png');
        }

        &.inactive {
          background-image: url('@/assets/images/invitation-code/tab1-inactive.png');
        }
      }

      &.tab-title2 {
        &.active {
          background-image: url('@/assets/images/invitation-code/tab2-active.png');
        }

        &.inactive {
          background-image: url('@/assets/images/invitation-code/tab2-inactive.png');
        }
      }
    }
  }

  .tab-content {
    width: 833px;
    height: 242px;
    background-image: url('@/assets/images/invitation-code/tab-bg.png');
    background-repeat: no-repeat;
    background-size: contain;
    margin-top: -10px;
  }
}
</style>
