import { Suspense } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { Outlet, useParams } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { PresentationProvider } from '@/components/PresentationMenu/Presentation'
import { useActiveActionSet } from '@/hooks/useActiveActionSet'
import { FiltersProvider } from '@/store/FiltersContext'
import { commonMessages } from '@/utils/messages'
import PlanList from './components/PlanList'
import PlanSummary from './components/PlanSummary'

const messages = defineMessages({
  draftAnActionSet: {
    defaultMessage: 'View and edit the contents of the plan. Finalize and download when complete.',
    id: 'R7nYBc'
  }
})

export const Plan = () => {
  const { formatMessage: t } = useIntl()
  const { id = 'active' } = useParams()
  const { actionSet, rows, isFetching } = useActiveActionSet({ id })

  return (
    <>
      <PageHeader
        title={t(commonMessages.plan)}
        subTitle={
          <Stack alignItems="flex-end" direction="row" height="100%" justifyContent="flex-end" flexGrow="1">
            <Typography>
              <FormattedMessage {...messages.draftAnActionSet} />
            </Typography>
          </Stack>
        }
      />
      <FiltersProvider>
        <TransitionGroup>
          <Suspense>
            <Outlet />
          </Suspense>
        </TransitionGroup>
        <Container>
          <PresentationProvider>
            <PlanSummary actionSet={actionSet} rows={rows} isFetching={isFetching} />
            <PlanList actionSet={actionSet} rows={rows} isFetching={isFetching} />
          </PresentationProvider>
        </Container>
      </FiltersProvider>
    </>
  )
}
