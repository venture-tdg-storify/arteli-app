import type { DataGridProProps } from '@mui/x-data-grid-pro'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { DataGridPro } from '@mui/x-data-grid-pro'
import cn from 'classnames'

const Container = styled('div')(() => ({ width: 'inherit', height: 'inherit' }))

type DataGridProps = DataGridProProps & {
  className?: string | undefined
}

const slotPropsProperty = {
  loadingOverlay: {
    variant: 'skeleton',
    noRowsVariant: 'skeleton'
  }
} as DataGridProProps['slotProps']

const NullComponent = () => null

const slotsProperty = {
  footer: NullComponent
} as DataGridProProps['slots']

export const DataGrid = forwardRef(({ className, ...props }: DataGridProps, ref: ForwardedRef<HTMLDivElement>) => (
  <Container ref={ref} className={cn(className)}>
    <DataGridPro
      disableChildrenSorting
      disableColumnMenu
      columnHeaderHeight={49}
      rowHeight={42}
      columnBufferPx={1024}
      rowBufferPx={768}
      slots={slotsProperty}
      slotProps={slotPropsProperty}
      {...props}
    />
  </Container>
))
