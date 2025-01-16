import { useCallback, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import Icon from '@mui/material/Icon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  selectAll: { id: 'WKiQ7K', defaultMessage: '(Select All)' },
  search: { id: '0BUTMv', defaultMessage: 'Search...' }
})

const ITEM_HEIGHT = 48

export const GridFilter = <T extends string>({
  options,
  value,
  onChange
}: {
  options: T[]
  value: T[]
  onChange: (values: T[]) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { formatMessage: t } = useIntl()

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget), [])

  const handleClose = useCallback(() => setAnchorEl(null), [])

  const handleToggleOption = (option: T) => () => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
  }

  const handleToggleAll = () => {
    onChange(value.length === options.length ? [] : options)
  }

  const filterActive = options.length != value.length

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuList
          sx={({ spacing }) => ({ overflow: 'auto', maxHeight: ITEM_HEIGHT * 6.5, minWidth: spacing(30) })}
          dense
        >
          <MenuItem key="all" value="all" onClick={handleToggleAll}>
            <Checkbox
              checked={value.length === options.length}
              indeterminate={value.length > 0 && filterActive}
              edge="start"
            />
            <ListItemText primary={t(messages.selectAll)} />
          </MenuItem>
          {options.sort().map((option) => (
            <MenuItem key={option} value={option} onClick={handleToggleOption(option)}>
              <Checkbox checked={value.includes(option)} edge="start" />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Icon
        onClick={handleClick}
        className="fa-bars-filter"
        sx={(theme) => ({
          ml: 'auto',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: filterActive ? theme.palette.primary.light : theme.palette.text.primary
        })}
      />
    </>
  )
}
