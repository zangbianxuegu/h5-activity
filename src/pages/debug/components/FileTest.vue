<template>
  <form>
    <div>
      <label for="image_uploads">Choose images to upload (PNG, JPG)</label>
      <!-- 37：gif 读取格式为 JPG -->
      <input type="file" id="image_uploads" name="image_uploads" accept="*" />

      <!-- ios正常，android浏览器正常，但客户端中不能显示图片 -->
      <!-- <input
        type="file"
        id="image_uploads"
        name="image_uploads"
        accept="image/jpeg, image/png, image/jpg"
      /> -->

      <!-- 无法使用 -->
      <!-- <input
        type="file"
        id="image_uploads"
        name="image_uploads"
        accept=".png, .jpeg"
      /> -->
      <!-- <input
        type="file"
        id="image_uploads"
        name="image_uploads"
        capture
        multiple="true"
        accept="*"
      /> -->
    </div>
    <div class="preview">
      <p>No files currently selected for upload</p>
    </div>
    <div>
      <button>Submit</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { showToast } from 'vant'

onMounted(() => {
  const input = document.querySelector('input')
  console.log('input: ', input)
  if (input) {
    input.style.opacity = '0'
    input.addEventListener('change', updateImageDisplay)
  }
  getImageInfo()
})

const getImageInfo = (): void => {
  document
    .getElementById('image_uploads')
    ?.addEventListener('change', function (event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      // 设置允许的文件格式和文件大小限制（例如：2 MB）
      const allowedTypes = ['image/jpeg', 'image/png']
      const maxSize = 2 * 1024 * 1024 // 2 MB

      if (file) {
        // 检查文件类型
        if (!allowedTypes.includes(file.type)) {
          showToast('上传失败，只能上传png和jpg')
          return
        }
        // 检查文件大小
        if (file.size > maxSize) {
          showToast('所传文件过大')
          return
        }
        const reader = new FileReader()

        reader.onload = function (e) {
          const img = new Image()

          img.onload = function () {
            console.log(img)
            console.log(`宽度: ${img.width}, 高度: ${img.height}`)
          }

          img.src = e.target?.result as string // 使用 FileReader 读取的图片数据
        }

        reader.readAsDataURL(file) // 读取文件为 Data URL
      }
    })
}

function updateImageDisplay(): void {
  const preview = document.querySelector('.preview')
  const input = document.querySelector('input')
  console.log('preview: ', preview)
  if (preview) {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild)
    }

    const curFiles = input?.files
    console.log('curFiles: ', curFiles)
    if (curFiles && curFiles.length === 0) {
      const para = document.createElement('p')
      para.textContent = 'No files currently selected for upload'
      preview.appendChild(para)
    } else if (curFiles) {
      const list = document.createElement('ol')
      preview.appendChild(list)

      for (const file of curFiles) {
        const listItem = document.createElement('li')
        const para = document.createElement('p')

        if (validFileType(file)) {
          para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`
          const image = document.createElement('img')
          image.src = URL.createObjectURL(file)

          listItem.appendChild(image)
          listItem.appendChild(para)
        } else {
          para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`
          listItem.appendChild(para)
        }

        list.appendChild(listItem)
      }
    }
  }
}

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
const fileTypes = [
  // 'image/apng',
  // 'image/bmp',
  // 'image/gif',
  'image/jpeg',
  // 'image/pjpeg',
  'image/png',
  // 'image/svg+xml',
  // 'image/tiff',
  // 'image/webp',
  // 'image/x-icon',
]

function validFileType(file: File): boolean {
  return fileTypes.includes(file.type)
}

function returnFileSize(number: number): string {
  if (number < 1024) {
    return number + 'bytes'
  } else if (number > 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB'
  } else if (number > 1048576) {
    return (number / 1048576).toFixed(1) + 'MB'
  }
  return ''
}
</script>
<style>
html {
  font-family: sans-serif;
}

form {
  color: #fff;
  background: #ccc;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid black;
  height: 1000px;
  overflow: scroll;
}

form ol {
  padding-left: 0;
}

form li,
div > p {
  background: #eee;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  list-style-type: none;
  border: 1px solid black;
}

form img {
  height: 300px;
  order: 1;
}

form p {
  color: #333;
  padding-left: 10px;
}

form label,
form button {
  background-color: #7f9ccb;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px ridge black;
  font-size: 0.8rem;
  height: auto;
}

form label:hover,
form button:hover {
  background-color: #2d5ba3;
  color: white;
}

form label:active,
form button:active {
  background-color: #0d3f8f;
  color: white;
}
</style>
