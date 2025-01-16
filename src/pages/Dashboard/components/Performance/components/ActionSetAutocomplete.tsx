import type { ActionSet } from '@/api/arteli'
import { useEffect, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from '@mui/material/Icon'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { defineMessages, useIntl } from 'react-intl'
import { useAllActionSets } from '@/hooks/arteli'

const messages = defineMessages({
  inputLabel: { id: 'fz0z4c', defaultMessage: 'Plan' },
  finalized: { id: 'Lu1PC0', defaultMessage: 'Finalized on' },
  id: { id: 'kGGU2D', defaultMessage: 'Id' }
})

const MAX_WIDTH = 300

const getIndex = (actionSetId: ActionSet['id']) => actionSetId.split('.')[0]

export function ActionSetAutocomplete({
  actionSetId,
  onChange
}: {
  actionSetId: ActionSet['id'] | null
  onChange: (actionSetId: ActionSet | null) => void
}) {
  const { data: allActionSets, isFetching } = useAllActionSets({ params: { statuses: ['Finalized'] } })
  const { formatMessage: t, formatDate } = useIntl()

  const actionSets = useMemo(
    () => [...(allActionSets ?? [])].sort((a, b) => (b.finalizedAt || '').localeCompare(a.finalizedAt || '')),
    [allActionSets]
  )

  useEffect(() => {
    if (actionSetId) return

    onChange(actionSets[0] ?? null)
  }, [actionSetId, actionSets, onChange])

  const value = useMemo(() => actionSets.find((store) => store.id === actionSetId), [actionSetId, actionSets])

  if (!actionSets.length || !value) return <Stack sx={{ width: '50%', maxWidth: MAX_WIDTH }} />

  return (
    <Autocomplete
      disabled={!actionSets.length}
      loading={isFetching}
      limitTags={4}
      size="small"
      id="checkboxes-tags-demo"
      options={actionSets}
      disableClearable
      onChange={(_, value) => {
        onChange(value?.id ? value : null)
      }}
      value={value}
      getOptionLabel={(option) => getIndex(option.id) + ' ' + formatDate(option.finalizedAt!)}
      renderOption={(props, option) => (
        <ListItem
          disableGutters
          {...props}
          // secondaryAction={<Checkbox checked={selected} />}
        >
          <ListItemAvatar sx={{ minWidth: 32 }}>
            <Icon className="fa-location-dot" sx={{ fontSize: 20 }} />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }
            }}
            secondaryTypographyProps={{ sx: ({ palette }) => ({ color: palette.text.quaternary }) }}
            primary={t(messages.finalized) + ' ' + formatDate(option.finalizedAt!)}
            secondary={
              <Typography sx={{ fontSize: 14, marginRight: 0.4, fontWeight: 'bold' }} component="span">
                {t(messages.id)}: {getIndex(option.id)}
              </Typography>
            }
          />
        </ListItem>
      )}
      style={{ width: '50%', maxWidth: MAX_WIDTH }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Filter by store name" label={t(messages.inputLabel)} />
      )}
    />
  )
}
