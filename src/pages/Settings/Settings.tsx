import type { OutletContext } from './components/OutletContext'
import { Suspense, useEffect, useRef, useState } from 'react'
import { random } from '@arteli/utils'
import { styled } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import { Navigation } from './components/Navigation'

const Container = styled('div', { name: 'Container' })(({ theme: { sizes, spacing } }) => ({
  padding: spacing(10, 4),
  marginRight: 0,
  marginLeft: spacing(41),
  height: `calc(100vh - ${sizes.header.height + 1}px)`,
  width: `calc(100vw - ${spacing(50)}px)`,
  overflowY: 'auto',
  position: 'relative'
}))

export function Settings() {
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState<string>(random.String)

  useEffect(() => {
    setKey(random.String)
  }, [buttonContainerRef])

  return (
    <>
      <Navigation />
      <Container>
        <TransitionGroup>
          <Suspense>
            <Outlet context={{ buttonContainerRef, key } as OutletContext} />
          </Suspense>
        </TransitionGroup>
      </Container>
    </>
  )
}
