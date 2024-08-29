interface Coordinate {
  x: number
  y: number
  direction: 'left' | 'right' | 'front' | 'back'
}

// 动画名称
// right_idle, right_move, left_idle, left_move, front_idle, front_move, back_idle, back_move
export const ANIMATION = {
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
export const coordinates: Coordinate[] = [
  // 0
  {
    x: 364,
    y: 965,
    direction: 'right',
  },
  // 1
  {
    x: 520,
    y: 962,
    direction: 'right',
  },
  // 2
  {
    x: 677,
    y: 959,
    direction: 'right',
  },
  // 3
  {
    x: 834,
    y: 956,
    direction: 'right',
  },
  // 4
  {
    x: 989,
    y: 953,
    direction: 'right',
  },
  // 5
  {
    x: 1143,
    y: 949,
    direction: 'right',
  },
  // 6
  {
    x: 1296,
    y: 946,
    direction: 'right',
  },
  // 7
  {
    x: 1448,
    y: 942,
    direction: 'right',
  },
  // 8
  {
    x: 1600,
    y: 941,
    direction: 'right',
  },
  // 9
  {
    x: 1750,
    y: 937,
    direction: 'front',
  },
  // 10
  {
    x: 1737,
    y: 839,
    direction: 'front',
  },
  // 11
  {
    x: 1723,
    y: 745,
    direction: 'front',
  },
  // 12
  {
    x: 1709,
    y: 654,
    direction: 'front',
  },
  // 13
  {
    x: 1697,
    y: 570,
    direction: 'front',
  },
  // 14
  {
    x: 1684,
    y: 479,
    direction: 'front',
  },
  // 15
  {
    x: 1673,
    y: 397,
    direction: 'front',
  },
  // 16
  {
    x: 1661,
    y: 316,
    direction: 'front',
  },
  // 17
  {
    x: 1649,
    y: 236,
    direction: 'front',
  },
  // 18
  {
    x: 1639,
    y: 161,
    direction: 'left',
  },
  // 19
  {
    x: 1507,
    y: 161,
    direction: 'left',
  },
  // 20
  {
    x: 1375,
    y: 162,
    direction: 'left',
  },
  // 21
  {
    x: 1242,
    y: 163,
    direction: 'left',
  },
  // 22
  {
    x: 1109,
    y: 164,
    direction: 'left',
  },
  // 23
  {
    x: 975,
    y: 165,
    direction: 'left',
  },
  // 24
  {
    x: 838,
    y: 166,
    direction: 'left',
  },
  // 25
  {
    x: 705,
    y: 167,
    direction: 'left',
  },
  // 26
  {
    x: 568,
    y: 167,
    direction: 'left',
  },
  // 27
  {
    x: 432,
    y: 168,
    direction: 'back',
  },
  // 28
  {
    x: 425,
    y: 246,
    direction: 'back',
  },
  // 29
  {
    x: 418,
    y: 325,
    direction: 'back',
  },
  // 30
  {
    x: 411,
    y: 409,
    direction: 'back',
  },
  // 31
  {
    x: 404,
    y: 494,
    direction: 'back',
  },
  // 32
  {
    x: 396,
    y: 583,
    direction: 'back',
  },
  // 33
  {
    x: 388,
    y: 674,
    direction: 'back',
  },
  // 34
  {
    x: 380,
    y: 768,
    direction: 'back',
  },
  // 35
  {
    x: 372,
    y: 865,
    direction: 'back',
  },
  // 36
  {
    x: 1438,
    y: 844,
    direction: 'front',
  },
  // 37
  {
    x: 1429,
    y: 750,
    direction: 'front',
  },
  // 38
  {
    x: 1420,
    y: 658,
    direction: 'front',
  },
  // 39
  {
    x: 1412,
    y: 570,
    direction: 'left',
  },
  // 40
  {
    x: 1269,
    y: 571,
    direction: 'left',
  },
  // 41
  {
    x: 1125,
    y: 573,
    direction: 'left',
  },
  // 42
  {
    x: 981,
    y: 575,
    direction: 'left',
  },
  // 43
  {
    x: 832,
    y: 576,
    direction: 'front',
  },
  // 44
  {
    x: 836,
    y: 489,
    direction: 'front',
  },
  // 45
  {
    x: 837,
    y: 405,
    direction: 'right',
  },
  // 46
  {
    x: 978,
    y: 404,
    direction: 'right',
  },
  // 47
  {
    x: 1118,
    y: 401,
    direction: 'front',
  },
  // 48
  {
    x: 1114,
    y: 320,
    direction: 'front',
  },
  // 49
  {
    x: 1111,
    y: 241,
    direction: 'front',
  },
]

// 路线
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

export const animationListIdle = animationList.filter((animation) =>
  animation.includes('idle'),
)

export const animationListMove = animationList.filter((animation) =>
  animation.includes('move'),
)

// export const directions = {
//   right: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//   front: [9, 10, 11, 12, 13, 14, 15, 16, 17],
//   left: [18, 19, 20, 21, 22, 23, 24, 25, 26],
//   back: [27, 28, 29, 30, 31, 32, 33, 34, 35],
// }
