export type Word = {
  word: string
  puzzleNumber: number
}

export type ValidWord = {
  word: string
  validWord: boolean
}

export interface Map {
  [key: string]: number
}
