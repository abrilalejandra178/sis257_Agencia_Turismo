export function getTokenFromLocalStorage(): string {
  return sessionStorage.getItem('token') || ''
}