// 定义邀请码响应接口
export interface InviteInfoRes {
  code: number
  can_bind: boolean
  my_code: string
  bind_code: string
}

// 定义绑定邀请码响应接口
export interface AcceptInviteRes {
  code: number
  invitation_code: string
  msg: string
}
