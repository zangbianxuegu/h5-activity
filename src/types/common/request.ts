export interface TokenParams {
  game_uid: string
  uid: string
  login_from: string
  map: string
  return_buff: string
  os: string
}

export interface Response {
  code: number
  msg: string
  data: any
}

export interface PostMsgParams {
  type: string
  resource?: string
  content?: any
  handleRes: (data: any) => void
}
