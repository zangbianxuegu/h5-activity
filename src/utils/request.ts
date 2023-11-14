import { showToast } from 'vant'

// 获取玩家任务进度数据
export function getPlayerMissionData(
  { event }: { event?: string },
  onSuccess: (res: any) => void,
): void {
  // if (!window.UniSDKJSBridge) {
  //   console.error('请在客户端中打开！')
  //   return
  // }
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'ngwebview_notify_native',
    reqData: {
      notification_name: 'NT_NOTIFICATION_EXTEND',
      data: {
        resource: '/internal/jingling/get_player_mission_data',
        content: JSON.stringify({
          source_token: '',
          source_id: '',
          // user: 'b79fb400-8bc4-47d9-b9e3-1ac28f99d72b',
          event,
        }),
      },
    },
    callback: {
      nativeCallback: function (respJSONString: string) {
        console.log('获取玩家任务进度信息 respJSONString: ', respJSONString)
        // respJSONString Android：'{"methodId":"NGWebViewCallbackToWeb", "web_response":"{"code":200,"result":"ok"}", "callback_id":"202972267" }'
        // respJSONString iOS："web_response":"{"code":200,"result":"ok"}"
        const reg = /"web_response":"({.*?})"/
        const match = respJSONString.match(reg)
        let res = null
        if (match) {
          let resStr = match[1]
          // fix: iOS 返回：{\"code\": 200, \"result"\: \"OK\"}
          resStr = resStr.replace(/\\/g, '')
          res = JSON.parse(resStr)
        }
        console.log('获取玩家任务进度信息 res: ', res)
        if (res.code === 200) {
          onSuccess(res.data)
        } else {
          if (res.code === 400) {
            if (res.msg === 'invalid event') {
              showToast('无效活动')
            } else if (res.msg === 'invalid task') {
              showToast('无任务')
            } else if (res.msg === 'invalid user') {
              showToast('user 错误')
            } else if (res.msg === 'not recently online ') {
              showToast('玩家最近不在线')
            }
          } else if (res.code === 401) {
            if (res.msg === 'inactive event') {
              showToast('活动未开启')
            } else if (res.msg === 'repeat_request') {
              showToast('请求频繁')
            }
          }
        }
      },
    },
  })
}

// 更新任务进度
export function setPlayerTask(
  { task, value = 1 }: { task: string; value?: number },
  onSuccess: (res: any) => void,
): void {
  // if (!window.UniSDKJSBridge) {
  //   console.error('请在客户端中打开！')
  //   return
  // }
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'ngwebview_notify_native',
    reqData: {
      notification_name: 'NT_NOTIFICATION_EXTEND',
      data: {
        resource: '/internal/jingling/set_player_task',
        content: JSON.stringify({
          source_token: '',
          source_id: '',
          task,
          value,
          // user: 'b79fb400-8bc4-47d9-b9e3-1ac28f99d72b',
        }),
      },
    },
    callback: {
      nativeCallback: function (respJSONString: string) {
        console.log('签到 respJSONString: ', respJSONString)
        const reg = /"web_response":"({.*?})"/
        const match = respJSONString.match(reg)
        let res = null
        if (match) {
          let resStr = match[1]
          // fix: iOS 返回：{\"code\": 200, \"result"\: \"OK\"}
          resStr = resStr.replace(/\\/g, '')
          res = JSON.parse(resStr)
        }
        console.log('签到 res: ', res)
        if (res.code === 200) {
          onSuccess(res)
        } else {
          if (res.code === 400) {
            if (res.msg === 'invalid event') {
              showToast('活动未开启')
            } else if (res.msg === 'invalid_task') {
              showToast('task参数错误')
            } else if (res.msg === 'invalid user') {
              showToast('错误的user')
            } else if (res.result === 'Already') {
              showToast('已签到')
            }
          }
        }
      },
    },
  })
}

// 领奖
export function claimMissionReward(
  { task, event, rewardId }: { task: string; event: string; rewardId: number },
  onSuccess: (res: any) => void,
): void {
  // if (!window.UniSDKJSBridge) {
  //   console.error('请在客户端中打开！')
  //   return
  // }
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'ngwebview_notify_native',
    reqData: {
      notification_name: 'NT_NOTIFICATION_EXTEND',
      data: {
        resource: '/internal/jingling/claim_jingling_mission_reward',
        content: JSON.stringify({
          source_token: '',
          source_id: '',
          task,
          event,
          reward_id: rewardId,
          // user: 'b79fb400-8bc4-47d9-b9e3-1ac28f99d72b',
        }),
      },
    },
    callback: {
      nativeCallback: function (respJSONString: string) {
        console.log('领奖 respJSONString: ', respJSONString)
        const reg = /"web_response":"({.*?})"/
        const match = respJSONString.match(reg)
        let res = null
        if (match) {
          let resStr = match[1]
          // fix: iOS 返回：{\"code\": 200, \"result"\: \"OK\"}
          resStr = resStr.replace(/\\/g, '')
          res = JSON.parse(resStr)
        }
        console.log('领奖 res: ', res)
        if (res.code === 200) {
          onSuccess(res.rewards)
        } else {
          if (res.code === 400) {
            if (res.msg === 'invalid') {
              showToast('未满足领奖条件')
            } else if (res.msg === 'repeat_request') {
              showToast('短时间内重复请求领取同一个奖励（10s）')
            } else {
              showToast('参数相关错误')
            }
          } else if (res.code === 401) {
            showToast('活动未开启')
          } else if (res.code === 403) {
            if (res.msg === 'out of stock') {
              showToast('超出库存')
            } else if (res.msg === 'reward has already selected') {
              showToast('该奖励已选择')
            } else if (res.msg === 'already selected another') {
              showToast('已选择其他奖励')
            } else if (res.msg === 'already received the reward') {
              showToast('重复领取')
            }
          }
        }
      },
    },
  })
}

// 设置新活动状态
export function setWebRedDot(
  { event }: { event: string },
  onSuccess: (res: any) => void,
): void {
  // if (!window.UniSDKJSBridge) {
  //   console.error('请在客户端中打开！')
  //   return
  // }
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'ngwebview_notify_native',
    reqData: {
      notification_name: 'NT_NOTIFICATION_EXTEND',
      data: {
        resource: '/account/set_web_red_dot',
        content: JSON.stringify({
          event,
        }),
      },
    },
    callback: {
      nativeCallback: function (respJSONString: string) {
        console.log('设置新活动状态 respJSONString: ', respJSONString)
        const reg = /"web_response":"({.*?})"/
        const match = respJSONString.match(reg)
        let res = null
        if (match) {
          let resStr = match[1]
          // fix: iOS 返回：{\"code\": 200, \"result"\: \"OK\"}
          resStr = resStr.replace(/\\/g, '')
          res = JSON.parse(resStr)
        }
        if (res.code === 200) {
          onSuccess(res)
        } else {
          if (res.result === 'inactive event') {
            showToast('活动未开启')
          }
        }
      },
    },
  })
}
