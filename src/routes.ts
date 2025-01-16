import type { TenantUser } from '$/api/system'
import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { TenantUserRoles } from '$/api/types.generated'

const EditSwapNote = lazy(() => import('@/pages/Plan/components/EditSwapNote'))
const EditSwapProducts = lazy(() => import('@/pages/Plan/components/EditSwapProducts'))
const EditSwap = lazy(() => import('@/pages/Plan/components/EditSwap'))
const DeleteSwap = lazy(() => import('@/pages/Plan/components/DeleteSwap'))
const ManualSwap = lazy(() => import('@/pages/Plan/components/ManualSwap'))
const LiveView = lazy(() => import('@/components/LiveView'))
const SwapSummaryModal = lazy(() => import('@/components/SwapSummaryModal'))
const Recommendations = lazy(() => import('@/pages/Recs'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const Auth = lazy(() => import('@/pages/Auth'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Plan = lazy(() => import('@/pages/Plan'))
const GroupDetailsPanel = lazy(() => import('@/pages/Recs/components/GroupDetailsPanel'))
const BusinessMonitor = lazy(() => import('@/pages/Recs/components/BusinessMonitor'))
const RejectionPanel = lazy(() => import('@/pages/Recs/components/RejectionPanel'))
const HistoricalSwaps = lazy(() => import('@/pages/Dashboard/components/HistoricalSwaps'))
const Performance = lazy(() => import('@/pages/Dashboard/components/Performance'))
const ActionSetList = lazy(() => import('@/pages/Dashboard/components/ActionSetList'))
const Reports = lazy(() => import('@/pages/Dashboard/components/Reports'))
const FileUploadCenter = lazy(() => import('@/pages/FileUploadCenter'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const PlanSettings = lazy(() => import('@/pages/Settings/components/PlanSettings'))
const DashboardSettings = lazy(() => import('@/pages/Settings/components/DashboardSettings'))
const BusinessRules = lazy(() => import('@/pages/Settings/components/BusinessRules'))
const SeriesReports = lazy(() => import('@/pages/Dashboard/components/SeriesPerformance'))

export const PATH_ACTIVE_ACTION_SET = '/action-set'
export const PATH_RECOMMENDATIONS_BY_TYPE = '/recommendations/:actionType'
export const PATH_RECOMMENDATIONS_ADD = '/recommendations/Add'
export const PATH_RECOMMENDATIONS_REMOVE = '/recommendations/Remove'
export const PATH_LIVE_VIEW = 'live-view/:liveViewStoreId'
export const PATH_SWAP = ':groupId/swap'
export const PATH_MANUAL_SWAP = 'manual-swap'
export const PATH_EDIT_NOTES = 'edit-notes'
export const PATH_EDIT_PRODUCTS = 'edit-products'
export const PATH_EDIT_SWAP = 'edit-swap/:actionType'
export const PATH_DELETE_SWAP = 'delete-swap/:actionStoreId'
export const PATH_REJECT = ':groupId/reject'
export const PATH_GROUPS = ':groupId'
export const PATH_GROUP_NOTES = ':groupId/:tab'
export const PATH_HOME = '/'
export const PATH_PROFILE = '/profile'
export const PATH_SETTINGS = '/settings'
export const PATH_SETTINGS_PLAN = '/settings/plan'
export const PATH_SETTINGS_RECOMMENDATIONS = '/settings/recommendations'
export const PATH_PROGRESS_REPORT = '/progress-report'
export const PATH_REPORTS = '/performance'
export const PATH_DOWNLOADS = '/downloads'
export const PATH_FILE_UPLOAD_CENTER = '/upload-center'
export const PATH_BUSINESS_MONITOR = 'business-monitor'
export const PATH_SERIES_REPORT = '/series-report'

const commonRoutes: RouteObject[] = [{ path: PATH_PROFILE, Component: Profile }]

export const routes = (tenantUser: TenantUser): RouteObject[] => [
  ...commonRoutes,
  ...((tenantUser?.roles ?? TenantUserRoles.None) & TenantUserRoles.TenantSettingsManagement
    ? [
        {
          path: PATH_SETTINGS,
          Component: Settings,
          children: [
            { path: PATH_SETTINGS_PLAN, Component: PlanSettings },
            { path: PATH_SETTINGS_RECOMMENDATIONS, Component: BusinessRules },
            { index: true, Component: DashboardSettings }
          ]
        }
      ]
    : []),
  ...((tenantUser?.roles ?? TenantUserRoles.None) & TenantUserRoles.UserJobManagement
    ? [{ path: PATH_FILE_UPLOAD_CENTER, Component: FileUploadCenter }]
    : []),
  {
    path: PATH_HOME,
    Component: Dashboard,
    children: [
      {
        path: PATH_PROGRESS_REPORT,
        Component: HistoricalSwaps,
        children: [
          {
            path: PATH_LIVE_VIEW,
            Component: LiveView
          }
        ]
      },
      { path: PATH_REPORTS, Component: Reports },
      { path: PATH_DOWNLOADS, Component: ActionSetList },
      { path: PATH_SERIES_REPORT, Component: SeriesReports },
      { index: true, Component: Performance }
    ]
  },
  {
    path: PATH_RECOMMENDATIONS_BY_TYPE,
    Component: Recommendations,
    children: [
      {
        path: PATH_SWAP,
        Component: SwapSummaryModal,
        children: [
          {
            path: PATH_BUSINESS_MONITOR,
            Component: BusinessMonitor
          },
          {
            path: PATH_LIVE_VIEW,
            Component: LiveView
          }
        ]
      },
      {
        path: PATH_REJECT,
        Component: RejectionPanel
      },
      {
        path: PATH_GROUPS,
        Component: GroupDetailsPanel
      },
      {
        path: PATH_GROUP_NOTES,
        Component: GroupDetailsPanel
      },
      {
        path: PATH_LIVE_VIEW,
        Component: LiveView
      },
      {
        path: PATH_BUSINESS_MONITOR,
        Component: BusinessMonitor
      }
    ]
  },
  {
    index: true,
    Component: Dashboard
  },
  {
    path: PATH_ACTIVE_ACTION_SET,
    Component: Plan,
    children: [
      {
        path: PATH_SWAP,
        Component: SwapSummaryModal,
        children: [
          {
            path: PATH_BUSINESS_MONITOR,
            Component: BusinessMonitor
          },
          {
            path: PATH_LIVE_VIEW,
            Component: LiveView
          }
        ]
      },
      {
        path: PATH_MANUAL_SWAP,
        Component: ManualSwap
      },
      {
        path: PATH_EDIT_SWAP,
        Component: EditSwap
      },

      {
        path: PATH_EDIT_NOTES,
        Component: EditSwapNote
      },
      {
        path: PATH_EDIT_PRODUCTS,
        Component: EditSwapProducts
      },
      {
        path: PATH_DELETE_SWAP,
        Component: DeleteSwap
      },
      {
        path: PATH_LIVE_VIEW,
        Component: LiveView
      },
      {
        path: PATH_BUSINESS_MONITOR,
        Component: BusinessMonitor
      }
    ]
  },
  {
    path: '*', // catch all
    Component: NotFound
  }
]

export const publicRoutes = [{ path: 'auth', Component: Auth }]
