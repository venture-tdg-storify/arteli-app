import queryString from 'query-string'

export const getUrl = <Params = Record<string, string | number>>(
  originalUrl: string,
  params: Params = {} as Params
) => {
  const urlParams: string[] = []

  const url = originalUrl.replace(/:([A-Za-z_]\w+)/g, (_, param) => {
    const value = params?.[param as keyof Params]

    if (!['number', 'string'].includes(typeof value)) {
      throw new Error(`URL param missing: ${originalUrl.replace(`:${param}`, `-> :${param} <-`)}`)
    }

    urlParams.push(param)

    return value as string
  })

  const urlSearchParams = new URLSearchParams()

  Object.keys(params || {}).forEach((param) => {
    if (!urlParams.includes(param)) {
      urlSearchParams.set(param, params?.[param as keyof typeof params] as string)
    }
  })

  const queryParams = Object.fromEntries(Object.entries(params || {}).filter(([key]) => !urlParams.includes(key)))

  if (Object.keys(queryParams).length > 0) {
    return url.replace(/\?.+$/, '') + '?' + queryString.stringify(queryParams)
  }

  return url
}
