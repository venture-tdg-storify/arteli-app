import type { TenantSettings } from '@/api/types.generated'

export const tenantSettings: TenantSettings = {
  actionOverdueDays: 30,
  powerBiReports: [
    {
      name: 'Monthly Performance Report',
      url: 'https://monthlyperformancereport.com'
    }
  ],
  recentlyAddedThresholdDays: 30,
  recentlyRemovedThresholdDays: 30,
  uiConfig: {
    selectWebApp: {
      recommendationUiDisplay: {
        '22.PT.AX': false,
        '23.PT.AX': true
      },
      recommendationUiFilters: {
        '22.PT.AX': [],
        '23.PT.AX': ['Add', 'Remove']
      },
      seriesPerformanceReportUI: { showRemoved: false }
    }
  }
}
