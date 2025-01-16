import type { UserJobTypesType } from '@/api/arteli'
import type { MessageDescriptor } from 'react-intl'
import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Icon from '@mui/material/Icon'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useSettings } from '@/hooks/useSettings'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const messages = defineMessages({
  canNotLoadLoadFileContent: { defaultMessage: 'Can not load file content', id: 'ozEUi2' },
  addClientRank: { defaultMessage: 'Upload Current Series Rankings', id: 'KbAY5r' },
  addProductTags: { defaultMessage: 'Upload Product Tags', id: 'q/vWzj' },
  addSisterSeries: { defaultMessage: 'Upload Sister Series', id: 'ojLJVC' },
  addGroups: { defaultMessage: 'Upload Groups', id: '6/+oSL' }
})

const csvTypeToButtonLabel: Record<UserJobTypesType, MessageDescriptor> = {
  ClientRankCsv: messages.addClientRank,
  ProductFlagsCsv: messages.addProductTags,
  SisterSubgroupsCsv: messages.addSisterSeries,
  RegionsCsv: messages.addGroups
}

const mode: 'single' | 'multi' = 'single' // TODO: Remove

export default function UploadButtons({
  onSubmit
}: {
  onSubmit: (type: UserJobTypesType, fileContent: string, fileName?: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const { fileUploadType, setFileUploadType } = useSettings()

  const options: UserJobTypesType[] = React.useMemo(
    () =>
      mode === 'multi'
        ? ['ClientRankCsv', 'ProductFlagsCsv', 'SisterSubgroupsCsv']
        : ['ProductFlagsCsv', 'SisterSubgroupsCsv', 'RegionsCsv'],
    []
  )

  React.useEffect(() => {
    if (options.includes(fileUploadType)) return
    setFileUploadType('ProductFlagsCsv')
  }, [options, fileUploadType, setFileUploadType])

  const handleMenuItemClick = (_: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setFileUploadType(options[index])
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    const fileContent = await file?.text()

    if (!fileContent) {
      return
    }

    const fileName = file?.name

    onSubmit(fileUploadType, fileContent, fileName)
  }

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="Button group with a nested menu" sx={{}}>
        <InputLabel htmlFor="upload">
          <Button variant="contained" component="span">
            <FormattedMessage {...csvTypeToButtonLabel[fileUploadType]} />
          </Button>
        </InputLabel>
        <VisuallyHiddenInput
          type="file"
          accept="text/csv"
          sx={{ display: 'none' }}
          id="upload"
          onChange={handleFileChange}
        />
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <Icon className="fa-chevron-down" />
        </Button>
      </ButtonGroup>
      <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={option === fileUploadType}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      <FormattedMessage {...csvTypeToButtonLabel[option]} />
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
