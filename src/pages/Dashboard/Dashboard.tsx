import type { OutletContext } from './components/OutletContext'
import { Suspense, useEffect, useRef, useState } from 'react'
import { random } from '@arteli/utils'
import { defineMessages, useIntl } from 'react-intl'
import { Outlet } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { PresentationProvider } from '@/components/PresentationMenu/Presentation'
import { Navigation } from './components/Navigation'
import { DateRangeProvider } from './DateRange'

const messages = defineMessages({
  selectDashboard: { defaultMessage: 'Dashboard', id: 'hzSNj4' },
  dashboardHint: { defaultMessage: 'Overview of key metrics and actions to monitor performance.', id: 'KF/cZo' }
})

export function Dashboard() {
  const { formatMessage: t } = useIntl()
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState<string>(random.String)

  useEffect(() => {
    setKey(random.String) // Manually triggering OutletContext refresh, cause it's not working with just buttonContainerRef
  }, [buttonContainerRef])

  // TODO: DateRangeProvider should be removed, no need to have this top level context any more
  return (
    <DateRangeProvider>
      <PageHeader title={t(messages.selectDashboard)} subTitle={t(messages.dashboardHint)} />
      <PresentationProvider>
        <Container>
          <Navigation ref={buttonContainerRef} />
          <TransitionGroup>
            <Suspense>
              <Outlet context={{ buttonContainerRef, key } as OutletContext} />
            </Suspense>
          </TransitionGroup>
        </Container>
      </PresentationProvider>
    </DateRangeProvider>
  )
}
