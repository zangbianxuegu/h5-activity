interface Coordinate {
  x: number
  y: number
  direction: 'left' | 'right' | 'front' | 'back'
}

// 动画名称
// right_idle, right_move, left_idle, left_move, front_idle, front_move, back_idle, back_move
export const ANIMATION: Record<string, Animation> = {
  LEFT_IDLE: 'left_idle',
  RIGHT_IDLE: 'right_idle',
  FRONT_IDLE: 'front_idle',
  BACK_IDLE: 'back_idle',
  LEFT_MOVE: 'left_move',
  RIGHT_MOVE: 'right_move',
  FRONT_MOVE: 'front_move',
  BACK_MOVE: 'back_move',
}

// 坐标位置
// 每个格子的中心位置
export const coordinates: Coordinate[] = [
  // 0
  {
    x: 320,
    y: 986,
    direction: 'right',
  },
  // 1
  {
    x: 480,
    y: 986,
    direction: 'right',
  },
  // 2
  {
    x: 640,
    y: 986,
    direction: 'right',
  },
  // 3
  {
    x: 800,
    y: 986,
    direction: 'right',
  },
  // 4
  {
    x: 960,
    y: 986,
    direction: 'right',
  },
  // 5
  {
    x: 1120,
    y: 986,
    direction: 'right',
  },
  // 6
  {
    x: 1280,
    y: 986,
    direction: 'right',
  },
  // 7
  {
    x: 1440,
    y: 986,
    direction: 'right',
  },
  // 8
  {
    x: 1600,
    y: 986,
    direction: 'right',
  },
  // 9
  {
    x: 1760,
    y: 986,
    direction: 'front',
  },
  // 10
  {
    x: 1760,
    y: 892,
    direction: 'front',
  },
  // 11
  {
    x: 1760,
    y: 798,
    direction: 'front',
  },
  // 12
  {
    x: 1760,
    y: 704,
    direction: 'front',
  },
  // 13
  {
    x: 1760,
    y: 610,
    direction: 'front',
  },
  // 14
  {
    x: 1760,
    y: 516,
    direction: 'front',
  },
  // 15
  {
    x: 1760,
    y: 422,
    direction: 'front',
  },
  // 16
  {
    x: 1760,
    y: 328,
    direction: 'front',
  },
  // 17
  {
    x: 1760,
    y: 234,
    direction: 'front',
  },
  // 18
  {
    x: 1760,
    y: 140,
    direction: 'left',
  },
  // 19
  {
    x: 1600,
    y: 140,
    direction: 'left',
  },
  // 20
  {
    x: 1440,
    y: 140,
    direction: 'left',
  },
  // 21
  {
    x: 1280,
    y: 140,
    direction: 'left',
  },
  // 22
  {
    x: 1120,
    y: 140,
    direction: 'left',
  },
  // 23
  {
    x: 960,
    y: 140,
    direction: 'left',
  },
  // 24
  {
    x: 800,
    y: 140,
    direction: 'left',
  },
  // 25
  {
    x: 640,
    y: 140,
    direction: 'left',
  },
  // 26
  {
    x: 480,
    y: 140,
    direction: 'left',
  },
  // 27
  {
    x: 320,
    y: 140,
    direction: 'back',
  },
  // 28
  {
    x: 320,
    y: 234,
    direction: 'back',
  },
  // 29
  {
    x: 320,
    y: 328,
    direction: 'back',
  },
  // 30
  {
    x: 320,
    y: 422,
    direction: 'back',
  },
  // 31
  {
    x: 320,
    y: 516,
    direction: 'back',
  },
  // 32
  {
    x: 320,
    y: 610,
    direction: 'back',
  },
  // 33
  {
    x: 320,
    y: 704,
    direction: 'back',
  },
  // 34
  {
    x: 320,
    y: 798,
    direction: 'back',
  },
  // 35
  {
    x: 320,
    y: 892,
    direction: 'back',
  },
  // 36
  {
    x: 1440,
    y: 892,
    direction: 'front',
  },
  // 37
  {
    x: 1440,
    y: 798,
    direction: 'front',
  },
  // 38
  {
    x: 1440,
    y: 704,
    direction: 'front',
  },
  // 39
  {
    x: 1440,
    y: 610,
    direction: 'left',
  },
  // 40
  {
    x: 1280,
    y: 610,
    direction: 'left',
  },
  // 41
  {
    x: 1120,
    y: 610,
    direction: 'left',
  },
  // 42
  {
    x: 960,
    y: 610,
    direction: 'left',
  },
  // 43
  {
    x: 800,
    y: 610,
    direction: 'front',
  },
  // 44
  {
    x: 800,
    y: 516,
    direction: 'front',
  },
  // 45
  {
    x: 800,
    y: 422,
    direction: 'right',
  },
  // 46
  {
    x: 960,
    y: 422,
    direction: 'right',
  },
  // 47
  {
    x: 1120,
    y: 422,
    direction: 'front',
  },
  // 48
  {
    x: 1120,
    y: 328,
    direction: 'front',
  },
  // 49
  {
    x: 1120,
    y: 234,
    direction: 'front',
  },
]

// 路线
export type Route = 'A' | 'B'

export const routes = {
  A: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  ],
  B: [
    0, 1, 2, 3, 4, 5, 6, 7, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  ],
}

// 角色动画尺寸
export const animateSkySizes = {
  right_idle: {
    width: 127,
    height: 185,
  },
  right_move: {
    width: 295,
    height: 222,
  },
  left_idle: {
    width: 122,
    height: 125,
  },
  left_move: {
    width: 246,
    height: 156,
  },
  front_idle: {
    width: 128,
    height: 152,
  },
  front_move: {
    width: 161,
    height: 268,
  },
  back_idle: {
    width: 162,
    height: 129,
  },
  back_move: {
    width: 204,
    height: 224,
  },
}

export type Animation = keyof typeof animateSkySizes

export const animationList = Object.keys(animateSkySizes) as Animation[]

// 是否为空闲动画
export function isIdle(
  animation: Animation,
): animation is `${'right' | 'left' | 'front' | 'back'}_idle` {
  return animation.endsWith('_idle')
}

// 方向
export const directions = {
  right: [0, 1, 2, 3, 4, 5, 6, 7, 8, 45, 46],
  front: [9, 10, 11, 12, 13, 14, 15, 16, 17, 36, 37, 38, 43, 44, 47, 48, 49],
  left: [18, 19, 20, 21, 22, 23, 24, 25, 26, 39, 40, 41, 42],
  back: [27, 28, 29, 30, 31, 32, 33, 34, 35],
}

// 地图奖励
export const mapRewards = {}
