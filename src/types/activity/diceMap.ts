export interface MoveInfo {
  user: string
  cur_pos: number
  dice_type: string
  dice_value: number
  choices: Record<string, number> | null
}

interface Reward {
  name: string
  count: number
  code?: string
}
export type Rewards = Reward[]

interface HeyteaReward {
  type: string
  code: string
}

export type HeyteaRewards = HeyteaReward[]

export type DiceType = 'random_dice' | 'custom_dice'
