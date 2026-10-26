export function reportRequest(days: number) {
  const period = [7, 30, 90].includes(days) ? days : 30;
  const dateRanges = [{ startDate: `${period - 1}daysAgo`, endDate: 'today' }];
  return { requests: [
    { dateRanges, metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }] },
    { dateRanges, dimensions: [{ name: 'country' }], metrics: [{ name: 'totalUsers' }], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: '10000' },
  ] };
}
type Row = { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] };
type Report = { rows?: Row[]; metadata?: { subjectToThresholding?: boolean; samplingMetadatas?: unknown[] } };
export function parseReport(data: { reports?: Report[] }) {
  if (!Array.isArray(data.reports) || data.reports.length !== 2) throw new Error('Google returned an incomplete report. Please try again.');
  const count = (value?: string) => {
    const number = Number(value || 0);
    if (!Number.isFinite(number) || number < 0) throw new Error('Google returned an invalid visitor count.');
    return number;
  };
  return {
    totals: [0, 1, 2].map(index => count(data.reports![0].rows?.[0]?.metricValues?.[index]?.value)),
    countries: (data.reports[1].rows || []).map(row => ({ country: row.dimensionValues?.[0]?.value === '(not set)' ? 'Unknown country' : row.dimensionValues?.[0]?.value || 'Unknown country', users: count(row.metricValues?.[0]?.value) })),
    limited: data.reports.some(report => report.metadata?.subjectToThresholding || report.metadata?.samplingMetadatas?.length),
  };
}
