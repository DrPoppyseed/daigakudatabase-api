export const isStringNumeric = (str: string): boolean => {
  if (typeof str != 'string') return false
  // @ts-ignore
  // We need to use type-coercion here, much to our dismay
  return !isNaN(str) && !isNaN(parseFloat(str))
}

export const toNumberIfNumeric = (raw: number | string): number | null => {
  if (typeof raw === 'number') return raw
  else if (typeof raw === 'string' && isStringNumeric(raw))
    return parseInt(raw, 10)
  else return null
}
