const isBrowser = typeof window !== `undefined`
const isReadyForAuth = typeof _adalInstance !== `undefined`

const adal = typeof _adalInstance !== `undefined` ?
    _adalInstance : null;

export const isLoggedIn = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false

    return adal?._user?.profile?.upn
        ? true : false
}

export const isAdmin = () => {
  if (!isBrowser) return false
  if (!isReadyForAuth) return false

  return adal?._user?.profile.upn.endsWith("@nateduff.com") || process.env.NODE_ENV === 'development'
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