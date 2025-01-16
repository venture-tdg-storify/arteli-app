import type { ProductFlags, ProductTag } from '@/api/types.generated'
import type { FiltersSet } from '@/store/businessFilters'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useId, useMemo } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select from '@mui/material/Select'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { productFlagsMessages } from '@/utils/productFlags'
import { seriesFlagsDescription, type SeriesFlags } from '@/utils/seriesFlags'
import { FilterType, packId, serializeFilters, unserializeFilters } from './filters'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP
    }
  }
}

const messages = defineMessages({
  onlyCustomTag: { defaultMessage: 'Only series where all products have ’{tagName}’ tag', id: 'p3/dhS' },
  onlyFlag: { defaultMessage: 'Only ‘{flag}‘ series', id: 'EAFo5p' }
})

// @deprecated
export default function ShowOnlySelect({
  productTags = [],
  productFlags = [],
  seriesFlags = [],
  value,
  onChange,
  disabledProductTagIds = []
}: {
  productTags?: ProductTag[]
  productFlags?: ProductFlags[]
  seriesFlags?: SeriesFlags[]
  value: FiltersSet
  onChange: (value: FiltersSet) => void
  disabledProductTagIds?: ProductTag['id'][]
}) {
  const { formatMessage: t } = useIntl()

  const serializedValues = useMemo(() => serializeFilters(value, productTags), [productTags, value])

  const handleChange = ({ target: { value } }: SelectChangeEvent<string[]>) => {
    onChange(unserializeFilters(value))
  }

  const id = useId()

  return (
    <FormControl fullWidth>
      <Select
        id={id + '-select'}
        multiple
        value={serializedValues}
        displayEmpty
        onChange={handleChange}
        input={<OutlinedInput id={id + '-input'} fullWidth />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Select Flag Filter</em>
          }

          const { productFlags: productFlagsAny, seriesFlags, productTagIds } = unserializeFilters(selected)

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {productFlagsAny.map((flag) => (
                <Chip
                  key={`${FilterType.ProductFlag}:${flag}`}
                  label={t(messages.onlyFlag, { flag: t(productFlagsMessages[flag]) })}
                />
              ))}
              {productTagIds.map((tagId) => {
                const tag = productTags.find((tag) => tag.id === tagId)

                if (!tag) {
                  console.log('missing tag', tagId)
                  return null
                }

                return (
                  <Chip
                    key={`${FilterType.ProductTag}:${tagId}`}
                    label={t(messages.onlyCustomTag, { tagName: tag.name })}
                  />
                )
              })}
              {seriesFlags.map((flag) => (
                <Chip key={`${FilterType.ProductFlag}:${flag}`} label={t(seriesFlagsDescription[flag])} />
              ))}
            </Box>
          )
        }}
        MenuProps={MenuProps}
      >
        {productFlags.map((flag) => {
          const id = packId(FilterType.ProductFlag, flag)

          return (
            <MenuItem key={id} value={id}>
              <Checkbox checked={value.productFlags.includes(flag)} />
              <FormattedMessage {...messages.onlyFlag} values={{ flag: t(productFlagsMessages[flag]) }} />
            </MenuItem>
          )
        })}

        {seriesFlags.map((flag) => {
          const id = packId(FilterType.SeriesFlag, flag)

          return (
            <MenuItem key={id} value={id}>
              <Checkbox checked={value.seriesFlags.includes(flag)} />
              {t(seriesFlagsDescription[flag])}
            </MenuItem>
          )
        })}

        {productTags.map((tag) => {
          const id = packId(FilterType.ProductTag, tag.id)

          return (
            <MenuItem key={id} value={id} disabled={disabledProductTagIds.includes(tag.id)}>
              <Checkbox checked={value.productTagIds.includes(tag.id)} />
              <FormattedMessage {...messages.onlyCustomTag} values={{ tagName: <b>{tag.name}</b> }} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
