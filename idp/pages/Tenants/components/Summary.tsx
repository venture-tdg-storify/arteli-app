import type { FC, ReactNode } from 'react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { type Tenant } from '$/api/system'
import { Overline } from '@/components/Summary/Overline'

const Action = styled('div')(() => ({
  marginLeft: 'auto'
}))

const messages = defineMessages({
  timezone: { defaultMessage: 'Timezone', id: '7nUCu9' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' },
  status: { defaultMessage: 'Status', id: 'tzMNF3' },
  id: { defaultMessage: 'Id', id: 'kGGU2D' },
  single: { defaultMessage: 'Single Store', id: 'u2cvWw' },
  multi: { defaultMessage: 'Multi Store', id: 'biOQ4y' },
  recommendationsType: { defaultMessage: 'Recommendation Type', id: 'Y9zg4/' }
})

const Info = ({ value, label, icon }: { label: ReactNode; value?: string; icon: string }) => (
  <Overline label={label} icon={icon} variant="gray">
    <Typography sx={({ palette }) => ({ fontSize: 16, fontWeight: 'bold', color: palette.text.secondary })}>
      {value}
    </Typography>
  </Overline>
)

type SummaryProps = {
  action?: ReactNode
  children?: ReactNode
  tenant?: Tenant
}

export const Summary: FC<SummaryProps> = ({ children, action, tenant }) => {
  const { formatMessage: t } = useIntl()

  return (
    <Stack
      sx={({ palette, spacing }) => ({
        height: 128,
        border: `1px solid ${palette.divider}`,
        borderRadius: spacing(1),
        mb: spacing(2),
        mt: spacing(1),
        padding: spacing(2)
      })}
      direction="column"
      alignItems="flex-start"
    >
      <Stack alignItems="center" justifyContent="flex-start">
        {action}
        <Typography
          sx={({ typography }) => ({ fontSize: 20, fontWeight: typography.fontWeightBold, mr: 1 })}
          component="h2"
        >
          {tenant?.name}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="flex-start" width="100%">
        <Info label={<FormattedMessage {...messages.id} />} value={tenant?.id} icon="fa-id-card" />
        <Info
          label={<FormattedMessage {...messages.status} />}
          value={t(tenant?.isActive ? messages.active : messages.inactive)}
          icon="fa-layer-group"
        />
        <Info
          label={<FormattedMessage {...messages.recommendationsType} />}
          value={t(messages.single)}
          icon="fa-database"
        />
        <Info label={<FormattedMessage {...messages.timezone} />} value={tenant?.defaultTimeZone} icon="fa-clock" />

        <Action>{children}</Action>
      </Stack>
    </Stack>
  )
}
