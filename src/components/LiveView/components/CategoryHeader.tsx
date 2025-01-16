import type { Category } from '@/api/types.generated'
import type { GridColumnHeaderParams, GridValidRowModel } from '@mui/x-data-grid-pro'
import { useContext, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GridFilter } from '../../grid/GridFilter'
import { GridContext } from '../GridContext'

export const CategoryHeader = <T extends GridValidRowModel>({ colDef: { headerName } }: GridColumnHeaderParams<T>) => {
  const { selectedCategoryExternalIds, setSelectedCategoryExternalIds, categoryExternalIds } = useContext(GridContext)

  useEffect(() => {
    setSelectedCategoryExternalIds(categoryExternalIds)
  }, [categoryExternalIds, setSelectedCategoryExternalIds])

  return (
    <div style={{ width: '100%', whiteSpace: 'normal' }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography
          component="span"
          sx={{ float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14, fontWeight: 500 }}
        >
          {headerName}
        </Typography>
        <GridFilter<Category['externalId']>
          options={categoryExternalIds}
          value={selectedCategoryExternalIds}
          onChange={setSelectedCategoryExternalIds}
        />
      </Stack>
    </div>
  )
}
