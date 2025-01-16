import type { Subcategory } from '@/api/arteli'
import { getByProperty } from '@/utils'

export const subcategories: Subcategory[] = [
  {
    id: '2.S.Eb',
    externalId: 'ACC',
    name: 'ACC',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  {
    id: '3.S.Eb',
    externalId: 'ACF',
    name: 'ACF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  {
    id: '4.S.Eb',
    externalId: 'ACH',
    name: 'ACH',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '5.S.Eb',
    externalId: 'ACP',
    name: 'ACP',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  { id: '6.S.Eb', externalId: 'AIR', name: 'AIR', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '7.S.Eb', externalId: 'APP', name: 'APP', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '8.S.Eb', externalId: 'AUD', name: 'AUD', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '9.S.Eb', externalId: 'BFR', name: 'BFR', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '10.S.Eb',
    externalId: 'BRM',
    name: 'BRM',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['5.C.TW']
  },
  { id: '11.S.Eb', externalId: 'CBL', name: 'CBL', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '12.S.Eb', externalId: 'COT', name: 'COT', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '13.S.Eb', externalId: 'DIS', name: 'DIS', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '14.S.Eb',
    externalId: 'DRC',
    name: 'DRC',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['8.C.TW']
  },
  { id: '15.S.Eb', externalId: 'DRF', name: 'DRF', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '16.S.Eb', externalId: 'DRM', name: 'DRM', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '17.S.Eb', externalId: 'DRY', name: 'DRY', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '18.S.Eb', externalId: 'ELE', name: 'ELE', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '19.S.Eb',
    externalId: 'EUN',
    name: 'EUN',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['6.C.TW']
  },
  {
    id: '20.S.Eb',
    externalId: 'FAB',
    name: 'FAB',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  { id: '21.S.Eb', externalId: 'FIR', name: 'FIR', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '22.S.Eb',
    externalId: 'FND',
    name: 'FND',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['4.C.TW']
  },
  { id: '23.S.Eb', externalId: 'FRE', name: 'FRE', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '24.S.Eb',
    externalId: 'FSE',
    name: 'FSE',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  { id: '25.S.Eb', externalId: 'GRN', name: 'GRN', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '26.S.Eb', externalId: 'GWP', name: 'GWP', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '27.S.Eb',
    externalId: 'HOF',
    name: 'HOF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['6.C.TW']
  },
  {
    id: '28.S.Eb',
    externalId: 'JUV',
    name: 'JUV',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['5.C.TW']
  },
  {
    id: '29.S.Eb',
    externalId: 'LEA',
    name: 'LEA',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  { id: '30.S.Eb', externalId: 'LIN', name: 'LIN', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '31.S.Eb',
    externalId: 'LMP',
    name: 'LMP',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  {
    id: '32.S.Eb',
    externalId: 'LSE',
    name: 'LSE',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '33.S.Eb',
    externalId: 'MBS',
    name: 'MBS',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['4.C.TW']
  },
  {
    id: '34.S.Eb',
    externalId: 'MCF',
    name: 'MCF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  {
    id: '35.S.Eb',
    externalId: 'MCL',
    name: 'MCL',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  { id: '36.S.Eb', externalId: 'MIC', name: 'MIC', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '37.S.Eb',
    externalId: 'MSF',
    name: 'MSF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  { id: '38.S.Eb', externalId: 'MSI', name: 'MSI', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '39.S.Eb',
    externalId: 'MSL',
    name: 'MSL',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  {
    id: '40.S.Eb',
    externalId: 'MST',
    name: 'MST',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['13.C.TW']
  },
  { id: '41.S.Eb', externalId: 'MTB', name: 'MTB', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '68.S.Eb',
    externalId: '[No GroupID] [ACCESS]',
    name: '[No GroupID] [ACCESS]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '69.S.Eb',
    externalId: '[No GroupID] [APPLIA]',
    name: '[No GroupID] [APPLIA]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '70.S.Eb',
    externalId: '[No GroupID] [BEDDI]',
    name: '[No GroupID] [BEDDI]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '71.S.Eb',
    externalId: '[No GroupID] [BEDRO]',
    name: '[No GroupID] [BEDRO]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '72.S.Eb',
    externalId: '[No GroupID] [CASEG]',
    name: '[No GroupID] [CASEG]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '73.S.Eb',
    externalId: '[No GroupID] [CHAIRS]',
    name: '[No GroupID] [CHAIRS]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '74.S.Eb',
    externalId: '[No GroupID] [DININ]',
    name: '[No GroupID] [DININ]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['8.C.TW']
  },
  {
    id: '75.S.Eb',
    externalId: '[No GroupID] [ELECT]',
    name: '[No GroupID] [ELECT]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '76.S.Eb',
    externalId: '[No GroupID] [METAL]',
    name: '[No GroupID] [METAL]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '77.S.Eb',
    externalId: '[No GroupID] [MOTION]',
    name: '[No GroupID] [MOTION]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  {
    id: '78.S.Eb',
    externalId: '[No GroupID] [MST]',
    name: '[No GroupID] [MST]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '79.S.Eb',
    externalId: '[No GroupID] [No Category]',
    name: '[No GroupID] [No Category]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '80.S.Eb',
    externalId: '[No GroupID] [OUTDR]',
    name: '[No GroupID] [OUTDR]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '81.S.Eb',
    externalId: '[No GroupID] [SVT]',
    name: '[No GroupID] [SVT]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '82.S.Eb',
    externalId: '[No GroupID] [UPHOL]',
    name: '[No GroupID] [UPHOL]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '83.S.Eb',
    externalId: '[No GroupID] [WARRT]',
    name: '[No GroupID] [WARRT]',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  {
    id: '1.S.Eb',
    externalId: '<No Value>',
    name: '<No Value>',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: []
  },
  { id: '42.S.Eb', externalId: 'OAC', name: 'OAC', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '43.S.Eb',
    externalId: 'ODN',
    name: 'ODN',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['14.C.TW']
  },
  {
    id: '44.S.Eb',
    externalId: 'OFP',
    name: 'OFP',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['14.C.TW']
  },
  {
    id: '45.S.Eb',
    externalId: 'OTB',
    name: 'OTB',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '46.S.Eb',
    externalId: 'OUP',
    name: 'OUP',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['14.C.TW']
  },
  { id: '47.S.Eb', externalId: 'PAD', name: 'PAD', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '48.S.Eb',
    externalId: 'PBS',
    name: 'PBS',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['4.C.TW']
  },
  { id: '49.S.Eb', externalId: 'PIC', name: 'PIC', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '50.S.Eb',
    externalId: 'PIL',
    name: 'PIL',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['4.C.TW']
  },
  {
    id: '51.S.Eb',
    externalId: 'RAN',
    name: 'RAN',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['3.C.TW']
  },
  {
    id: '52.S.Eb',
    externalId: 'REF',
    name: 'REF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['3.C.TW']
  },
  {
    id: '53.S.Eb',
    externalId: 'RUG',
    name: 'RUG',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  { id: '54.S.Eb', externalId: 'SAC', name: 'SAC', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '55.S.Eb', externalId: 'SAP', name: 'SAP', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '56.S.Eb', externalId: 'SCH', name: 'SCH', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '57.S.Eb',
    externalId: 'SLE',
    name: 'SLE',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['16.C.TW']
  },
  {
    id: '58.S.Eb',
    externalId: 'SMF',
    name: 'SMF',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  {
    id: '59.S.Eb',
    externalId: 'SML',
    name: 'SML',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['11.C.TW']
  },
  { id: '60.S.Eb', externalId: 'SVT', name: 'SVT', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '61.S.Eb',
    externalId: 'TOB',
    name: 'TOB',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  { id: '62.S.Eb', externalId: 'TVS', name: 'TVS', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '63.S.Eb', externalId: 'WAS', name: 'WAS', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  {
    id: '64.S.Eb',
    externalId: 'WRT',
    name: 'WRT',
    isActive: true,
    isInActiveRecSet: true,
    categoryIds: ['2.C.TW']
  },
  { id: '65.S.Eb', externalId: 'XFT', name: 'XFT', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '66.S.Eb', externalId: 'XLT', name: 'XLT', isActive: true, isInActiveRecSet: true, categoryIds: [] },
  { id: '67.S.Eb', externalId: 'XMT', name: 'XMT', isActive: true, isInActiveRecSet: true, categoryIds: [] }
]

export const getSubcategoryById = getByProperty(subcategories, 'id')
export const getSubcategoryByExternalId = getByProperty(subcategories, 'externalId')
