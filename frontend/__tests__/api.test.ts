import {
  backendAssetUrl,
  displayClassification,
  fetchAnalysisJob,
  fetchResult,
  fetchResults,
  uploadSample,
} from '../lib/api'

describe('backend API client', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('builds backend asset URLs', () => {
    expect(backendAssetUrl('/assets/uploads/sample.png')).toBe('/backend-assets/uploads/sample.png')
    expect(backendAssetUrl('https://example.com/sample.png')).toBe('https://example.com/sample.png')
  })

  it('formats backend enum labels for display', () => {
    expect(displayClassification('suspicious')).toBe('Suspicious')
  })

  it('uploads samples as multipart form data', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ job_id: 'job-1', sample_id: 'sample-1', status: 'queued', result_id: null }),
    })
    global.fetch = fetchMock

    const file = new File(['image'], 'sample.png', { type: 'image/png' })
    const response = await uploadSample(file, 'Dr. Rivera')

    expect(response.job_id).toBe('job-1')
    expect(fetchMock).toHaveBeenCalledWith(
      '/backend-api/api/samples',
      expect.objectContaining({ method: 'POST', body: expect.any(FormData) }),
    )
  })

  it('fetches analysis jobs and results', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'result-1' }),
    })
    global.fetch = fetchMock

    await fetchAnalysisJob('job-1')
    await fetchResults()
    await fetchResult('result-1')

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/backend-api/api/analysis-jobs/job-1',
      expect.any(Object),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/backend-api/api/results',
      expect.any(Object),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/backend-api/api/results/result-1',
      expect.any(Object),
    )
  })
})
