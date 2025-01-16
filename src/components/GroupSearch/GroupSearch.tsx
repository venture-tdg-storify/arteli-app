import type { Group } from '@/api/arteli'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from '@mui/material/Icon'
import TextField from '@mui/material/TextField'
import { defineMessages, useIntl } from 'react-intl'
import api from '@/api'
import { _1_HOUR } from '@/utils'

const useGroupQuery = api.Arteli.Groups.findAll.asQuery()

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
  invalid: { defaultMessage: 'Your search for "{search}" did not match any Series.', id: 'bv8xQ8' },
  short: { defaultMessage: 'Type more characters..', id: 'PeUSVk' },
  searching: { defaultMessage: 'Searching...', id: 'NNQzoi' }
})

export const GroupSearch = React.forwardRef(
  (
    { onSetId, isFetchingRecs }: { onSetId: (group: Group['id'][] | null) => void; isFetchingRecs: boolean },
    ref: React.Ref<HTMLSpanElement>
  ) => {
    const { formatMessage: t } = useIntl()
    const inputRef = useRef<HTMLInputElement>()
    const [touched, setTouched] = useState(false)
    const [search, setSearch] = useState('')
    const [short, setShort] = useState(false)
    const [showClear, setShowClear] = useState(false)
    const [error, setError] = useState(false)
    const { data, isFetching: isFetchingGroup } = useGroupQuery({
      params: { search },
      enabled: search.length > 2 || search.length === 0,
      staleTime: _1_HOUR
    })
    const { debounce } = useDebounce(setSearch, 300)

    const isFetching = useMemo(
      () => isFetchingGroup || (isFetchingRecs && Boolean(inputRef.current?.value.length)),
      [isFetchingGroup, isFetchingRecs]
    )

    const helperText = useMemo(
      () =>
        !touched
          ? ' '
          : isFetching
            ? t(messages.searching)
            : error
              ? t(messages.invalid, { search: inputRef.current?.value })
              : short
                ? t(messages.short)
                : ' ',
      [touched, isFetching, t, error, short]
    )

    useEffect(() => {
      if (data) {
        if (data.length === 0 && Boolean(inputRef.current && inputRef.current.value.length > 2)) {
          setError(true)
        }

        onSetId(inputRef.current && inputRef.current.value.length > 0 ? data.map(({ id }) => id) : null)
      }
    }, [onSetId, data])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTouched(true)
        setShort(e.target.value.length > 0 && e.target.value.length < 3)
        setShowClear(e.target.value.length > 0)
        setError(false)
        debounce(e.target.value)
      },
      [debounce]
    )

    const handleOnClick = useCallback(() => {
      inputRef.current!.value = ''
      setError(false)
      setShort(false)
      setShowClear(false)
      setSearch('')
    }, [])

    return (
      <TextField
        inputRef={inputRef}
        error={error}
        fullWidth
        size="small"
        onChange={handleChange}
        placeholder={t(messages.placeholder)}
        helperText={helperText}
        slotProps={{
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
