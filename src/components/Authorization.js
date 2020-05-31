const isBrowser = typeof window !== `undefined`
const isReadyForAuth = typeof _adalInstance !== `undefined`

const adal = typeof _adalInstance !== `undefined` ?
    _adalInstance : null;

export const isLoggedIn = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false

    return adal?._user?.profile?.upn || adal?._user?.profile?.email
        ? true : false
}

export const isAdmin = () => {
  if (!isBrowser) return false
  if (!isReadyForAuth) return false

  return adal?._user?.profile.upn || process.env.NODE_ENV === 'development'
    ? true : false
}

export const getUserName = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false

    if (adal?._user?.profile.upn !== undefined) {
        return adal?._user?.profile.upn
    } else {
        return adal?._user?.profile?.email
    }
}

export const getUserId = () => {
    if (!isBrowser) return false
    if (!isReadyForAuth) return false
  
    return adal?._user?.profile.oid
}