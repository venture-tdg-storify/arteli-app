export const domain = import.meta.env.VITE_AUTH0_DOMAIN
export const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
export const audience = `https://${domain}/api/v2/`
export const scope = import.meta.env.VITE_AUTH0_SCOPE
