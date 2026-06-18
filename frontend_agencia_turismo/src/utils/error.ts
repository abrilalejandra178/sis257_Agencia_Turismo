export function getApiErrorMessage(error: unknown, defaultMessage: string): string {
  if (typeof error !== 'object' || error === null) {
    return defaultMessage
  }

  const err = error as Record<string, unknown>
  const response = err.response as Record<string, unknown> | undefined
  const data = response?.data as Record<string, unknown> | undefined
  const apiMessage = data?.message as string | undefined
  const errMessage = err.message as string | undefined

  return apiMessage || errMessage || defaultMessage
}
