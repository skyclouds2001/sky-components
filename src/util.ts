export const CSSValueToNumber = (length: string): number => {
  return Number.parseInt(length)
}

export const NumberToCSSValue = (number: number, unit = 'px'): string => {
  return number.toString() + unit
}
