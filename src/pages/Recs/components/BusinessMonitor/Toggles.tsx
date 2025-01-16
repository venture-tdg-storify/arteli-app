import type { ProductFlags, ProductTag } from '@/api/types.generated'
import type { FiltersSet } from '@/store/businessFilters'
import type { SeriesFlags } from '@/utils/seriesFlags'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { productFlagsMessages } from '@/utils/productFlags'
import { seriesFlagsDescription } from '@/utils/seriesFlags'
import { FilterType, packId } from './filters'
import { Property } from './Property'

const messages = defineMessages({
  show: { defaultMessage: 'Show', id: 'K7AkdL' },
  hide: { defaultMessage: 'Hide', id: 'VA/Z1S' },
  newSeries: { defaultMessage: '‘New’ series', id: 'FHgzyd' },
  exclusiveSeries: { defaultMessage: '‘Exclusive’ series', id: 'H7oxoh' },
  recentlyAdded: { defaultMessage: 'Series recently added to the floor', id: '1Sxrsk' },
  customTag: { defaultMessage: 'Series where all products have {tagName} tag', id: 'eZiZBb' },
  onlyCustomTag: { defaultMessage: 'Only series where all products have {tagName} tag', id: 'oYAe1M' },
  flag: { defaultMessage: '{flag} series', id: '5NEalT' },
  onlyFlag: { defaultMessage: 'Only {flag} series', id: '5w8DFS' }
})

export const Toggles = ({
  productTags = [],
  productFlags = [],
  seriesFlags = [],
  value,
  onChange,
  disabledProductTagIds = [],
  onlyPrefix = false
}: {
  productTags?: ProductTag[]
  productFlags?: ProductFlags[]
  seriesFlags?: SeriesFlags[]
  value: FiltersSet
  onChange: (value: FiltersSet) => void
  disabledProductTagIds?: ProductTag['id'][]
  onlyPrefix?: boolean
}) => {
  const { formatMessage: t } = useIntl()

  const handleChangeProductFlag = (flag: ProductFlags) => (checked: boolean) => {
    onChange({
      ...value,
      productFlags: checked ? [...value.productFlags, flag] : value.productFlags.filter((f) => f !== flag)
    })
  }

  const handleChangeSeriesFlag = (flag: SeriesFlags) => (checked: boolean) => {
    onChange({
      ...value,
      seriesFlags: checked ? [...value.seriesFlags, flag] : value.seriesFlags.filter((f) => f !== flag)
    })
  }

  const handleChangeProductTag = (tag: ProductTag) => (checked: boolean) => {
    onChange({
      ...value,
      productTagIds: checked ? [...value.productTagIds, tag.id] : value.productTagIds.filter((f) => f !== tag.id)
    })
  }

  return (
    <>
      {productFlags.map((flag, index) => (
        <Property
          key={packId(FilterType.ProductFlag, flag)}
          divider={Boolean(index)}
          checked={value.productFlags.includes(flag)}
          onChange={handleChangeProductFlag(flag)}
        >
          <FormattedMessage
            {...(onlyPrefix ? messages.onlyFlag : messages.flag)}
            values={{ flag: <b>{t(productFlagsMessages[flag])}</b> }}
          />
        </Property>
      ))}

      {seriesFlags.map((flag, index) => (
        <Property
          key={packId(FilterType.SeriesFlag, flag)}
          divider={Boolean(index) || productFlags.length > 0}
          checked={value.seriesFlags.includes(flag)}
          onChange={handleChangeSeriesFlag(flag)}
        >
          {t(seriesFlagsDescription[flag])}
        </Property>
      ))}

      {productTags.map((tag, index) => (
        <Property
          key={packId(FilterType.ProductTag, tag.id)}
          divider={Boolean(index) || productFlags.length + seriesFlags.length > 0}
          checked={value.productTagIds.includes(tag.id)}
          onChange={handleChangeProductTag(tag)}
          disabled={disabledProductTagIds.includes(tag.id)}
        >
          <FormattedMessage
            {...(onlyPrefix ? messages.onlyCustomTag : messages.customTag)}
            values={{ tagName: <b>{tag.name === 'Disco' ? 'Discontinued' : tag.name}</b> }}
          />
        </Property>
      ))}
    </>
  )
}
