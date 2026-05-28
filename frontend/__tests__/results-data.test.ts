import { resultsData, resultsById } from '../lib/results-data'

describe('results-data', () => {
  it('contains at least one result', () => {
    expect(resultsData.length).toBeGreaterThan(0)
  })

  it('each result has required fields', () => {
    for (const r of resultsData) {
      expect(r.id).toBeDefined()
      expect(r.sampleId).toBeDefined()
      expect(r.classification).toMatch(/^(Positive|Negative)$/)
      expect(r.confidence).toBeGreaterThanOrEqual(0)
      expect(r.confidence).toBeLessThanOrEqual(100)
      expect(r.imageUrl).toBeDefined()
    }
  })

  it('resultsById maps every result by id', () => {
    for (const r of resultsData) {
      expect(resultsById[r.id]).toBe(r)
    }
  })

  it('has no duplicate ids', () => {
    const ids = resultsData.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
