import { defineMessages } from 'react-intl'

export enum SeriesFlags {
  None = 0,
  Inactive = 1,
  NegativeMargin = 2,
  RecentlyRemoved = 4,
  RecentlyAdded = 8
}

export const seriesFlagsMessages = defineMessages({
  [SeriesFlags.None]: { defaultMessage: 'None', id: '450Fty' },
  [SeriesFlags.Inactive]: { defaultMessage: 'Inactive', id: '6Tps09' },
  [SeriesFlags.NegativeMargin]: { defaultMessage: 'NegativeMargin', id: 'bB8juZ' },
  [SeriesFlags.RecentlyRemoved]: { defaultMessage: 'RecentlyRemoved', id: '6VrV6t' },
  [SeriesFlags.RecentlyAdded]: { defaultMessage: 'RecentlyAdded', id: 'DR1iHF' }
})

export const seriesFlagsDescription = defineMessages({
  [SeriesFlags.None]: { defaultMessage: 'None', id: '450Fty' },
  [SeriesFlags.Inactive]: { defaultMessage: 'Only inactive series', id: 'cTjW4K' },
  [SeriesFlags.NegativeMargin]: { defaultMessage: 'Series with negative margin', id: 'jiNbad' },
  [SeriesFlags.RecentlyRemoved]: { defaultMessage: 'Series recently removed from the floor', id: '/29rRv' },
  [SeriesFlags.RecentlyAdded]: { defaultMessage: 'Series recently added to the floor', id: '1Sxrsk' }
})
