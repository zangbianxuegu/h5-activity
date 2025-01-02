<template>
  <div>
    <van-button @click="onClickRequest"
      >/account/web/get_design_details</van-button
    >
    <van-button @click="onClickRecommend">getUserInfo</van-button>
    <van-button @click="onClickGoToLocal">去往本地开发环境</van-button>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/apis/base'
import { getDesignDetails } from '@/apis/dayOfDesign01'
import { FILE_PICKER_POLICY_NAME } from '@/constants/dayofdesign01'
import { type SelfDesignDetails } from '@/types'
import { showToast } from 'vant'

const filePickerConfig = ref({
  policyName: FILE_PICKER_POLICY_NAME,
})

const onClickRequest = async (): Promise<void> => {
  ;(await getDesignDetails({
    policy_name: filePickerConfig.value.policyName,
  })) as SelfDesignDetails
  showToast('调用成功了')
}

const onClickRecommend = async (): Promise<void> => {
  await getUserInfo()
  showToast('调用成功了')
}

const onClickGoToLocal = (): void => {
  window.location.href =
    'http://10.227.198.124:5173/#/dayofdesign01-post-submit'
}
</script>

<style scoped lang="scss"></style>
