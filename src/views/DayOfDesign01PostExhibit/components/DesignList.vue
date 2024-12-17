<template>
  <!-- 主体内容 -->
  <div>
    <div class="relative h-[760px]">
      <!-- 左箭头 -->
      <Transition name="fade">
        <button
          type="button"
          v-show="isPrevVisible"
          class="arrow arrow-left absolute cursor-pointer bg-contain bg-no-repeat"
          aria-label="上一页"
          @click="emit('on-prev')"
        >
          <span class="sr-only">上一页</span>
        </button>
      </Transition>
      <!-- 作品列表 -->
      <ul v-if="list" class="work-list flex w-full flex-wrap">
        <li
          v-for="item in list"
          :key="item.design_id"
          class="work-item relative cursor-pointer rounded bg-white shadow-md"
          @click="emit('on-click', item)"
        >
          <template v-if="item.design_id && !item.error">
            <!-- 作品图片 -->
            <img
              :src="item.raw_url"
              :alt="item.design_name"
              class="w-full rounded"
              @error="emit('on-image-error', item)"
            />
            <!-- 作品 ID -->
            <div class="work-id absolute left-0 top-0">
              {{ item.design_id }}
            </div>
            <!-- 收藏图标 -->
            <img
              v-if="item.favorite"
              class="absolute right-[10px] top-[5px] h-[50px] w-[50px] bg-contain"
              src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/favorite-work.png"
              alt="已收藏"
            />
            <!-- 底部信息 -->
            <div class="work-info absolute inset-x-0 bottom-0 text-center">
              <div
                class="pointer-events-none flex h-full w-full flex-col justify-center bg-gradient-to-b from-transparent to-[#feffff]"
              >
                <h3 class="work-info-author flex justify-center bg-no-repeat">
                  <div>
                    <span class="work-info-icon bg-contain bg-no-repeat"></span>
                    {{ item.author_name }}
                  </div>
                </h3>
                <p class="work-info-title">
                  {{ item.design_name }}
                </p>
              </div>
            </div>
          </template>
          <!-- 数据不存在 -->
          <div
            v-else
            class="flex h-full w-full flex-col items-center justify-center"
          >
            <img
              src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/no-exist.jpg"
              alt="作品已删除"
              class="h-[201px] w-[135px]"
            />
            <p class="mt-[10px] text-[28px] text-[#b8b8b8]">作品已删除</p>
          </div>
        </li>
      </ul>
      <div v-else class="flex h-[800px] w-[1400px] items-center justify-center">
        暂无作品
      </div>
      <!-- 右箭头 -->
      <Transition name="fade">
        <button
          type="button"
          v-show="isNextVisible"
          class="arrow arrow-right absolute cursor-pointer bg-contain bg-no-repeat"
          aria-label="下一页"
          @click="emit('on-next')"
        >
          <span class="sr-only">下一页</span>
        </button>
      </Transition>
    </div>
    <!-- 分页 -->
    <Transition name="fade">
      <div
        v-if="isPagesVisible"
        class="pagination flex items-center justify-center"
      >
        <p>{{ currentPage }}/{{ totalPage }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { DesignItem } from '@/types'
defineProps({
  list: {
    type: Array<DesignItem>,
    required: true,
  },
  isPrevVisible: {
    type: Boolean,
    default: false,
  },
  isNextVisible: {
    type: Boolean,
    default: false,
  },
  isPagesVisible: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPage: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['on-prev', 'on-next', 'on-image-error', 'on-click'])
</script>

<style scoped lang="scss">
$bg-color: rgba(238, 251, 255, 0.8);
$font-color: #5a7191;
$font-family: 'Source Han Sans CN';
$font-family-bold: 'Source Han Sans CN Medium';

.work-list {
  margin-top: 30px;
}
.work-item {
  margin: 0 20px 20px 0;
  border: 2px solid $bg-color;
  border-radius: 20px;
  width: 480px;
  height: 360px;
  box-shadow:
    2.3px 3.3px 21px 8px rgba(255, 255, 255, 0.2),
    6.8px 7.8px 16px 0 rgba(77, 77, 77, 0.2);
  overflow: hidden;

  &:nth-of-type(3n) {
    margin-right: 0;
  }
}
.work-id {
  padding: 0 15px;
  height: 35px;
  line-height: 35px;
  font-size: 28px;
  color: $font-color;
  background-color: $bg-color;
  border-bottom-right-radius: 22px;
}
.work-info {
  width: 100%;
  height: 100px;
  color: $font-color;
  background-color: $bg-color;
  box-shadow: 0 -2px 6px 2px rgba(90, 113, 145, 0.06);

  &-author {
    height: 40px;
    line-height: 40px;
    font-size: 28px;
  }

  &-icon {
    padding-left: 24px;
    width: 19px;
    height: 40px;
    background-position: 0 3px;
    background-size: 19px 24px;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/user.png');
  }

  &-title {
    height: 44px;
    line-height: 44px;
    font-size: 32px;
    font-weight: 500;
    font-family: $font-family-bold;
  }
}
.arrow {
  top: 188px;
  width: 128px;
  height: 128px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/arrow.png');

  &:hover {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/arrow-hover.png');
  }

  &-left {
    left: -208px;
  }

  &-right {
    right: -208px;
    transform: rotate(180deg);
  }
}
.pagination {
  font-size: 32px;
  font-weight: $font-family-bold;
  color: $font-color;
}
</style>
