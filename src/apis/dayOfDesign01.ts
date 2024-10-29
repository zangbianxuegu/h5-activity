import type { WorkListParams, WorkListRes } from '@/types'

/**
 * 作品列表
 * @param {WorkListParams} params 参数
 * @property {SearchType} type 类型
 * @property {number} page 页数
 * @property {number} per_page 每页数量
 * @returns {Promise<WorkListRes>}
 */
export function getWorkList(params: WorkListParams): Promise<WorkListRes> {
  console.log('params: ', params)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'ok',
        data: {
          list: [
            {
              id: 'ID123456781',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456782',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456783',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: true,
            },
            {
              id: 'ID123456784',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456783',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: true,
            },
            {
              id: 'ID123456784',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
          ],
          total_pages: 50,
          page: 2,
        },
      })
    }, 200)
  })
}
