import CryptoJS from 'crypto-js'
/**
 * @description 将文件转为blob
 * @returns Blob
 */
export const fileToBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const blob = new Blob([file], {
      type: file.type,
    })
    resolve(blob)
  })
}

/**
 * @description blob转为url(base64)
 * @returns url
 */
export const blobToUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function (event) {
      const url = event.target?.result as string
      resolve(url)
    }
    reader.onerror = function (event) {
      reject(event.target?.error)
    }
  })
}

export const getBlobWithMd5 = async (blob: Blob): Promise<string> => {
  const md5Result: string = await new Promise((resolve, reject): void => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    reader.onload = function (event) {
      const baseResult = event.target?.result as any
      const wordArray = CryptoJS.lib.WordArray.create(baseResult)
      resolve(CryptoJS.MD5(wordArray).toString())
    }
    reader.onerror = function (event) {
      reject(event.target?.error)
    }
  })
  return md5Result
}
