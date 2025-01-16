import type { Store } from '@/api/arteli'
import type { MessageDescriptor } from 'react-intl'
import { useMemo, useState } from 'react'
import { random } from '@arteli/utils'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { defineMessages, useIntl } from 'react-intl'
import { useAllStores } from '@/hooks/arteli'

const messages = defineMessages({
  inputLabel: { id: '7atLlm', defaultMessage: 'Store Filter' },
  allGroups: { id: '/f7CTb', defaultMessage: 'All Groups' },
  unspecifiedRegion: { id: '3wVI4A', defaultMessage: 'Unspecified' }
})

const NO_REGION_LABEL = '___unspecified_region___'

type StoreListItem = {
  id: Store['id'] | string
  storeIds: Store['id'][]
  label: string
  type: 'all_stores' | 'region' | 'store'
  region: string | null
}

export function StoresFilter({
  storeIds,
  onChange,
  fullWidth = false,
  showErrors = true,
  inputLabel = messages.inputLabel
}: {
  storeIds: Store['id'][]
  onChange: (storeIds: string[]) => void
  fullWidth?: boolean
  showErrors?: boolean
  inputLabel?: MessageDescriptor
}) {
  const { data: allStores, isFetching } = useAllStores()
  const { formatMessage: t } = useIntl()

  const storeListItems = useMemo(() => {
    const sortedStores = [...(allStores ?? [])].sort((a, b) => (a.externalId || '').localeCompare(b.externalId || ''))

    const regionLookup = sortedStores.reduce((regionLookup: { [regionName: string]: Store[] }, store: Store) => {
      ;(regionLookup[store.regionName ?? NO_REGION_LABEL] ??= []).push(store)

      return regionLookup
    }, {})

    const allStoresItem: StoreListItem[] =
      Object.keys(regionLookup).length > 1
        ? [
            {
              type: 'all_stores',
              region: null,
              id: random.String,
              storeIds: sortedStores.map((x) => x.id),
              label: t(messages.allGroups)
            }
          ]
        : []

    return [
      allStoresItem,
      ...Object.entries(regionLookup)
        .sort(([a], [b]) => (a === NO_REGION_LABEL && b !== NO_REGION_LABEL ? -1 : a.localeCompare(b)))
        .map(([region, stores]) => [
          {
            type: 'region',
            region,
            id: region,
            storeIds: stores.map((_) => _.id),
            label: region === NO_REGION_LABEL ? t(messages.unspecifiedRegion) : region
          },
          ...stores.map(
            ({ id, externalId, name }) =>
              ({
                type: 'store',
                region,
                id,
                storeIds: [id],
                label: `${externalId} ${name}`
              }) as StoreListItem
          )
        ])
    ].flat()
  }, [allStores, t])

  const value = useMemo(() => {
    if (storeIds.length === 1) {
      return storeListItems.find((store) => store.id === storeIds[0])
    }

    return storeListItems.find((li) => li.storeIds.every((x) => storeIds.includes(x)))
  }, [storeIds, storeListItems])

  const [open, setOpen] = useState<Record<string, boolean>>({})

  if (showErrors && (!storeListItems.length || !value)) return <Stack sx={{ width: '50%', maxWidth: 480 }} />

  return (
    <Autocomplete
      disabled={!storeListItems.length}
      loading={isFetching}
      limitTags={4}
      size="small"
      id="checkboxes-tags-demo"
      options={storeListItems}
      disableClearable
      onChange={(_, value) => {
        if (value.type === 'all_stores') {
          setOpen({})
        }
        if (value.type === 'region' || value.type === 'store') {
          setOpen({ [value.region!]: true })
        }
        onChange(value?.storeIds ?? [])
      }}
      value={value}
      getOptionLabel={({ type, label, region }) => {
        if (type === 'store') return `${region === NO_REGION_LABEL ? t(messages.unspecifiedRegion) : region} / ${label}`

        return label
      }}
      renderOption={(props, { id, type, storeIds, label, region }) => {
        const isOpen = region ? !open[region] : false

        if (type === 'store' && isOpen) return null

        const isChecked = storeIds.every((x) => value?.storeIds.includes(x))

        const isIndeterminate = !isChecked && type !== 'all_stores' && storeIds.some((x) => value?.storeIds.includes(x))

        return (
          <ListItem
            disableGutters
            {...props}
            key={id}
            secondaryAction={<Checkbox checked={isChecked} indeterminate={isIndeterminate} />}
          >
            <ListItemText
              primaryTypographyProps={{
                style: {
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  fontWeight: type === 'store' ? undefined : 'bold'
                }
              }}
              sx={{ ml: type === 'store' ? 3 : 0 }}
              primary={
                <>
                  {label}

                  {type === 'region' && (
                    <IconButton
                      sx={{ ml: 0.5, mr: 1 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setOpen({ ...open, [id]: !open[id] })
                      }}
                    >
                      <Icon
                        className="fa-chevron-up"
                        sx={{
                          fontSize: 20,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      />
                    </IconButton>
                  )}
                </>
              }
            />
          </ListItem>
        )
      }}
      style={{ width: fullWidth ? '100%' : '50%', maxWidth: fullWidth ? 'unset' : 480 }}
      renderInput={(params) => <TextField {...params} placeholder="Filter by store name" label={t(inputLabel)} />}
    />
  )
}
