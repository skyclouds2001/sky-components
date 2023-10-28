export const normalizeCSSValue = (value: number | string, unit = 'px'): string => {
  return typeof value === 'number' ? value.toString() + unit : value
}
