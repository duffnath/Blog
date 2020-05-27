const isBrowser = typeof window !== `undefined`
const isReadyForAuth = typeof _adalInstance !== `undefined`

export const isLoggedIn = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false
  
    return _adalInstance?._user?.profile?.upn
      ? true : false
  }

export const isAdmin = () => {
  if (!isBrowser) return false
  if (!isReadyForAuth) return false

  return _adalInstance?._user?.profile.upn.endsWith("@nateduff.com")
    ? true : false
}
