import { useMemo } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useSettings } from '@/hooks/useSettings'

const messages = defineMessages({
  categoryId: { defaultMessage: 'Category Id', id: 'lXafo8' },
  groupId: { defaultMessage: 'Group Id', id: 'gbA1TT' },
  subgroupId: { defaultMessage: 'Subgroup Id', id: '9TSET9' },
  seriesIds: { defaultMessage: 'Series Ids', id: 'WcuPbi' },
  rank: { defaultMessage: 'Rank', id: 'VP5+CR' },
  productId: { defaultMessage: 'Product Id', id: 'RkmVvZ' },
  tag: { defaultMessage: 'Tag', id: '18HJlm' },
  storeIds: { defaultMessage: 'Store Ids', id: 'Dzo/f2' },
  regionName: { defaultMessage: 'Region Name', id: 'XG+gWt' },
  groupName: { defaultMessage: 'Group Name', id: 'CaZvab' }
})

export const useCsvSample = () => {
  const { fileUploadType } = useSettings()
  const { formatMessage: t } = useIntl()

  return useMemo(() => {
    const content = {
      ClientRankCsv: [
        [t(messages.categoryId), t(messages.subgroupId), t(messages.rank)],
        ['ACCESS', 'ACF', '3'],
        ['ACCESS', 'LMP', '1'],
        ['BEDRO', 'JUV', '3'],
        ['MOTION', 'SML', '9'],
        ['UPHOL', 'ACH', '8'],
        ['UPHOL', 'FAB', '4'],
        ['UPHOL', 'SLE', '2']
      ],
      ProductFlagsCsv: [
        [t(messages.productId), t(messages.tag)],
        ['A2000650', 'Disco'],
        ['A8000398', 'Planned Drop'],
        ['A3000684', 'Planned Drop'],
        ['A3000684', 'Disco']
      ],
      SisterSubgroupsCsv: [
        [t(messages.categoryId), t(messages.groupId), t(messages.seriesIds)],
        ['BEDRO', 'Huey Vineyard & Anarasia', 'B128|B129'],
        ['BEDRO', 'Maribel & Bostwick Shoals', 'B138|B139'],
        ['BEDRO', 'Lodanna & Kaydell', 'B214|B1420'],
        ['BEDRO', 'Brinxton & Zelen', 'B249|B248']
      ],
      RegionsCsv: [
        [t(messages.groupName), t(messages.storeIds)],
        ['GroupOne', '262'],
        ['GroupTwo', '097|094'],
        ['GroupThree', '079|205|074']
      ]
    }[fileUploadType]

    const fileName = {
      ClientRankCsv: 'Arteli_Current_Series_Rankings_Sample.csv',
      ProductFlagsCsv: 'Arteli_Product_Tags_Sample.csv',
      SisterSubgroupsCsv: 'Arteli_Sister_Series_Sample.csv',
      RegionsCsv: 'Arteli_Groups_Sample.csv'
    }[fileUploadType]

    return { content: content.map((row) => row.join(',')).join('\n'), fileName }
  }, [t, fileUploadType])
}
