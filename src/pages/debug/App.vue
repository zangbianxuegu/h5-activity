<template>
  <div class="h-screen overflow-scroll bg-gray-200 p-4">
    <div class="header">
      <van-button
        icon="plus"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
        @click="onClickAddDebugLink"
        size="small"
      >
        添加本地调试
      </van-button>
      <van-overlay
        :show="formModalConfig.isShow"
        @click="formModalConfig.isShow = false"
      >
        <div class="wrapper" @click.stop>
          <van-form @submit="onSubmit">
            <van-cell-group inset>
              <van-field name="protocol" label="协议" required>
                <template #input>
                  <van-radio-group
                    v-model="debugLinkForm.protocol"
                    direction="horizontal"
                  >
                    <van-radio name="http">http</van-radio>
                    <van-radio name="https">https</van-radio>
                  </van-radio-group>
                </template></van-field
              >
              <van-field name="isJumpDirectly" label="点击直接跳转" required>
                <template #input>
                  <van-radio-group
                    v-model="debugLinkForm.isJumpDirectly"
                    direction="horizontal"
                  >
                    <van-radio :name="true">是</van-radio>
                    <van-radio :name="false">否</van-radio>
                  </van-radio-group>
                </template></van-field
              >
              <van-field
                v-model="debugLinkForm.domainName"
                type="text"
                name="domainName"
                label="域名"
                placeholder="wwww.baidu.com"
                required
              />
              <van-field
                v-model="debugLinkForm.port"
                type="text"
                name="port"
                label="端口"
                placeholder="端口"
              />
              <van-field
                v-model="debugLinkForm.linkName"
                type="text"
                name="linkName"
                label="链接名称"
                placeholder="链接名称"
                required
              />
            </van-cell-group>
            <van-divider
              >最终链接：{{
                generateWholeLink(
                  debugLinkForm.protocol,
                  debugLinkForm.domainName,
                  debugLinkForm.port,
                )
              }}</van-divider
            >
            <div class="flex" style="margin: 16px">
              <van-button round block type="primary" native-type="submit">
                {{ submitBtnText }}
              </van-button>
              <van-button
                round
                block
                type="primary"
                @click="formModalConfig.isShow = false"
              >
                关闭
              </van-button>
            </div>
          </van-form>
        </div>
      </van-overlay>
    </div>
    <div class="body">
      <div>
        <van-divider content-position="center">固定调试链接</van-divider>
        <div class="grid grid-cols-5 gap-4">
          <DebugLink
            v-for="(link, index) in defaultDebugLinks"
            :key="index"
            :link-name="link.linkName"
            :link="link.link"
            :is-default-link="true"
            :is-jump-directly="link.isJumpDirectly"
          ></DebugLink>
        </div>
      </div>
      <div>
        <van-divider content-position="center">本地配置调试链接</van-divider>
        <div class="grid grid-cols-5 gap-4">
          <DebugLink
            v-for="(link, index) in customDebugLinks"
            :id="link.id"
            :key="index"
            :link-name="link.linkName"
            :link="generateHrefByDebugLinkForm(link)"
            :is-default-link="false"
            :is-jump-directly="link.isJumpDirectly"
            @edit="handleEditDebugLink"
            @remove="handleRemoveDebugLink"
          ></DebugLink>
        </div>
      </div>
    </div>
    <div>
      <h2 class="my-2">上传控件测试</h2>
      <file-test></file-test>
      <h2 class="my-2">分享功能测试</h2>
      <share></share>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Local } from '@/utils/storage'
import DebugLink from './components/DebugLink.vue'
import FileTest from './components/FileTest.vue'
import Share from './components/Share.vue'
import { generateUUID } from '@/utils/utils'
import defaultDebugLinks from './configs/defaultDebugLinks.ts'
import { showNotify } from 'vant'
interface DebugLinkForm {
  id: string
  protocol: string
  domainName: string
  port: string
  linkName: string
  isJumpDirectly: boolean
}

const debugLinkForm = ref<DebugLinkForm>({
  id: '',
  protocol: '',
  domainName: '',
  port: '',
  linkName: '',
  isJumpDirectly: false,
})

const formModalConfig = ref({
  isShow: false,
  mode: 'add',
})

const submitBtnText = computed(() => {
  if (formModalConfig.value.mode === 'add') {
    return '添加'
  } else if (formModalConfig.value.mode === 'edit') {
    return '修改'
  }
  return ''
})

const customDebugLinks = ref<DebugLinkForm[]>([])

const customDebugLinkStorageHandlers = {
  add: (value: DebugLinkForm) => {
    customDebugLinks.value?.push(value)
    Local.set('customDebugLinks', customDebugLinks.value)
  },
  remove: (id: string) => {
    const oldList = customDebugLinkStorageHandlers.getAll()
    const newList = oldList.filter((item: DebugLinkForm) => item.id !== id)
    customDebugLinkStorageHandlers.updateAll(newList)
  },
  update: (newDebugLink: DebugLinkForm) => {
    const id = newDebugLink.id
    const oldList = customDebugLinkStorageHandlers.getAll()
    const newList = oldList.map((item: DebugLinkForm) => {
      if (item.id === id) {
        return newDebugLink
      }
      return item
    })
    customDebugLinkStorageHandlers.updateAll(newList)
  },
  updateAll: (debugLinks: DebugLinkForm[]) => {
    Local.set('customDebugLinks', debugLinks)
    customDebugLinks.value = debugLinks
  },
  getAll: () => {
    const list = Local.get('customDebugLinks')
    if (list) {
      return list
    } else {
      return []
    }
  },
  getItemById: (id: string) => {
    return customDebugLinkStorageHandlers
      .getAll()
      .find((item: DebugLinkForm) => item.id === id)
  },
}

const showBebugLinkForm = (isEditMode = false): void => {
  if (isEditMode) {
    formModalConfig.value.mode = 'edit'
  } else {
    formModalConfig.value.mode = 'add'
    debugLinkForm.value = {
      id: '',
      protocol: 'http',
      domainName: '',
      port: '',
      linkName: '',
      isJumpDirectly: false,
    }
  }
  formModalConfig.value.isShow = true
}
const hideDebugLinkForm = (): void => {
  formModalConfig.value.isShow = false
}
const onClickAddDebugLink = (): void => {
  showBebugLinkForm(false)
}
const handleEditDebugLink = (id: string): void => {
  showBebugLinkForm(true)
  const debugLinkLocalData = customDebugLinkStorageHandlers.getItemById(id)
  if (debugLinkLocalData) {
    debugLinkForm.value = debugLinkLocalData
  } else {
    alert('数据有误，请删除后重新添加')
  }
}
const handleRemoveDebugLink = (id: string): void => {
  customDebugLinkStorageHandlers.remove(id)
  customDebugLinks.value = customDebugLinkStorageHandlers.getAll()
}

const generateWholeLink = (
  protocol: string,
  domainName: string,
  port: string,
): string => {
  const href = port
    ? `${protocol}://${domainName}:${port}`
    : `${protocol}://${domainName}`
  return href
}

const generateHrefByDebugLinkForm = (form: DebugLinkForm): string => {
  const { protocol, domainName, port } = form
  const href = generateWholeLink(protocol, domainName, port)
  return href
}

const onSubmit = (values: DebugLinkForm): void => {
  if (!values.domainName || !values.linkName) {
    showNotify({ type: 'danger', message: '必填项不能为空' })
    return
  }
  if (formModalConfig.value.mode === 'add') {
    customDebugLinkStorageHandlers.add({ ...values, id: generateUUID() })
  } else if (formModalConfig.value.mode === 'edit') {
    customDebugLinkStorageHandlers.update(debugLinkForm.value)
  }
  hideDebugLinkForm()
}

onMounted(() => {
  const _customDebugLinks = Local.get('customDebugLinks')
  if (_customDebugLinks) {
    customDebugLinks.value = _customDebugLinks
  }
})
</script>

<style scoped lang="scss">
.body {
  flex: 1;
  overflow: auto;
  margin-top: 20px;
}
.btn {
  background-color: #ffcb4d;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
