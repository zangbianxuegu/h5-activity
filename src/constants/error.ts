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

  // 获取走格子数据
  get_dice_map_data: {
    400: {
      'inactive event': '活动未开启，请稍后重试',
    },
  },

  // 扔随机骰子
  throw_random_dice: {
    400: {
      'insuf random dice': '蟹蟹的士数量不足',
      'inactive event': '活动未开启，请稍后重试',
      'repeat request': '请求频繁，请稍后重试',
    },
  },

  // 走格子移动
  move: {
    400: {
      'inactive event': '活动未开启，请稍后重试',
      'repeat request': '请求频繁，请稍后重试',
      'invalid dice value': '骰子点数错误，请稍后重试',
      'invalid cur pos': '玩家当前位置错误，请稍后重试',
      'invalid move': '请求异常，请稍后重试',
      'insuf dice': '骰子数量不足',
    },
  },

  // 万圣节寻宝
  treasure_hunt: {
    400: {
      'repeat request': '请求频繁，请稍后重试',
      'not enough treasure hunt tickets':
        '挖宝次数不足，请在不给糖果就捣蛋活动中获取',
      'id has already been selected': '格子已经挖过',
      'all grids have been selected': '所有的格子都被挖过了',
      'invalid grid id': '请求异常，请稍后重试',
      'invalid event or task': '无效的活动或任务，请稍后重试',
      'unknown error': '服务器异常，请稍后重试',
      'invalid user': '身份验证失败，请稍后重试',
      'not recently online': '非法请求，请在游戏内打开',
    },
  },

  // 万圣节抽奖
  lottery: {
    400: {
      'repeat request': '请求频繁，请稍后重试',
      'invalid event or task': '无效的活动或任务，请稍后重试',
      'invalid user': '身份验证失败，请稍后重试',
      'not recently online': '非法请求，请在游戏内打开',
    },
  },

  // 新版统一错误信息
  new_common_error: {
    400: {
      'repeat request': '请求频繁，请稍后重试',
      'bad request': '非法请求，请在游戏内打开',
    },
    500: {
      'internal server error': '服务器异常，请稍后重试',
    },
  },

  // 绘梦节 - 搜索
  search_designs: {
    400: {
      'invalid term': '没有找到相关结果，请准确输入作者名或作品编码',
      'repeat request': '点得太快了，请稍后重试',
      'bad request': '非法请求',
    },
    500: {
      'internal server error': '服务器错误，请稍后重试',
    },
  },

  // 绘梦节 - 收藏
  get_favorites: {
    400: {
      'repeat request': '点得太快了，请稍后重试',
      'bad request': '非法请求',
    },
    500: {
      'internal server error': '服务器错误，请稍后重试',
    },
  },

  // 绘梦节 - 推荐
  get_recommendations: {
    400: {
      'repeat request': '点得太快了，请稍后重试',
      'bad request': '非法请求',
    },
  },

  // 狼人杀联动查询账号
  get_werewolf_info: {
    401: {
      already_bind: '账号已绑定',
    },
    402: {
      bind_error: '绑定失败 数据异常',
      user_not_exist: '狼人杀的账号不存在',
    },
  },
  // 绑定狼人杀账号
  bind_werewolf_info: {
    401: {
      already_bind: '账号已绑定',
    },
    402: {
      user_not_exist: '用户不存在',
    },
    500: {
      'internal server error': '服务器异常，请稍后重试',
    },
  },

  // pc上线庆典获取邀请信息
  get_invite_info: {
    400: {
      'inactive event': '活动未开启，请稍后重试',
    },
  },
  // 绑定pc上线庆典邀请码
  accept_invite: {
    400: {
      'inactive event': '活动未开启，请稍后重试',
      'invalid code': '请输入正确的邀请码',
      'cannot bind': '账号无法绑定',
    },
  },

  get_file_picker_token: {
    400: {
      'bad request': '投稿失败',
    },
    401: {
      unauthorized: '您已被禁止投稿，请联系客服了解',
    },
  },

  review_text: {
    400: {
      'bad request': '投稿失败',
      'text invalid': '作品名称/作者名/作品介绍不符合要求',
      'author_name error_length': '作品名称/作者名/作品介绍不符合要求',
      'author_name nomatch': '作品名称/作者名/作品介绍不符合要求',
      'design_name error_length': '作品名称/作者名/作品介绍不符合要求',
      'design_name nomatch': '作品名称/作者名/作品介绍不符合要求',
      'description error_length': '作品名称/作者名/作品介绍不符合要求',
      'description nomatch': '作品名称/作者名/作品介绍不符合要求',
      'illegal author_name':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal design_name':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal description':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal combined_text':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
    },
    401: {
      unauthorized: '您已被禁止投稿，请联系客服了解',
    },
  },

  get_design_id: {
    500: {
      fail: '投稿失败',
    },
    400: {
      'bad request': '投稿失败',
      'repeat request': '点得太快了，请稍后再试',
    },
  },

  report: {
    400: {
      'bad request': '非法请求',
    },
  },

  upload_filepicker_result: {
    500: {
      fail: '投稿失败',
    },
    409: {
      'already exists': '作品信息已经存在，请刷新页面',
    },
    400: {
      'bad request': '投稿失败',
      'repeat request': '点得太快了，请稍后再试',
      'text invalid': '作品名称/作者名/作品介绍不符合要求',
      'author_name error_length': '作品名称/作者名/作品介绍不符合要求',
      'author_name nomatch': '作品名称/作者名/作品介绍不符合要求',
      'design_name error_length': '作品名称/作者名/作品介绍不符合要求',
      'design_name nomatch': '作品名称/作者名/作品介绍不符合要求',
      'description error_length': '作品名称/作者名/作品介绍不符合要求',
      'description nomatch': '作品名称/作者名/作品介绍不符合要求',
      'illegal author_name':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal design_name':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal description':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
      'illegal combined_text':
        '您输入的文字/作品名称/作者名/作品介绍包含敏感字符',
    },
    401: {
      unauthorized: '您已被禁止投稿，请联系客服了解',
    },
  },

  get_design_details: {
    400: {
      'bad request': '非法请求',
    },
  },

  delete_player_design: {
    400: {
      'bad request': '非法请求',
      'repeat request': '点得太快了，请稍后重试',
    },
    500: {
      fail: '删除失败，请稍后重试',
    },
  },

  update_favorites: {
    500: {
      'internal server error': '服务器错误，请稍后重试',
    },
    400: {
      'bad request': '非法请求',
      'repeat request': '点得太快了，请稍后重试',
    },
    403: {
      'count limit': '收藏数量超出限制',
    },
    404: {
      'not found': '抱歉，该作品刚刚被作者删除了',
    },
    409: {
      'already exists': '该作品已被收藏过',
    },
  },
}
