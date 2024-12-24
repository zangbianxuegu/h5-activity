<template>
  <Teleport to="body">
    <div ref="containerRef" class="ps_ignore-container">
      <div class="left relative">
        <img id="img-container" :src="worksData.worksImgSrc" alt="" srcset="" />
      </div>
      <div class="right relative">
        <div class="decorate-works-basic-info">
          <p>
            <span>编号：</span>
            <span>{{ worksData.id }}</span>
          </p>
          <p>
            <span>作者：</span>
            <span>{{ worksData.author }}</span>
          </p>
          <p>
            <span>作品：</span>
            <span>{{ worksData.worksName }}</span>
          </p>
        </div>
        <div class="decorate-works-introduce">
          <p>{{ worksData.worksIntroduce }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
defineProps<{
  worksData: {
    id: string
    author: string
    worksName: string
    worksImgSrc: string
    worksIntroduce: string
  }
}>()

const containerRef = ref<HTMLElement | null>(null)
// 生成拼装图
const generateDecorateWorksImg = (): Promise<{
  worksDecorateImg: Blob
  worksDecorateImgSrc: string
}> => {
  return new Promise((resolve): void => {
    const target = containerRef.value as HTMLElement
    void html2canvas(target, {
      scale: 1, // 设置画布的缩放比例为 1
      width: 1830, // 设置输出图像的宽度
      height: 960, // 设置输出图像的高度
      useCORS: true,
      backgroundColor: 'transparent',
    }).then((canvas) => {
      canvas.toBlob((blob): void => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          resolve({
            worksDecorateImg: blob,
            worksDecorateImgSrc: url,
          })
        }
      })
    })
  })
}

defineExpose({ generateDecorateWorksImg })
</script>

<style scoped lang="scss">
.ps_ignore-container {
  height: 960px !important;
  width: 1830px !important;
  position: absolute;
  top: -10000px;
  left: -1000px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/bg-decorate-img.png');
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 50px 30px 30px;
  & > img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .left {
    width: 1200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 22px;
    overflow: hidden;
    z-index: 10;
    img {
      width: 1200px;
      height: 900px;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 33px 12px 2px 60px;
    color: #7d7774;
    overflow: hidden;
    z-index: 10;
    .decorate-works-basic-info {
      width: 100%;
      height: 166px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 30px;
      margin-bottom: 36px;
      p {
        font-size: 36px;
        line-height: 36px;
      }
    }
    .decorate-works-introduce {
      width: 100%;
      flex: 1;
      margin-top: 36px;
      overflow: hidden;
      p {
        font-size: 30px;
        line-height: 50px;
        word-wrap: break-word; /* 适用于较旧的浏览器 */
        overflow-wrap: break-word;
        white-space: pre-wrap;
      }
    }
  }
}
</style>
