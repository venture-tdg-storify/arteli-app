import LinearProgress from '@mui/material/LinearProgress'

export function Loader() {
  return (
    <LinearProgress
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999
      }}
    />
  )
}
