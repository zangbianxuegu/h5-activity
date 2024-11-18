export interface TokenParams {
  game_uid: string
  uid: string
  map: string
  return_buff: string
  os: string
  refer?: string
  source: string
}

export interface Response {
  code: number
  msg: string
  data: any
}

export type ServeResponse = Response | null

export interface PostMsgParams {
  type: string
  resource?: string
  content?: any
  handleRes: (data: any) => void
}
