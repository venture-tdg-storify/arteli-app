import { useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from '@mui/material/Icon'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import api from '$/api'
import { UserRoles, type User } from '$/api/system'
import { allItemsQuery } from '@/utils/allItemsQuery'

const useAllUsersQuery = allItemsQuery(api.System.Users.findAll)

export function UserSelect({ userId, onChange }: { userId?: User['id']; onChange: (userId: User['id']) => void }) {
  const { data: users } = useAllUsersQuery()

  const options = useMemo(() => (users ?? []).sort((a, b) => (a.name || '').localeCompare(b.name || '')), [users])
  const value = useMemo(() => options.find((_) => _.id === userId), [userId, options])

  if (!options.length) return null

  return (
    <Autocomplete
      autoFocus
      openOnFocus
      fullWidth
      disabled={!options.length}
      options={options}
      disableClearable
      onChange={(_, value) => {
        if (!value) return

        onChange(value.id)
      }}
      value={value}
      getOptionLabel={(option) => option.name ?? option.id}
      renderOption={(props, option) => (
        <ListItem
          disableGutters
          {...props}
          secondaryAction={
            option.roles & UserRoles.Staff && (
              <Typography sx={{ mr: 2 }} variant="overline">
                Staff
              </Typography>
            )
          }
        >
          <ListItemAvatar sx={{ minWidth: 32 }} title="Zika">
            <Icon className={option.roles & UserRoles.Staff ? 'fa-user-tie' : 'fa-user'} sx={{ fontSize: 20 }} />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }
            }}
            secondaryTypographyProps={{ sx: ({ palette }) => ({ color: palette.text.quaternary }) }}
            primary={<>{option.name ?? option.id}</>}
            secondary={
              <Typography sx={{ fontSize: 14, marginRight: 0.4, fontWeight: 'bold' }} component="span">
                {option.email}
              </Typography>
            }
          />
        </ListItem>
      )}
      renderInput={(params) => <TextField {...params} />}
    />
  )
}
