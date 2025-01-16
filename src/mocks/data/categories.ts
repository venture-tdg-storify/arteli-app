import type { Category } from '@/api/arteli'
import { getByProperty } from '@/utils'

export const categories: Category[] = [
  {
    id: '1.C.TW',
    externalId: 'ACCESS',
    name: 'Accessories',
    description: 'Accessories – wall art, table top, rugs, etc',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '2.C.TW',
    externalId: 'APPLIA',
    name: 'Appliance',
    description: 'Appliances',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '3.C.TW',
    externalId: 'BEDDI',
    name: 'Bedding',
    description: 'Mattresses',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '4.C.TW',
    externalId: 'BEDRO',
    name: 'Bedroom',
    description: 'Master bedroom, youth',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '5.C.TW',
    externalId: 'CASEG',
    name: 'Casegoods',
    description: 'Home Office, Entertainment',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '6.C.TW',
    externalId: 'CHAIRS',
    name: 'CHAIRS',
    description: 'We don’t use',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '7.C.TW',
    externalId: 'DININ',
    name: 'Dining',
    description: 'Dining',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '8.C.TW',
    externalId: 'ELECT',
    name: 'Electronics',
    description: 'Electronics',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '9.C.TW',
    externalId: 'METAL',
    name: 'METAL',
    description: 'We don’t use',
    isActive: true,
    isInActiveRecSet: false,
    operatingCost: 0.1
  },
  {
    id: '10.C.TW',
    externalId: 'MOTION',
    name: 'Motion',
    description: 'Motion Upholstery',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '11.C.TW',
    externalId: 'MSI',
    name: 'MSI',
    description: null,
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '12.C.TW',
    externalId: 'MST',
    name: 'MST',
    description: 'We don’t use',
    isActive: true,
    isInActiveRecSet: false,
    operatingCost: 0.1
  },
  {
    id: '17.C.TW',
    externalId: 'no-category',
    name: '<No Category>',
    description: null,
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '13.C.TW',
    externalId: 'OUTDR',
    name: 'Outdoor',
    description: 'Outdoor',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '14.C.TW',
    externalId: 'SVT',
    name: 'SVT',
    description: 'We don’t use',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '15.C.TW',
    externalId: 'UPHOL',
    name: 'Upholstery',
    description: 'Stationary Upholstery',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  },
  {
    id: '16.C.TW',
    externalId: 'WARRT',
    name: 'Warranty',
    description: 'Tangible Warranty like Matt pads',
    isActive: true,
    isInActiveRecSet: true,
    operatingCost: 0.1
  }
]

export const getCategoryById = getByProperty(categories, 'id')
export const getCategoryByExternalId = getByProperty(categories, 'externalId')
