import { type ErrorMessages } from '@/types/common/activity'

export const ERROR_MESSAGES: ErrorMessages = {
  // 通用错误消息
  common: {
    500: {
      'internal server error': '服务器异常，请稍后重试',
    },
  },

  // 获取精灵 token
  get_jingling_token: {
    400: {
      'missing required parameter': '请求失败，请稍后重试',
      'invalid parameter value or gms error return': '请求失败，请稍后重试',
    },
    500: {
      'request gms failed': '服务器异常，请稍后重试',
      'internal server error': '服务器异常，请稍后重试',
    },
    502: {
      'jingling did not return token': '服务器异常，请稍后重试',
    },
  },

  // 获取活动信息
  get_player_mission_data: {
    400: {
      'invalid user': '身份验证失败，请稍后重试',
      'invalid event': '无效的活动，请稍后重试',
      'invalid task': '无效的任务，请稍后重试',
      'not recently online': '非法请求，请在游戏内打开',
    },
    401: {
      'repeat request': '请求频繁，请稍后重试',
      'inactive event': '活动未开启，请稍后重试',
    },
  },

  // 设置任务进度
  set_player_task: {
    400: {
      'invalid user': '身份验证失败，请稍后重试',
      'invalid task': '无效的任务，请稍后重试',
    },
  },

  // 领取奖励
  claim_jingling_mission_reward: {
    400: {
      invalid: '请求异常，请稍后重试',
      'repeat request': '请求频繁，请稍后重试',
      'not recently online': '非法请求，请在游戏内打开',
      'wrong event or task': '无效的活动或任务，请稍后重试',
      'wrong reward_id': '领奖发生错误，请稍后重试',
      'concurrent request': '请求过于频繁，请稍后重试',
    },
    401: {
      inactive: '活动未开启，请稍后重试',
    },
    403: {
      'already received the reward': '已领取该奖励',
      'already has unlock': '已拥有该物品',
      'reward has already selected': '已选择该奖励',
      'already selected another': '已选择其他奖励',
      'invalid eggy user info': '请求失败，请稍后重试',
      'claim eggy reward error': '领奖失败，请稍后重试',
      'out of stock': '库存不足，请稍后重试',
    },
  },

  // 兑换奖励
  purchase_sprite_token: {
    401: {
      'invalid user': '身份验证失败，请稍后重试',
      'invalid event': '无效的活动，请稍后重试',
      'inactive event': '活动未开启，请稍后重试',
    },
    402: {
      'invalid id or event': '请求异常，请稍后重试',
      'invalid store currency type': '服务器异常，请稍后重试',
    },
    403: {
      'purchase condition not met': '请求异常，请稍后重试',
    },
    404: {
      'frequent request': '请求频繁，请稍后重试',
    },
    405: {
      'concurrent request': '请求频繁，请稍后重试',
    },
  },

  // 回流获取数据
  get_return_buff_data: {
    400: {
      'invalid page': '请求异常，请稍后重试',
      'no return tag': '请求异常，请稍后重试',
      inactive: '活动未开启，请稍后重试',
    },
  },

  // 回流领取奖励
  claim_return_buff_reward: {
    400: {
      invalid: '请求异常，请稍后重试',
      'wrong type': '请求异常，请稍后重试',
    },
    403: {
      'already received the reward': '已领取该奖励',
    },
  },

  // 查询新季节预约状态
  get_season_reservation_status: {
    404: {
      not_reserved: '未预约',
    },
  },
}
