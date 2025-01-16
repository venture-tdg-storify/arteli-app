import { State } from '@arteli/state'
import { random } from '@arteli/utils'

type SnackType = 'success' | 'error' | 'warning' | 'info'

type OnCloseCallaback = () => void

type Snack = {
  id?: string | number
  message: string
  timeout?: number
  type: SnackType
  onClose?: OnCloseCallaback
}

const DEFAULT_TIMEOUT = 6e3

type Notifications = { snacks: Snack[] }

export const notifications = new State<Notifications>({
  snacks: []
})

export const addSnack = (snack: Snack) => {
  snack.id = snack.id ?? random.String
  snack.timeout = snack.timeout || DEFAULT_TIMEOUT

  notifications.set('snacks', [...notifications.get('snacks'), snack])

  if (snack.timeout) {
    setTimeout(() => removeSnack(snack.id), snack.timeout)
  }
}

const typedSnack =
  (type: SnackType) =>
  (message: string, { timeout, onClose }: Pick<Snack, 'onClose' | 'timeout'> = {}) =>
    addSnack({ message, type, timeout, onClose })

export const toast = {
  Success: typedSnack('success'),
  Info: typedSnack('info'),
  Warning: typedSnack('warning'),
  Error: typedSnack('error')
}

export const removeSnack = (id: Snack['id']) => {
  const snacks = notifications.get('snacks')

  const snackToRemove = snacks.find((snack) => snack.id === id)

  if (!snackToRemove) return

  notifications.set(
    'snacks',
    snacks.filter((snack) => snack.id !== id)
  )

  if (snackToRemove.onClose) snackToRemove.onClose()
}
