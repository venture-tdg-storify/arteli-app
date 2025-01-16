import type { SelectChangeEvent } from '@mui/material/Select'
import type { MessageDescriptor } from 'react-intl'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { MeApi } from '$/api/system'
import { useUserValidationSchema } from '$/pages/Users/components/UserPanel/hooks'
import api from '@/api'
import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { Overline } from '@/components/StoreOverline/Overline'
import flagsConfig from '@/config/flags.config'
import { locales } from '@/config/locales.config'
import { modes } from '@/config/modes.config'
import { useMe } from '@/hooks/useMe'
import { useSession } from '@/hooks/useSession'
import { useSettings } from '@/hooks/useSettings'
import { toast } from '@/store/notifications'
import { ProfileImage } from './ProfileImage'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const useMeUpdateMutation = MeApi.update.asMutation()
const useQueryUser = api.Auth0.Users.findOne.asQuery()

const messages = defineMessages({
  label: { defaultMessage: 'Label', id: '753yX5' },
  selectLanguage: { defaultMessage: 'Select Language', id: 'ZMXbRJ' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  namePlaceholder: { defaultMessage: 'Enter full name', id: 'T3zU0j' },
  email: { defaultMessage: 'Email', id: 'sy+pv5' },
  lastLogin: { defaultMessage: 'Last Login:', id: 'GGgFx7' },
  totalLogins: { defaultMessage: 'Total Logins:', id: '2AuMYG' },
  profile: { defaultMessage: 'Profile', id: 'itPgxd' },
  theme: { defaultMessage: 'Theme', id: 'Pe0ogR' },
  selectTheme: { defaultMessage: 'Select Theme', id: 'xckwDy' },
  dark: { defaultMessage: 'Dark', id: 'tOdNiY' },
  light: { defaultMessage: 'Light', id: '3cc4Ct' },
  system: { defaultMessage: 'System', id: '+CwN9C' },
  picture: { defaultMessage: 'Picture Url', id: 'mMoGZF' },
  picturePlaceholder: { defaultMessage: 'Enter a full URL to your personal picture', id: 'kuSN9l' },
  success: { defaultMessage: 'Profile successfully updated', id: 'vgeAHP' },
  invalidUrl: { defaultMessage: 'Invalid url', id: '5lTANw' },
  save: { defaultMessage: 'Save', id: 'jvo0vs' },
  subtitle: { defaultMessage: 'Manage settings and personal information.', id: 'TOOqQF' }
})

type ModesMap = {
  [key: string]: MessageDescriptor
}

const modesMap: ModesMap = {
  dark: messages.dark,
  light: messages.light,
  system: messages.system
}

export function Profile() {
  const { user: auth0User } = useSession()
  const me = useMe()
  const { data: user } = useQueryUser({ params: { userId: auth0User?.sub || '' }, enabled: !!auth0User?.sub })
  const { locale, mode, setLocale, setMode } = useSettings()
  const { formatMessage: t } = useIntl()
  const [pictureUrl, setPictureUrl] = useState<string>('')
  const [pictureError, setPictureError] = useState('')
  const [pictureTouched, setPictureTouched] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: update } = useMeUpdateMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      formik.setSubmitting(false)
    }
  })

  const handleChange = (event: SelectChangeEvent) => {
    setLocale(event.target.value as string)
  }

  const handleChangeMode = (event: SelectChangeEvent) => {
    setMode(event.target.value as string)
  }

  const labelId = useId()
  const validationSchema = useUserValidationSchema()

  const initialValues = useMemo(
    () => ({
      name: me.user.name || '',
      email: me.user.email || ''
    }),
    [me]
  )

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validateOnBlur: false,
    validationSchema,
    onSubmit: () => update({ body: { pictureUrl } })
  })

  const handleSubmit = useCallback(() => {
    if (formik.isValid && pictureError === '' && (formik.dirty || pictureUrl !== me.user.pictureUrl)) {
      formik.handleSubmit()
    }
    // formik.handleBlur({ target: { name: 'picture' } })
  }, [formik, me.user.pictureUrl, pictureError, pictureUrl])

  useEffect(() => {
    setPictureUrl(me.user.pictureUrl ?? '')
  }, [me])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      setPictureError('')
    }
    setPictureTouched(true)
    setPictureUrl(e.target.value.trim())
  }, [])

  return (
    <>
      <PageHeader title={t(messages.profile)} subTitle={t(messages.subtitle)} />
      <Container>
        <Stack direction="row" spacing={10} width="100%" alignItems="start" justifyContent="start">
          <Box width={600}>
            <form>
              <TextField
                fullWidth
                id="name"
                name="name"
                placeholder={t(messages.namePlaceholder)}
                label={t(messages.name)}
                size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ marginTop: 1 }}
                disabled
              />
              <Separator />
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t(messages.email)}
                size="small"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled
              />
            </form>
            <Separator />
            <TextField
              fullWidth
              id="picture"
              name="picture"
              placeholder={t(messages.picturePlaceholder)}
              label={t(messages.picture)}
              size="small"
              value={pictureUrl}
              onChange={handleImageChange}
              // onBlur={formik.handleBlur}
              error={pictureTouched && pictureError.length > 0}
              helperText={pictureTouched && pictureError}
              disabled={formik.isSubmitting}
            />
            <Separator />
            <FormControl fullWidth disabled={!flagsConfig.allowLanguageSelection || formik.isSubmitting}>
              <InputLabel id={labelId}>
                <FormattedMessage {...messages.label} />
              </InputLabel>
              <Select
                labelId={labelId}
                id={labelId}
                value={locale}
                label={t(messages.selectLanguage)}
                onChange={handleChange}
                size="small"
                sx={{ textAlign: 'start' }}
              >
                {Object.values(locales).map((locale) => (
                  <MenuItem key={locale} value={locale}>
                    {locale}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {flagsConfig.alowTheming && (
              <>
                <Separator />
                <FormControl fullWidth disabled={formik.isSubmitting}>
                  <InputLabel>
                    <FormattedMessage {...messages.theme} />
                  </InputLabel>
                  <Select
                    value={mode}
                    label={t(messages.selectTheme)}
                    onChange={handleChangeMode}
                    size="small"
                    sx={{ textAlign: 'start' }}
                    disabled={formik.isSubmitting}
                  >
                    {Object.values(modes).map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        <FormattedMessage {...modesMap[mode]} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <Stack direction="row" mt={2} justifyContent="space-between" alignItems="center">
              <Stack direction="column" alignItems="start" mt={1} mb={2}>
                <Overline direction="row" label={<FormattedMessage {...messages.totalLogins} />}>
                  <Typography variant="body2">{user?.logins_count}</Typography>
                </Overline>
                <Overline direction="row" label={<FormattedMessage {...messages.lastLogin} />}>
                  <Typography variant="body2">{user?.last_ip}</Typography>
                </Overline>
              </Stack>
              <Button variant="contained" size="small" disabled={formik.isSubmitting} onClick={handleSubmit}>
                <FormattedMessage {...messages.save} />
              </Button>
            </Stack>
          </Box>
          <Box pt={1}>
            <ProfileImage
              img={pictureUrl}
              height={210}
              width={210}
              error={pictureError.length > 0}
              onLoad={() => setPictureError('')}
              onError={() => setPictureError(pictureUrl === null ? t(messages.invalidUrl) : '')}
            />
          </Box>
        </Stack>
      </Container>
    </>
  )
}
