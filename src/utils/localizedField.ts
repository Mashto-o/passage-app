/**
 * Returns the Ukrainian variant of a field if the language is 'uk' and the
 * `${field}Uk` key exists on the object; falls back to the base field.
 *
 * Example:
 *   getLocalizedField(place, 'name', 'uk')  // → place.nameUk ?? place.name
 *   getLocalizedField(place, 'address', 'en') // → place.address
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(obj: any, field: string, lang: string): string {
  if (lang === 'uk') {
    const ukVal = obj[`${field}Uk`]
    if (typeof ukVal === 'string' && ukVal !== '') return ukVal
  }
  const val = obj[field]
  return typeof val === 'string' ? val : ''
}
