import { State } from '@arteli/state'

type Tab = {
  visible: boolean
}

export const tab = new State<Tab>({ visible: document.visibilityState === 'visible' })

document.addEventListener('visibilitychange', () => {
  tab.set('visible', document.visibilityState === 'visible')
})
