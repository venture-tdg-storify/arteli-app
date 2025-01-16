import React, { useCallback, useMemo, useRef, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from '@mui/material/Icon'
import TextField from '@mui/material/TextField'
import { defineMessages, useIntl } from 'react-intl'

function useDebounce(callback: (input: string) => void, delay: number) {
  const timer = useRef<NodeJS.Timeout>()

  const debounce = (input: string) => {
    const newTimer = setTimeout(() => {
      callback(input)
    }, delay)
    clearTimeout(timer.current)
    timer.current = newTimer
  }

  return { debounce }
}

const messages = defineMessages({
  placeholder: { defaultMessage: 'Search Series Name, Series ID', id: 'iOUYji' },
  short: { defaultMessage: 'Type more characters..', id: 'PeUSVk' },
  searching: { defaultMessage: 'Searching...', id: 'NNQzoi' },
  invalid: { defaultMessage: 'Your search for "{search}" did not match any Series.', id: 'bv8xQ8' }
})

export const Search = React.forwardRef(
  (
    { onChange, count, isFetching }: { onChange: (query: string) => void; count: number; isFetching: boolean },
    ref: React.Ref<HTMLSpanElement>
  ) => {
    const { formatMessage: t } = useIntl()
    const inputRef = useRef<HTMLInputElement>()
    const [showClear, setShowClear] = useState(false)
    const [short, setShort] = useState(false)
    const { debounce } = useDebounce(onChange, 300)

    const error = useMemo(
      () => Boolean(!isFetching && inputRef.current?.value.length && count === 0),
      [count, isFetching]
    )

    const helperText = useMemo(
      () => (error ? t(messages.invalid, { search: inputRef.current?.value }) : short ? t(messages.short) : ' '),
      [error, t, short]
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        setShort(e.target.value.length > 0 && e.target.value.length < 3)
        setShowClear(value.length > 0)
        debounce(value)
      },
      [debounce]
    )

    const handleOnClick = useCallback(() => {
      inputRef.current!.value = ''
      setShowClear(false)
      setShort(false)
      onChange('')
    }, [onChange])

    return (
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        onChange={handleChange}
        placeholder={t(messages.placeholder)}
        helperText={helperText}
        error={error}
        slotProps={{
          htmlInput: {
            'data-testid': 'search-input'
          },
          input: {
            startAdornment: (
              <Icon
                className="fa-solid fa-search"
                sx={({ palette, spacing }) => ({
                  color: palette.text.secondary,
                  marginRight: spacing(1)
                })}
              />
            ),
            endAdornment: (
              <>
                {isFetching && (
                  <CircularProgress
                    size={20}
                    thickness={2}
                    sx={({ palette, spacing }) => ({
                      color: palette.text.secondary,
                      marginRight: spacing(1)
                    })}
                  />
                )}
                {showClear && (
                  <Icon
                    ref={ref}
                    className="fa-solid fa-xmark"
                    onClick={handleOnClick}
                    sx={({ palette }) => ({
                      color: palette.text.secondary,
                      cursor: 'pointer'
                    })}
                  />
                )}
              </>
            )
          }
        }}
      />
    )
  }
)
