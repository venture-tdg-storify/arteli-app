export type Env = 'Demo' | 'Staging' | 'Production' | 'Development'

const subDomainToEnv: Record<string, Env> = {
  app: 'Production',
  staging: 'Staging',
  demo: 'Demo'
}

/**
 * Get the Sentry environment based on the host
 * @param host The host of the application
 * @returns The Sentry environment
 */
export const getSentryEnv = (host: string): Env => subDomainToEnv[host.replace('.arteli.com', '')] ?? 'Development'
