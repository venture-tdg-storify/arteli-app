import type { Group } from '@/api/arteli'
import { getByProperty } from '@/utils'

export const groups: Group[] = [
  { id: '1.G.co', externalId: '10 Inch Bonnell PT', name: '10 Inch Bonnell PT', isActive: true },
  { id: '2.G.co', externalId: '10 Inch Chime Elite', name: '10 Inch Chime Elite', isActive: true },
  { id: '3.G.co', externalId: '10 Inch Chime Elite 2.0', name: '10 Inch Chime Elite 2.0', isActive: true },
  { id: '4.G.co', externalId: '10 Inch Chime Memory Foam', name: '10 Inch Chime Memory Foam', isActive: true },
  { id: '5.G.co', externalId: '10 Inch Memory Foam', name: '10 Inch Memory Foam', isActive: true },
  { id: '7.G.co', externalId: '10 Inch Pocketed Hybrid', name: '10 Inch Pocketed Hybrid', isActive: true },
  { id: '9.G.co', externalId: '12 Inch Ashley Hybrid', name: '12 Inch Ashley Hybrid', isActive: true },
  { id: '10.G.co', externalId: '12 Inch Chime Elite', name: '12 Inch Chime Elite', isActive: true },
  { id: '11.G.co', externalId: '12 Inch Chime Elite 2.0', name: '12 Inch Chime Elite 2.0', isActive: true },
  { id: '13.G.co', externalId: '12 Inch Memory Foam', name: '12 Inch Memory Foam', isActive: true },
  { id: '15.G.co', externalId: '12 Inch Pocketed Hybrid', name: '12 Inch Pocketed Hybrid', isActive: true },
  { id: '17.G.co', externalId: '14 Inch Ashley Hybrid', name: '14 Inch Ashley Hybrid', isActive: true },
  { id: '18.G.co', externalId: '14 Inch Chime Elite', name: '14 Inch Chime Elite', isActive: true },
  { id: '19.G.co', externalId: '14 Inch Chime Elite 2.0', name: '14 Inch Chime Elite 2.0', isActive: true },
  { id: '24.G.co', externalId: '6 Inch Bonnell', name: '6 Inch Bonnell', isActive: true },
  { id: '27.G.co', externalId: '8 Inch Bonnell Hybrid', name: '8 Inch Bonnell Hybrid', isActive: true },
  { id: '28.G.co', externalId: '8 Inch Chime Innerspring', name: '8 Inch Chime Innerspring', isActive: true },
  { id: '29.G.co', externalId: '8 Inch Memory Foam', name: '8 Inch Memory Foam', isActive: true },
  { id: '103.G.co', externalId: 'Adjustable Head', name: 'Adjustable Head', isActive: true },
  { id: '260.G.co', externalId: 'Anniversary Edition Firm', name: 'Anniversary Edition Firm', isActive: true },
  {
    id: '261.G.co',
    externalId: 'Anniversary Edition Pillowtop',
    name: 'Anniversary Edition Pillowtop',
    isActive: true
  },
  { id: '262.G.co', externalId: 'Anniversary Edition Plush', name: 'Anniversary Edition Plush', isActive: true },
  { id: '559.G.co', externalId: 'Better than a Boxspring', name: 'Better than a Boxspring', isActive: true },
  { id: '590.G.co', externalId: 'Blariden', name: 'Blariden', isActive: true },
  { id: '611.G.co', externalId: 'Bonita Springs Euro Top', name: 'Bonita Springs Euro Top', isActive: true },
  { id: '1054.G.co', externalId: 'Chime 10 Inch Hybrid', name: 'Chime 10 Inch Hybrid', isActive: true },
  { id: '1055.G.co', externalId: 'Chime 12 Inch Hybrid', name: 'Chime 12 Inch Hybrid', isActive: true },
  { id: '1056.G.co', externalId: 'Chime 12 Inch Memory Foam', name: 'Chime 12 Inch Memory Foam', isActive: true },
  { id: '1057.G.co', externalId: 'Chime 8 Inch Memory Foam', name: 'Chime 8 Inch Memory Foam', isActive: true },
  {
    id: '1959.G.co',
    externalId: 'Gerridan, Senniburg & Cottonburg',
    name: 'Gerridan, Senniburg & Cottonburg',
    isActive: true
  },
  { id: '1849.G.co', externalId: 'Foundation', name: 'Foundation', isActive: true },
  { id: '1973.G.co', externalId: 'Ginette', name: 'Ginette', isActive: true },
  { id: '2160.G.co', externalId: 'Head-Foot Model Best', name: 'Head-Foot Model Best', isActive: true },
  { id: '2161.G.co', externalId: 'Head-Foot Model Better', name: 'Head-Foot Model Better', isActive: true },
  { id: '2162.G.co', externalId: 'Head-Foot Model-Good', name: 'Head-Foot Model-Good', isActive: true },
  { id: '2190.G.co', externalId: 'High Profile', name: 'High Profile', isActive: true },
  {
    id: '2366.G.co',
    externalId: 'Janismore, Kanwyn & Beckincreek',
    name: 'Janismore, Kanwyn & Beckincreek',
    isActive: true
  },
  { id: '2942.G.co', externalId: 'Low Profile', name: 'Low Profile', isActive: true },
  {
    id: '3273.G.co',
    externalId: 'Millennium Luxury Gel Memory Foam',
    name: 'Millennium Luxury Gel Memory Foam',
    isActive: true
  },
  {
    id: '3274.G.co',
    externalId: 'Millennium Luxury Plush Gel Latex Hybrid',
    name: 'Millennium Luxury Plush Gel Latex Hybrid',
    isActive: true
  },
  { id: '3714.G.co', externalId: 'Promotional', name: 'Promotional', isActive: true },
  { id: '4119.G.co', externalId: 'Store Display', name: 'Store Display', isActive: true },
  { id: '4316.G.co', externalId: 'Tulen', name: 'Tulen', isActive: true },
  {
    id: '4327.G.co',
    externalId: 'Ultra Luxury ET with Memory Foam',
    name: 'Ultra Luxury ET with Memory Foam',
    isActive: true
  },
  {
    id: '4329.G.co',
    externalId: 'Ultra Luxury Firm Tight Top with Memory Foam',
    name: 'Ultra Luxury Firm Tight Top with Memory Foam',
    isActive: true
  },
  { id: '4330.G.co', externalId: 'Ultra Luxury PT with Latex', name: 'Ultra Luxury PT with Latex', isActive: true },
  { id: '4566.G.co', externalId: 'Z123 Pillow Series', name: 'Z123 Pillow Series', isActive: true },
  { id: '4623.G.co', externalId: 'iKidz Blue', name: 'iKidz Blue', isActive: true },
  { id: '4624.G.co', externalId: 'iKidz Coral', name: 'iKidz Coral', isActive: true },
  { id: '4626.G.co', externalId: 'iKidz Pink', name: 'iKidz Pink', isActive: true }
]

export const getGroupById = getByProperty(groups, 'id')
export const getGroupByExternalId = getByProperty(groups, 'externalId')
