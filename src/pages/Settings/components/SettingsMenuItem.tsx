import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

export const SettingsMenuItem = ({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) => {
  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={({ palette, spacing }) => ({
        p: spacing(2.5),
        borderRadius: spacing(2.5),
        '&.Mui-selected': {
          color: palette.primary.main,
          backgroundColor: '#DEE3FF'
        }
      })}
    >
      <ListItemText
        primary={text}
        primaryTypographyProps={{ sx: { fontSize: 16, fontWeight: selected ? 'bold' : 'regular' } }}
      />
    </ListItemButton>
  )
}
