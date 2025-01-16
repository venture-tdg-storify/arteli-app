export const cleanRef = (ref: string) => {
  const cleanedRef = ref
    .replace('System.Resources.', '') // TODO: Make this as a parameter
    .replace('Arteli.Core.Data.', '') // TODO: Make this as a parameter
    .replace('Me.Resources.', '')
    .replace('#/components/schemas/', '')
    .split('.')
    .join('')
    .replace(/Resource/g, '')

  return cleanedRef
}

export const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

export const sortKeys = (obj: Record<string, unknown>) => Object.fromEntries(Object.entries(obj).sort())

export const toPascalCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
