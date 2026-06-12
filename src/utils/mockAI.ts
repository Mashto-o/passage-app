// Placeholder for a real AI/vision model call
export function analyzePhoto(sectionId: 'entrance' | 'toilet' | 'inside'): {
  accessibility: 'accessible' | 'partiallyAccessible' | 'inaccessible'
  answers: boolean[]
} {
  const seed = Math.abs((Date.now() % 997) ^ (sectionId.charCodeAt(0) * 13))
  const accessibilityOptions = ['accessible', 'partiallyAccessible', 'inaccessible'] as const
  const accessibility = accessibilityOptions[seed % 3]

  const questionCounts: Record<typeof sectionId, number> = { entrance: 4, toilet: 3, inside: 3 }
  const count = questionCounts[sectionId]

  let answers: boolean[]
  if (accessibility === 'accessible') {
    answers = Array.from({ length: count }, () => true)
  } else if (accessibility === 'inaccessible') {
    answers = Array.from({ length: count }, () => false)
  } else {
    // partiallyAccessible: first half true (round down), second half false
    const trueCount = Math.floor(count / 2)
    answers = Array.from({ length: count }, (_, i) => i < trueCount)
  }

  return { accessibility, answers }
}
