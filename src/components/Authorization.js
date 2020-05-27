const isBrowser = typeof window !== `undefined`
const isReadyForAuth = typeof _adalInstance !== `undefined`

const adal = _adalInstance

export const isLoggedIn = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false

    return adal?._user?.profile?.upn
        ? true : false
}

export const isAdmin = () => {
  if (!isBrowser) return false
  if (!isReadyForAuth) return false

  return adal?._user?.profile.upn.endsWith("@nateduff.com")
    ? true : false
}

export const getUserName = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false
  
    return adal?._user?.profile.upn
}

export const getUserId = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false
  
    return adal?._user?.profile.oid
}