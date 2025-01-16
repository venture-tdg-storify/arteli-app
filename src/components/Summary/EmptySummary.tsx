import type { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const Circle = styled('div')(() => ({
  backgroundColor: '#F5F6F7',
  position: 'absolute',
  height: 340,
  width: 340,
  borderRadius: '50%',
  zIndex: -1,
  left: -76,
  top: -31
}))

const Illustration = styled('div')(() => ({
  position: 'absolute',
  left: 31,
  top: 77,
  height: 124,
  width: 91
}))

const Action = styled('div')(() => ({
  alignSelf: 'flex-end'
}))

export const EmptySummary: FC<{
  children: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  additionAction?: ReactNode
}> = ({ children, title, subtitle, additionAction }) => (
  <Stack
    sx={({ palette, spacing }) => ({
      height: 168,
      border: `1px solid ${palette.divider}`,
      borderRadius: spacing(1),
      marginBottom: spacing(3),
      padding: spacing(2),
      paddingBottom: spacing(2.5),
      overflow: 'hidden',
      position: 'relative'
    })}
    direction="column"
    alignItems="flex-start"
  >
    <Circle />

    <Stack justifyContent="space-between" alignItems="flex-start" sx={{ width: '100%' }}>
      <Stack direction="column" alignItems="flex-start">
        <Typography
          sx={({ typography }) => ({ fontSize: 20, fontWeight: typography.fontWeightBold, mr: 1, lineHeight: 1 })}
          component="div"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={({ palette }) => ({ color: palette.text.secondary, fontSize: 14, mt: 1, lineHeight: 1 })}
            component="div"
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
      <Box sx={{ marginLeft: 'auto' }}>{additionAction}</Box>
    </Stack>

    <Illustration>
      <svg width="126" height="92" viewBox="0 0 126 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="125" height="92" rx="4.5" fill="white" />
        <rect x="0.5" y="0.5" width="125" height="92" rx="4.5" stroke="#E6E6E6" />
        <rect x="13" y="12" width="87" height="6" rx="3" fill="#E8EBED" />
        <rect x="13" y="26" width="49" height="6" rx="3" fill="#E8EBED" />
        <g clipPath="url(#clip0_1935_39662)">
          <path
            d="M99.25 43C99.25 49.2109 94.2109 54.25 88 54.25C87.7715 54.25 87.543 54.2441 87.3145 54.2266L86.2363 57.8945C86.8164 57.9648 87.4023 58 88 58C96.2852 58 103 51.2852 103 43C103 34.7148 96.2852 28 88 28C79.7148 28 73 34.7148 73 43C73 43.5977 73.0352 44.1836 73.1055 44.7637L76.7734 43.6855C76.7617 43.457 76.75 43.2285 76.75 43C76.75 36.7891 81.7891 31.75 88 31.75C94.2109 31.75 99.25 36.7891 99.25 43ZM96.4375 43C96.4375 38.3418 92.6582 34.5625 88 34.5625C83.3828 34.5625 79.6328 38.2656 79.5625 42.8652L83.4941 41.7109C84.0566 39.748 85.8613 38.3125 88 38.3125C90.5898 38.3125 92.6875 40.4102 92.6875 43C92.6875 45.1387 91.252 46.9492 89.2891 47.5059L88.1348 51.4316C92.7344 51.3672 96.4375 47.6172 96.4375 43Z"
            fill="#DEEBFF"
          />
          <path
            d="M87.2905 42.5488L75.2847 46.0762C74.4702 46.3164 74.3706 47.4356 75.1323 47.8164L78.4897 49.4981C78.5659 49.5391 78.6421 49.586 78.7065 49.6445L73.5503 54.8008C72.8179 55.5332 72.8179 56.7227 73.5503 57.4551C74.2827 58.1875 75.4722 58.1875 76.2046 57.4551L81.3608 52.2988C81.4194 52.3633 81.4722 52.4336 81.5073 52.5156L83.189 55.8731C83.5698 56.6348 84.689 56.5352 84.9292 55.7207L88.4565 43.7207C88.6675 43.0117 88.0054 42.3496 87.2905 42.5547V42.5488Z"
            fill="#060E17"
          />
        </g>
        <defs>
          <clipPath id="clip0_1935_39662">
            <rect width="30" height="30" fill="white" transform="translate(73 28)" />
          </clipPath>
        </defs>
      </svg>
    </Illustration>
    <Action>{children}</Action>
  </Stack>
)
