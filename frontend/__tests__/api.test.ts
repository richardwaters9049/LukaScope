import {
  backendAssetUrl,
  createTrainingRun,
  displayClassification,
  fetchAnalysisJob,
  fetchResult,
  fetchResults,
  fetchTrainingRun,
  uploadSample,
} from '../lib/api'

describe('backend API client', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('builds backend asset URLs', () => {
    expect(backendAssetUrl('/assets/uploads/sample.png')).toBe('http://localhost:3001/assets/uploads/sample.png')
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
      'http://localhost:3001/api/samples',
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
      'http://localhost:3001/api/analysis-jobs/job-1',
      expect.any(Object),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/api/results',
      expect.any(Object),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'http://localhost:3001/api/results/result-1',
      expect.any(Object),
    )
  })

  it('creates and fetches training runs', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ training_run_id: 'run-1', status: 'queued' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'run-1',
          status: 'completed',
          candidate_model_version: 'candidate-run-1',
          approved_sample_count: 1,
          metrics: { requires_clinical_validation: true },
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        }),
      })
    global.fetch = fetchMock

    const created = await createTrainingRun()
    const trainingRun = await fetchTrainingRun(created.training_run_id)

    expect(created.training_run_id).toBe('run-1')
    expect(trainingRun.status).toBe('completed')
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3001/api/training-runs',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/api/training-runs/run-1',
      expect.any(Object),
    )
  })
})
