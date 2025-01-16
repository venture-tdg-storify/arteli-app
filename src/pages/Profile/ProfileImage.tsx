import type { SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import styled from '@mui/material/styles/styled'

const ImagePlaceholder = styled('div', { name: 'product-image' })<ImagePlaceholderProps>(
  ({ theme: { spacing, typography }, height, width }) => ({
    background: 'rgba(222, 224, 227, 1)',
    border: '1px solid rgba(223, 225, 229, 1)',
    borderRadius: 4,
    height,
    padding: spacing(0),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#B8BCC2',
    fill: '#B8BCC2',
    fontSize: '12px',
    fontWeight: typography.fontWeightBold,
    flexDirection: 'column',
    width: width || '100%'
  })
)

const Image = styled('img')(({ theme: { spacing }, height, width }) => ({
  objectFit: 'contain',
  objectPosition: 'center',
  height,
  marginLeft: spacing(0),
  width: width || '100%'
}))

export const ProfileImage = ({ img, height = 300, width, error = false, onLoad, onError }: IProfileImage) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {img && (
        <Image
          src={img}
          height={height}
          width={width}
          onLoad={onLoad}
          onError={onError}
          sx={{ display: `${error ? 'none' : 'flex'}`, borderRadius: 1 }}
        />
      )}
      <ImagePlaceholder height={height} width={width} sx={{ display: `${error || !img ? 'flex' : 'none'}` }}>
        <svg width="120" height="120" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.18343 13.478C3.8036 12.3981 1.78385 12.6381 0.683985 14.0179C-0.415879 15.3978 -0.155912 17.4175 1.22392 18.5174L122.809 114.506C124.189 115.605 126.208 115.365 127.308 113.986C128.408 112.606 128.168 110.586 126.788 109.486L5.18343 13.478ZM115.19 31.9957C115.19 24.9366 109.451 19.1973 102.391 19.1973H27.9206L36.0196 25.5965H102.391C105.931 25.5965 108.791 28.4562 108.791 31.9957V65.8715L95.2523 52.3332C92.1327 49.2136 87.0733 49.2136 83.9337 52.3332L77.7345 58.5324L82.7938 62.5319L88.4731 56.8526C89.0931 56.2327 90.1129 56.2327 90.7329 56.8526L108.791 74.9104V83.0494L115.19 88.1088V31.9957ZM59.5167 76.7502L57.597 78.67L44.0586 65.1316C40.939 62.012 35.8796 62.012 32.74 65.1316L19.2017 78.67V44.9341L12.8025 39.8747V95.9878C12.8025 103.047 18.5418 108.786 25.6009 108.786H100.072L91.9727 102.387H42.9188L64.5561 80.7497L59.4967 76.7502H59.5167ZM53.0775 83.1894L33.8799 102.387H25.6009C22.0613 102.387 19.2017 99.5274 19.2017 95.9878V87.7088L37.2595 69.6511C37.8794 69.0311 38.8993 69.0311 39.5192 69.6511L53.0775 83.1894Z" />
        </svg>
      </ImagePlaceholder>
    </Box>
  )
}

type ImagePlaceholderProps = {
  height?: number
} & React.HTMLProps<HTMLDivElement>

interface IProfileImage {
  img: string | null
  height?: number
  width?: number
  error?: boolean
  onLoad?: () => void
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void
}
