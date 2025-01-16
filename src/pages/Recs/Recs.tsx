import { Suspense } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FormattedDate, FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { Outlet, NavLink } from 'react-router-dom'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import Summary from '@/components/Summary'
import { useActiveRecommendationSet } from '@/hooks/arteli'
import { PATH_ACTIVE_ACTION_SET, PATH_BUSINESS_MONITOR } from '@/routes'
import { FiltersProvider } from '@/store/FiltersContext'
import { commonMessages } from '@/utils/messages'
import { RecommendationsFilters } from './components/RecommendationsFilters'
import { RecommendationsList } from './components/RecommendationsList/RecommendationsList'
import { useSummary } from './useSummary'

const messages = defineMessages({
  recommendationRelease: {
    defaultMessage: 'Data updates occur regularly to reflect ongoing improvements in our algorithm.',
    id: 'EMAjtR'
  },
  overview: { defaultMessage: 'Select recommendations for store plans.', id: 'GaOQEJ' },
  viewPlan: { defaultMessage: 'View Plan', id: 'tTq3Uk' },
  recommendationsSummary: { defaultMessage: 'Recommendations Summary', id: 'Tq04PM' },
  approvedRecommendations: { defaultMessage: 'Approved Recommendations', id: 'R/jX/Z' },
  noItemsAdded: { defaultMessage: 'No items have been added to the Plan', id: '7l9ef4' },
  addRecommendations: {
    defaultMessage: 'Approve recommendations to see a summary of what is in your plan.',
    id: '1Ds+Wy'
  },
  noActionSetData: { defaultMessage: 'No recommendation data available', id: 'mo1O85' }, // TODO: Define this case in Figma
  predictionUpdatedAsOf: { defaultMessage: 'Predicted values are using sales data through', id: '2WDSU0' }
})

export const Recs = () => {
  const { formatMessage: t } = useIntl()
  const { summary, isFetching: isFetchingSummary } = useSummary()
  const { data: recommendationSet } = useActiveRecommendationSet()

  return (
    <>
      <PageHeader
        title={t(commonMessages.recommendations)}
        subTitle={
          <Stack alignItems="flex-end" direction="row" height="100%" justifyContent="flex-end" flexGrow="1">
            <Typography>
              <FormattedMessage {...messages.overview} />
            </Typography>
            <Typography sx={() => ({ fontSize: 16, ml: 1 })}>
              <FormattedMessage {...messages.recommendationRelease} />
            </Typography>
          </Stack>
        }
      >
        {recommendationSet && (
          <Typography sx={({ palette }) => ({ fontSize: 14, color: palette.text.tertiary, marginLeft: 'auto' })}>
            <FormattedMessage {...messages.predictionUpdatedAsOf} />{' '}
            <FormattedDate value={recommendationSet?.predictionsTimestamp} />
          </Typography>
        )}
      </PageHeader>
      <FiltersProvider>
        <TransitionGroup>
          <Suspense>
            <Outlet />
          </Suspense>
        </TransitionGroup>
        <Container>
          <Summary
            total={summary.total}
            count={summary.count}
            isFetching={isFetchingSummary}
            predictedImpact={summary.predictedImpact}
            title={<FormattedMessage {...messages.recommendationsSummary} />}
            label={<FormattedMessage {...messages.approvedRecommendations} />}
            emptyTitle={<FormattedMessage {...messages.noItemsAdded} />}
            emptyDescription={<FormattedMessage {...messages.addRecommendations} />}
            updatedAt={summary.updatedAt}
            additionAction={
              <IconButton component={NavLink} to={PATH_BUSINESS_MONITOR}>
                <Icon className="fa-ellipsis-vertical" />
              </IconButton>
            }
          >
            <Button
              color="primary"
              variant="outlined"
              sx={{ ml: 'auto' }}
              component={NavLink}
              to={PATH_ACTIVE_ACTION_SET}
            >
              <FormattedMessage {...messages.viewPlan} />
            </Button>
          </Summary>
          <RecommendationsFilters />
          <RecommendationsList />
        </Container>
      </FiltersProvider>
    </>
  )
}
