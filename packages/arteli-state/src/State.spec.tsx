import { act } from 'react'
import { random } from '@arteli/utils'
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { State } from './State'

type User = { name: string; age: number }

describe('State', () => {
  const initialUser: User = { name: random.String, age: random.Number }

  test('inits', async () => {
    const userState = new State<User>(initialUser)

    expect(userState.get('name')).toBe(initialUser.name)
    expect(userState.get('age')).toBe(initialUser.age)
  })

  test('sets values', async () => {
    const userState = new State<User>(initialUser)

    const callback = vi.fn()

    userState.subscribe(callback)

    const name = random.String

    userState.set('name', name)

    expect(userState.get('name')).toBe(name)
    expect(callback).toHaveBeenCalledWith('name', name)
  })

  test('snapshot', async () => {
    const userState = new State<User>(initialUser)

    const getSnapshot = userState.getSnapshot

    expect(getSnapshot()).toEqual(initialUser)
  })

  test('setState', () => {
    const userState = new State<User>(initialUser)
    const user: User = { name: random.String, age: random.Number }

    userState.setState(user)

    expect(userState.getSnapshot()).toEqual(user)
  })

  const serialize = (data: unknown) => JSON.stringify(data)

  test('use', async () => {
    const userState = new State<User>(initialUser)

    const Component = () => {
      const user = userState.use()

      return <div data-testid="custom-element">{serialize(user)}</div>
    }

    render(<Component />)

    expect(screen.getByTestId('custom-element').textContent).toEqual(serialize(userState.getSnapshot()))

    act(() => {
      userState.set('name', random.String)
      userState.set('age', random.Number)
    })

    expect(screen.getByTestId('custom-element').textContent).toEqual(serialize(userState.getSnapshot()))
  })
})
